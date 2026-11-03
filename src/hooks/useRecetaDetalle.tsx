import { getRecetaPorId } from "@/api/recetas";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useQuery } from "@tanstack/react-query";

export function useRecetaDetalle(id: string){
  const consulta = useQuery({
    queryKey: ["recetas, detalle", id],
    queryFn: ({ signal }) => getRecetaPorId(id, signal),
    enabled: !!id,
    staleTime: 1000 * 60*5, // 5 minutos
    gcTime: 1000 * 60*30,
    retry: false,
  });

  return {
    receta: consulta.data ?? null,
    loading: consulta.isLoading,
    error: obtenerMensajeError(consulta.error),
  }
}