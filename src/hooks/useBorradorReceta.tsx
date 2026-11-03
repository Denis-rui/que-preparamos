import { useProtectorSalida } from "@/components/crear/protectorSalida";
import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import {
  eliminarBorrador,
  guardarBorrador,
  leerBorrador,
} from "@/storage/borrador-receta";
import { BorradorReceta, EstadoEdicionReceta } from "@/types/borradorReceta";
import { Perfil } from "@/types/perfil";
import { Platform } from "expo";
import {
  router,
  useFocusEffect,
  useIsFocused,
  usePreventRemove,
} from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, BackHandler } from "react-native";

type Restaurar = (edicion: EstadoEdicionReceta | null) => Promise<void>;

const useBorradorReceta = (
  usuarioId: number,
  edicion: EstadoEdicionReceta,
  restaurar: Restaurar,
  ocupado: boolean,
) => {
  const { registrar } = useProtectorSalida();
  const enfocado = useIsFocused();

  const inicial = useRef(copiar(edicion));
  const actual = useRef(edicion);
  const base = useRef(copiar(edicion));
  const restaurarActual = useRef(restaurar);
  const ocupadoActual = useRef(ocupado);

  const guardado = useRef<BorradorReceta | null>(null);
  const cargado = useRef(false);
  const dialogoAbierto = useRef(false);

  const [bloqueado, setBloqueado] = useState(true);
  const [permitirSalida, setPermitirSalida] = useState(false);
  const [actualizarRevision, setActualizarRevision] = useState(0);

  actual.current = edicion;
  restaurarActual.current = restaurar;
  ocupadoActual.current = ocupado;

  const comprobarSalida = useRef<(continuar: () => void) => void>((continuar) =>
    continuar(),
  );

  const hayCambios = huella(edicion) !== huella(base.current);

  const desactivarPrecencion = usePreventRemove(
    enfocado && hayCambios && !permitirSalida,
    ({ repeat }) => {
      comprobarSalida.current(repeat);
    },
  );

  const desactivarPrevencion = usePreventRemove(
    enfocado && hayCambios && !permitirSalida,
    ({ repeat }) => {
      comprobarSalida.current(repeat);
    },
  );

  const desactivarActual = useRef(desactivarPrevencion);

  desactivarActual.current = desactivarPrevencion;
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      let trabajando = false;

      setPermitirSalida(false);
      setBloqueado(true);
      cargado.current = false;
      dialogoAbierto.current = false;

      function mismaCuenta(): boolean {
        return (
          clienteQuery.getQueryData<Perfil | null>(CLAVE_SESION)?.id ===
          usuarioId
        );
      }

      function vigente(): boolean {
        return activo && mismaCuenta();
      }

      async function aplicar(
        estado: EstadoEdicionReceta | null,
      ): Promise<void> {
        await restaurarActual.current(estado);

        if (!vigente()) return;

        const recuperado = estado ?? inicial.current;

        actual.current = recuperado;
        base.current = copiar(recuperado);

        setActualizarRevision((numero) => numero + 1);
      }

      function salir(continuar: () => void): void {
        if (!vigente()) return;

        setPermitirSalida(true);
        desactivarActual.current();
        continuar();
      }

      async function ejecutar(
        operacion: () => Promise<void>,
        despues?: () => void,
        reintentar?: () => void,
      ): Promise<void> {
        if (!vigente() || trabajando) return;

        trabajando = true;
        setBloqueado(true);

        try {
          await operacion();

          if (!vigente()) return;

          dialogoAbierto.current = false;
          setBloqueado(false);
          despues?.();
        } catch (error) {
          if (!vigente()) return;

          dialogoAbierto.current = false;
          setBloqueado(Boolean(reintentar));

          Alert.alert(
            "No pudimos completar la acción",
            error instanceof Error ? error.message : "Inténtalo nuevamente.",
            [
              {
                text: "Aceptar",
                onPress: reintentar,
              },
            ],
          );
        } finally {
          trabajando = false;
        }
      }

      function confirmarNueva(): void {
        if (!vigente()) return;

        dialogoAbierto.current = true;

        Alert.alert(
          "¿Empezar una nueva receta?",
          "Se eliminará el borrador guardado y el formulario quedará vacío.",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => {
                if (guardado.current) {
                  mostrarRegreso(guardado.current);
                } else {
                  void cargar();
                }
              },
            },
            {
              text: "Nueva receta",
              style: "destructive",
              onPress: () => {
                void ejecutar(
                  async () => {
                    await eliminarBorrador(usuarioId);
                    guardado.current = null;
                    await aplicar(null);
                  },
                  undefined,
                  () => void cargar(),
                );
              },
            },
          ],
          { cancelable: false },
        );
      }

      function mostrarRegreso(borrador: BorradorReceta): void {
        if (!vigente()) return;

        dialogoAbierto.current = true;

        Alert.alert(
          "Tienes una receta pendiente",
          "¿Quieres seguir editando el borrador o empezar una nueva receta?",
          [
            {
              text: "Seguir editando",
              onPress: () => {
                void ejecutar(
                  () => aplicar(borrador.edicion),
                  undefined,
                  () => mostrarRegreso(borrador),
                );
              },
            },
            {
              text: "Nueva receta",
              onPress: confirmarNueva,
            },
          ],
          { cancelable: false },
        );
      }

      async function cargar(): Promise<void> {
        setBloqueado(true);
        cargado.current = false;

        try {
          const borrador = await leerBorrador(usuarioId);

          if (!vigente()) return;

          guardado.current = borrador;
          cargado.current = true;

          if (borrador) {
            mostrarRegreso(borrador);
          } else {
            await aplicar(null);

            if (vigente()) {
              setBloqueado(false);
            }
          }
        } catch (error) {
          if (!vigente()) return;

          Alert.alert(
            "No pudimos abrir el borrador",
            error instanceof Error ? error.message : "Inténtalo nuevamente.",
            [
              {
                text: "Reintentar",
                onPress: () => void cargar(),
              },
              {
                text: "Nueva receta",
                onPress: confirmarNueva,
              },
            ],
            { cancelable: false },
          );
        }
      }

      comprobarSalida.current = (continuar) => {
        // Una expiración o un cambio de cuenta no deben
        // quedar bloqueados por el formulario anterior.
        if (!mismaCuenta()) {
          setPermitirSalida(true);
          desactivarActual.current();
          continuar();
          return;
        }

        if (!activo || dialogoAbierto.current || trabajando) {
          return;
        }

        if (ocupadoActual.current) {
          Alert.alert("Espera un momento", "Hay una operación en curso.");
          return;
        }

        if (
          !cargado.current ||
          huella(actual.current) === huella(base.current)
        ) {
          salir(continuar);
          return;
        }

        dialogoAbierto.current = true;

        Alert.alert(
          "Tienes cambios sin guardar",
          "¿Qué quieres hacer antes de salir?",
          [
            {
              text: "Guardar borrador",
              onPress: () => {
                void ejecutar(
                  async () => {
                    const borrador = await guardarBorrador(
                      usuarioId,
                      actual.current,
                    );

                    if (!vigente()) return;

                    guardado.current = borrador;
                    await aplicar(borrador.edicion);
                  },
                  () => salir(continuar),
                );
              },
            },
            {
              text: "Descartar cambios",
              style: "destructive",
              onPress: () => {
                void ejecutar(
                  () => aplicar(guardado.current?.edicion ?? null),
                  () => salir(continuar),
                );
              },
            },
            {
              text: "Seguir editando",
              style: "cancel",
              onPress: () => {
                dialogoAbierto.current = false;
              },
            },
          ],
          { cancelable: false },
        );
      };

      const quitarRegistro = registrar((continuar) => {
        comprobarSalida.current(continuar);
      });

      const suscripcionAtras =
        Platform.OS === "android"
          ? BackHandler.addEventListener("hardwareBackPress", () => {
              comprobarSalida.current(() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  BackHandler.exitApp();
                }
              });

              return true;
            })
          : null;

      void cargar();

      return () => {
        activo = false;
        quitarRegistro();
        suscripcionAtras?.remove();
        dialogoAbierto.current = false;
        comprobarSalida.current = (continuar) => continuar();
      };
    }, [usuarioId, registrar]),
  );
  async function limpiarTrasGuardado(): Promise<string | null> {
    let aviso: string | null = null;

    try {
      await eliminarBorrador(usuarioId);
      guardado.current = null;
    } catch {
      aviso =
        "La receta se guardó en tu cuenta, pero no pudimos eliminar su borrador del teléfono.";
    }

    base.current = copiar(inicial.current);
    setActualizarRevision((numero) => numero + 1);

    return aviso;
  }

  return {
    bloqueado,
    limpiarTrasGuardado,
  };
};

export default useBorradorReceta;

const copiar = (edicion: EstadoEdicionReceta): EstadoEdicionReceta => {
  return JSON.parse(JSON.stringify(edicion));
};

const huella = (edicion: EstadoEdicionReceta): string => {
  return JSON.stringify(edicion);
};
