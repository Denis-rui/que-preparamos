import { guardarValoracion } from "@/api/valoraciones";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useValorarReceta(recetaId: string) {
  const clienteQuery = useQueryClient();

  const mutacion = useMutation({
    mutationFn: (puntuacion: number) => guardarValoracion(recetaId, puntuacion),
    // Refresca el detalle y también los listados, que muestran el promedio en cada tarjeta.
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