import { obtenerMiValoracion } from "@/api/valoraciones";
import { CLAVE_SESION } from "@/config/cliente-query";
import { Perfil } from "@/types/perfil";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useMiValoracion(
  recetaId: string,
  conSesion: boolean,
  usuarioId?: number,
) {
  const cliente = useQueryClient();

  const consulta = useQuery({
    queryKey: ["recetas", "mi-valoracion", recetaId, usuarioId],
    queryFn: async ({ signal }) => {
      const comprobarCuenta = () => {
        if (
          usuarioId !== undefined &&
          cliente.getQueryData<Perfil | null>(CLAVE_SESION)?.id !== usuarioId
        ) {
          throw new AxiosError("La sesión cambió.", "SESION_CAMBIADA");
        }
      };
      comprobarCuenta();
      const valoracion = await obtenerMiValoracion(recetaId, signal);
      comprobarCuenta();
      return valoracion;
    },

    enabled: !!recetaId && conSesion,
    retry: false,
  });

  return { ...consulta, miPuntuacion: consulta.data?.puntuacion ?? null };
}
