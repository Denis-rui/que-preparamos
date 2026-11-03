import { crearRecetaPrivada } from "@/api/crearRecetaPrivada";
import { DatosFormularioReceta } from "@/types/formularioRecetas";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { validarReceta } from "@/utils/validarReceta";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard } from "react-native";

const useGuardarReceta = (
  datos: DatosFormularioReceta,
  alGuardar: () => void,
) => {
  const [errorGuardando, setErrorGuardando] = useState<string | null>(null);
  const bloqueo = useRef(false);
  const activo = useRef(true);

  useEffect(() => {
    activo.current = true;

    return () => {
      activo.current = false;
    };
  }, []);

  const mutacion = useMutation({
    mutationFn: crearRecetaPrivada,
    retry: false,
    networkMode: "always",
    gcTime: 0,
  });

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
      await mutacion.mutateAsync(datos);
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

  return {
    guardarRecetaPriv,
    guardando: mutacion.isPending,
    errorGuardando,
  };
};

export default useGuardarReceta;
