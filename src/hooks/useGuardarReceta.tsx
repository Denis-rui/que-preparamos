import { crearRecetaPrivada } from "@/api/crearRecetaPrivada";
import { EstadoPublicacion, publicarReceta } from "@/api/publicarReceta";
import { obtenerToken } from "@/storage/token";
import { PublicacionPendiente } from "@/types/borradorReceta";
import { DatosFormularioReceta } from "@/types/formularioRecetas";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { validarReceta } from "@/utils/validarReceta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { randomUUID } from "expo-crypto";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard } from "react-native";
type Accion = "privada" | "publicar";

interface EnvioGuardado {
  idReceta: number;
  clave: string;
  token: string;
}

const useGuardarReceta = (
  datos: DatosFormularioReceta,
  alGuardar: () => Promise<string | null>,
) => {
  const [errorGuardando, setErrorGuardando] = useState<string | null>(null);
  const bloqueo = useRef(false);
  const activo = useRef(true);
  const [envioGuardado, setEnvioGuardado] = useState<EnvioGuardado | null>(
    null,
  );
  const clienteQuery = useQueryClient();
  useEffect(() => {
    activo.current = true;

    return () => {
      activo.current = false;
    };
  }, []);

  const mutacion = useMutation({
    mutationFn: async (accion: Accion) => {
      if (accion === "privada") {
        await crearRecetaPrivada(datos);
        return { tipo: "privada" } as const;
      }
      let envio = envioGuardado;
      if (!envio) {
        const clave = randomUUID();
        const token = await obtenerToken();
        if (!token) {
          throw new AxiosError("Inicia sesion", "SESION_NO_ENCONTRADA");
        }
        const idReceta = await crearRecetaPrivada(datos);
        if (!activo.current) {
          return { tipo: "interrumpida" } as const;
        }
        envio = {
          idReceta,
          clave,
          token,
        };
        setEnvioGuardado(envio);
      }
      if (!activo.current) {
        return { tipo: "interrumpida" } as const;
      }

      if ((await obtenerToken()) !== envio.token) {
        throw new AxiosError("La sesion ha cambiado", "SESION_CAMBIADA");
      }
      const estado = await publicarReceta(envio.idReceta, envio.clave);

      return {
        tipo: "publicacion",
        estado,
      } as const;
    },
    retry: false,
    networkMode: "always",
    gcTime: 0,
  });

  const ejecutar = async (accion: Accion): Promise<void> => {
    if (bloqueo.current || !activo.current) {
      return;
    }

    if (accion === "privada" && envioGuardado) return;

    if (!envioGuardado) {
      const problema = validarReceta(datos);
      if (problema) {
        setErrorGuardando(problema);
        return;
      }
    }
    bloqueo.current = true;
    setErrorGuardando(null);
    Keyboard.dismiss();

    try {
      const resultado = await mutacion.mutateAsync(accion);
      if (!activo.current || resultado.tipo === "interrumpida") return;

      setEnvioGuardado(null);
      const avisoBorrador = await alGuardar();

      if (resultado.tipo === "privada") {
        Alert.alert(
          "Receta guardada",
          ["Tu receta se ha guardado correctamente.", avisoBorrador]
            .filter(Boolean)
            .join("\n\n"),
        );
      } else {
        if (
          resultado.estado === "publicada" ||
          resultado.estado === "aprobada"
        ) {
          clienteQuery.invalidateQueries({
            queryKey: ["recetas"],
          });
        }
        const mensaje = mensajes[resultado.estado];

        Alert.alert(
          mensaje.titulo,
          [mensaje.texto, avisoBorrador].filter(Boolean).join("\n\n"),
        );
      }
    } catch (error) {
      if (activo.current) {
        setErrorGuardando(mensajeError(error));
      }
    } finally {
      bloqueo.current = false;
      mutacion.reset();
    }
  };

  const guardarRecetaPriv = async (): Promise<void> => {
    if (bloqueo.current) {
      return;
    }

    const problema = validarReceta(datos);
    if (problema) {
      setErrorGuardando(problema);
      return;
    }

    bloqueo.current = true;
    setErrorGuardando(null);
    Keyboard.dismiss();

    try {
      await mutacion.mutateAsync("privada");
      if (!activo.current) {
        return;
      }

      alGuardar();

      Alert.alert("Receta guardada", "Tu receta se ha guardado correctamente.");
    } catch (error) {
      if (!activo.current) {
        return;
      }
      let detalle: string | undefined;

      if (axios.isAxiosError<{ errors?: Record<string, unknown> }>(error)) {
        const errores = error.response?.data?.errors;
        if (
          error.response?.status === 422 &&
          errores &&
          typeof errores === "object"
        ) {
          for (const valor of Object.values(errores)) {
            if (Array.isArray(valor)) {
              detalle = valor.find(
                (mensaje): mensaje is string => typeof mensaje === "string",
              );
            }
            if (detalle) {
              break;
            }
          }
        }
      }
      setErrorGuardando(
        detalle ??
          obtenerMensajeError(error) ??
          "No se pudo confirmar el guardado de la receta",
      );
    } finally {
      bloqueo.current = false;
      mutacion.reset();
    }
  };

  const restaurarPublicacionPendiente = async (
    pendiente: PublicacionPendiente | null,
  ): Promise<void> => {
    if (!pendiente) {
      setEnvioGuardado(null);
      return;
    }
    const token = await obtenerToken();
    if (!token || !activo.current) {
      throw new AxiosError(
        "Inicia sesion para recuperar la publicacion pendiente",
        "SESION_NO_ENCONTRADA",
      );
    }

    setEnvioGuardado({
      idReceta: pendiente.idReceta,
      clave: pendiente.clave,
      token,
    });
  };

  return {
    guardarRecetaPriv: () => ejecutar("privada"),
    publicar: () => ejecutar("publicar"),
    guardando: mutacion.isPending,
    publicando: mutacion.isPending && mutacion.variables === "publicar",
    publicacionSinConfirmar: envioGuardado !== null,
    publicacionPendiente: envioGuardado
      ? {
          idReceta: envioGuardado.idReceta,
          clave: envioGuardado.clave,
        }
      : null,
    restaurarPublicacionPendiente,
    errorGuardando,
  };
};

export default useGuardarReceta;
const mensajeError = (error: unknown): string => {
  if (axios.isAxiosError<{ errors?: Record<string, unknown> }>(error)) {
    const errores = error.response?.data?.errors;
    if (
      error.response?.status === 422 &&
      errores &&
      typeof errores === "object"
    ) {
      for (const valor of Object.values(errores)) {
        if (Array.isArray(valor)) {
          const mensaje = valor.find(
            (item): item is string => typeof item === "string",
          );

          if (mensaje) {
            return mensaje;
          }
        }
      }
    }
  }
  return obtenerMensajeError(error) ?? "No se pudo confirmar la operacion";
};

const mensajes: Record<EstadoPublicacion, { titulo: string; texto: string }> = {
  publicada: {
    titulo: "Receta publicada",
    texto: "Tu receta ya está disponible en el catálogo.",
  },
  pendiente: {
    titulo: "Enviada a revisión",
    texto: "Un administrador revisará tu receta antes de publicarla.",
  },
  aprobada: {
    titulo: "Solicitud aprobada",
    texto: "La solicitud de publicación ya fue aprobada.",
  },
  rechazada: {
    titulo: "Solicitud rechazada",
    texto: "La solicitud de publicación fue rechazada.",
  },
  cancelada: {
    titulo: "Solicitud cancelada",
    texto: "La solicitud de publicación está cancelada.",
  },
};
