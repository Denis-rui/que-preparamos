import { useProtectorSalida } from "@/components/crear/protectorSalida";
import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import {
  eliminarBorrador,
  guardarBorrador,
  leerBorrador,
} from "@/storage/borrador-receta";
import { EstadoEdicionReceta } from "@/types/borradorReceta";
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

// TYPES

type Continuar = () => void;
type Restaurar = (edicion: EstadoEdicionReceta | null) => Promise<void>;
type Carga =
  | { estado: "cargando" | "lista" }
  | { estado: "error"; mensaje: string };

const huella = (edicion: EstadoEdicionReceta) => JSON.stringify(edicion);

const useBorradorReceta = (
  usuarioId: number,
  edicion: EstadoEdicionReceta,
  restaurar: Restaurar,
  ocupado: boolean,
  borradorId?: string,
) => {
  const { registrar } = useProtectorSalida();
  const enfocado = useIsFocused();

  const inicial = useRef(huella(edicion));
  const actual = useRef({ edicion, restaurar, ocupado });
  actual.current = { edicion, restaurar, ocupado };
  const base = useRef(inicial.current);

  const cargado = useRef(borradorId === undefined);
  const [carga, setCarga] = useState<Carga>({
    estado: borradorId === undefined ? "lista" : "cargando",
  });

  const [intento, setIntento] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const [permitirSalida, setPermitirSalida] = useState(false);
  const comprobar = useRef<(continuar: Continuar) => void>((continuar) =>
    continuar(),
  );

  const mismaCuenta = useCallback(
    () =>
      clienteQuery.getQueryData<Perfil | null>(CLAVE_SESION)?.id === usuarioId,
    [usuarioId],
  );

  const hayCambios =
    carga.estado === "lista" && huella(edicion) !== base.current;
  const desactivarPrevencion = usePreventRemove(
    enfocado && !permitirSalida && (hayCambios || ocupado || procesando),
    ({ repeat }) => comprobar.current(repeat),
  );

  const desactivarActual = useRef(desactivarPrevencion);
  desactivarActual.current = desactivarPrevencion;

  const salirSinPreguntar = useCallback((continuar: Continuar) => {
    setPermitirSalida(true);
    desactivarActual.current();
    continuar();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      let dialogoAbierto = false;
      let procesandoSalida = false;
      const vigente = () => activo && mismaCuenta();

      setPermitirSalida(false);
      setProcesando(false);

      async function cargar(id: string) {
        setCarga({ estado: "cargando" });

        try {
          const borrador = await leerBorrador(usuarioId, id);

          if (!vigente()) return;
          if (!borrador)
            throw new Error("Este borrador ya no está disponible.");

          await actual.current.restaurar(borrador.edicion);
          if (!vigente()) return;

          base.current = huella(borrador.edicion);
          cargado.current = true;
          setCarga({ estado: "lista" });
        } catch (error) {
          if (!vigente()) return;

          setCarga({
            estado: "error",
            mensaje:
              error instanceof Error ? error.message : "Vuelve a intentarlo.",
          });
        }
      }

      async function resolverSalida(guardar: boolean, continuar: Continuar) {
        if (!vigente() || procesandoSalida) return;

        procesandoSalida = true;
        setProcesando(true);

        try {
          if (guardar) {
            await guardarBorrador(
              usuarioId,
              actual.current.edicion,
              borradorId,
            );
          }
          if (!vigente()) return;

          if (borradorId === undefined) {
            await actual.current.restaurar(null);
            base.current = inicial.current;
          }
          if (vigente()) salirSinPreguntar(continuar);
        } catch (error) {
          if (vigente()) {
            Alert.alert(
              "No pudimos completar la acción",
              error instanceof Error ? error.message : "Vuelve a intentarlo.",
            );
          }
        } finally {
          procesandoSalida = false;
          dialogoAbierto = false;
          if (activo) setProcesando(false);
        }
      }

      comprobar.current = (continuar) => {
        if (!mismaCuenta()) {
          salirSinPreguntar(continuar);
          return;
        }
        if (!activo || dialogoAbierto || procesandoSalida) return;
        if (actual.current.ocupado) {
          Alert.alert("Espera un momento", "Hay una operación en curso.");
          return;
        }
        if (
          !cargado.current ||
          huella(actual.current.edicion) === base.current
        ) {
          salirSinPreguntar(continuar);
          return;
        }
        dialogoAbierto = true;
        Alert.alert(
          "Tienes cambios sin guardar",
          "¿Qué quieres hacer antes de salir?",
          [
            {
              text: "Guardar borrador",
              onPress: () => {
                void resolverSalida(true, continuar);
              },
            },
            {
              text: "Descartar cambios",
              style: "destructive",
              onPress: () => {
                void resolverSalida(false, continuar);
              },
            },
            {
              text: "Seguir editando",
              style: "cancel",
              onPress: () => {
                dialogoAbierto = false;
              },
            },
          ],
          { cancelable: false },
        );
      };

      const desregistrar = registrar((continuar) =>
        comprobar.current(continuar),
      );
      const atras =
        Platform.OS === "android"
          ? BackHandler.addEventListener("hardwareBackPress", () => {
              comprobar.current(() => {
                if (borradorId !== undefined) router.dismissTo("/mis-recetas");
                else if (router.canGoBack()) router.back();
                else BackHandler.exitApp();
              });
              return true;
            })
          : null;
      if (borradorId !== undefined && !cargado.current) void cargar(borradorId);
      return () => {
        activo = false;
        desregistrar();
        atras?.remove();
        comprobar.current = (continuar) => continuar();
      };
    }, [
      borradorId,
      intento,
      mismaCuenta,
      registrar,
      salirSinPreguntar,
      usuarioId,
    ]),
  );

  async function limpiarTrasGuardado(
    continuar?: Continuar,
  ): Promise<string | null> {
    let aviso: string | null = null;
    if (borradorId !== undefined) {
      try {
        await eliminarBorrador(usuarioId, borradorId);
      } catch {
        aviso =
          "La receta se guardó en tu cuenta, pero no pudimos eliminar su borrador del teléfono.";
      }
    }

    base.current = inicial.current;
    if (continuar && enfocado && mismaCuenta()) salirSinPreguntar(continuar);

    return aviso;
  }

  return {
    bloqueado: procesando || carga.estado !== "lista",
    carga,
    reintentarCarga: () => setIntento((numero) => numero + 1),
    limpiarTrasGuardado,
  };
};

export default useBorradorReceta;
