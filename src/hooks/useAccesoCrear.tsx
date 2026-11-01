import { obtenerPerfil } from "@/api/perfil";
import { obtenerToken } from "@/storage/token";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

export type EstadoAccesoCrear =
  | "comprobado"
  | "invitado"
  | "permitido"
  | "error";

const useAccesoCrear = () => {
  const [estadoAcceso, setestadoAcceso] =
    useState<EstadoAccesoCrear>("comprobado");
  const [mensajeError, setmensajeError] = useState<string | null>(null);

  const controladorActual = useRef<AbortController | null>(null);

  const comprobarAcceso = useCallback(async (): Promise<void> => {
    controladorActual.current?.abort();
    const controlador = new AbortController();
    controladorActual.current = controlador;
    const { signal } = controlador;

    setestadoAcceso("comprobado");
    setmensajeError(null);

    try {
      const token = await obtenerToken();
      if (signal.aborted) return;

      if (!token) {
        setestadoAcceso("invitado");
        return;
      }

      await obtenerPerfil(signal);
      if (signal.aborted) return;
      setestadoAcceso("permitido");
    } catch (error) {
      if (signal.aborted || axios.isCancel(error)) return;

      const accesoDenegado =
        axios.isAxiosError(error) &&
        (error.response?.status === 401 ||
          error.code === "SESION_NO_ENCONTRADA");

      if (accesoDenegado) {
        setestadoAcceso("invitado");
        return;
      }
      setmensajeError("Error al comprobar el acceso");
      setestadoAcceso("error");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      comprobarAcceso();
      return () => {
        controladorActual.current?.abort();
      };
    }, [comprobarAcceso]),
  );
  return {
    estadoAcceso,
    mensajeError,
    comprobarAcceso,
  };
};

export default useAccesoCrear;
