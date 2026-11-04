import { guardarValoracion } from "@/api/valoraciones";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useValorarReceta(recetaId: string) {
  const clienteQuery = useQueryClient();

  const mutacion = useMutation({
    // Si no hay internet, avisamos del error en vez de enviar la valoración después.
    networkMode: "always",
    mutationFn: (puntuacion: number) => guardarValoracion(recetaId, puntuacion),
    // Actualizamos el detalle y las listas para que muestren el nuevo promedio.
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: ["recetas"] }),
  });

  return {
    valorar: mutacion.mutate,
    guardando: mutacion.isPending,
    error: obtenerMensajeError(mutacion.error),
    reiniciar: mutacion.reset,
    exito: mutacion.isSuccess,
  };
}
