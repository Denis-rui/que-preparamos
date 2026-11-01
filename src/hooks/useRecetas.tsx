import { getRecetas } from "@/api/recetas";
import type { FiltrosRecetas } from "@/types/receta";
import { useQuery } from "@tanstack/react-query";

export function useRecetas(filtros: FiltrosRecetas = {}) {
  const consulta = useQuery({
    queryKey: ["recetas", "listado", filtros],
    queryFn: ({ signal }) => getRecetas(signal, filtros),
    staleTime: 60_000,
  });
  return {
    recetas: consulta.data?.data ?? [],
    meta: consulta.data?.meta,
    loading: consulta.isPending,
    error: consulta.error?.message ?? null,
  };
}
