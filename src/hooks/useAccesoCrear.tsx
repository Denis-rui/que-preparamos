import { obtenerPerfil } from "@/api/perfil";
import { CLAVE_SESION } from "@/config/cliente-query";
import { obtenerToken } from "@/storage/token";
import { Perfil } from "@/types/perfil";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useQuery } from "@tanstack/react-query";
import { CanceledError, isAxiosError } from "axios";
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

export type EstadoAccesoCrear =
  | "comprobado"
  | "invitado"
  | "permitido"
  | "error";

const useAccesoCrear = () => {
  const controladorActual = useRef<AbortController | null>(null);

  const consulta = useQuery<Perfil | null>({
    queryKey: CLAVE_SESION,

    queryFn: async ({ signal }) => {
      const token = await obtenerToken();

      if (signal.aborted) {
        throw new CanceledError();
      }

      if (!token) {
        return null;
      }

      return obtenerPerfil(signal);
    },

    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    networkMode: "always",
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  const { refetch } = consulta;

  const comprobarAcceso = useCallback(async (): Promise<void> => {
    await refetch({
      cancelRefetch: false,
    });
  }, [refetch]);

  useEffect(() => {
    let estadoAnterior = AppState.currentState;

    const suscripcion = AppState.addEventListener("change", (estadoActual) => {
      const vuelveAlPrimerPlano =
        estadoActual === "active" && estadoAnterior !== "active";

      estadoAnterior = estadoActual;

      if (vuelveAlPrimerPlano) {
        void comprobarAcceso();
      }
    });

    return () => {
      suscripcion.remove();
    };
  }, [comprobarAcceso]);

  const accesoRechazado =
    isAxiosError(consulta.error) &&
    (consulta.error.response?.status === 401 ||
      consulta.error.response?.status === 403 ||
      consulta.error.code === "SESION_NO_ENCONTRADA" ||
      consulta.error.code === "SESION_CAMBIADA");

  let estadoAcceso: EstadoAccesoCrear;

  if (consulta.data === null) {
    estadoAcceso = "invitado";
  } else if (
    accesoRechazado ||
    (consulta.data === undefined && consulta.isError)
  ) {
    estadoAcceso = "error";
  } else if (consulta.data === undefined) {
    estadoAcceso = "comprobado";
  } else {
    estadoAcceso = "permitido";
  }
  const mensaje = obtenerMensajeError(consulta.error);

  const mensajeError =
    estadoAcceso === "error"
      ? mensaje || "No pudimos comprobar tu acceso."
      : null;

  const avisoAcceso =
    estadoAcceso === "permitido" && consulta.isError
      ? "No pudimos actualizar la comprobación de tu sesión."
      : null;

  return {
    estadoAcceso,
    mensajeError,
    avisoAcceso,
    usuarioId: consulta.data?.id ?? null,
    comprobarAcceso,
  };
};

export default useAccesoCrear;
