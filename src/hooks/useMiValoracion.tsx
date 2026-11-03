import { obtenerMiValoracion } from "@/api/valoraciones";
import { useQuery } from "@tanstack/react-query";

export function useMiValoracion(recetaId: string, conSesion: boolean) {
  const consulta = useQuery({
    queryKey: ["recetas", "mi-valoracion", recetaId],
    queryFn: ({ signal }) => obtenerMiValoracion(recetaId, signal),
    enabled: !!recetaId && conSesion,
    retry: false,
  });

  return { miPuntuacion: consulta.data?.puntuacion ?? null };
}