import { obtenerMisRecetasApi } from "@/api/mis-recetas";
import { CLAVE_SESION } from "@/config/cliente-query";
import { Perfil } from "@/types/perfil";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useMisRecetas = (
  usuarioId: number,
  filtro: "privadas" | "publicadas",
  buscar?: string,
) => {
  const cliente = useQueryClient();

  const consultaGuardada = useInfiniteQuery({
    queryKey: ["mis-recetas", usuarioId, filtro, buscar],
    enabled: Number.isSafeInteger(usuarioId) && usuarioId > 0,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const comprobarCuentaActual = () => {
        const perfil = cliente.getQueryData<Perfil | null>(CLAVE_SESION);
        if (perfil?.id !== usuarioId) {
          throw new AxiosError("La sesión cambió.", "SESION_CAMBIADA");
        }
      };
      comprobarCuentaActual();
      const resultado = await obtenerMisRecetasApi(
        signal,
        filtro,
        buscar,
        pageParam,
      );
      comprobarCuentaActual();
      return resultado;
    },

    getNextPageParam: (ultimaPagina) => {
      if (ultimaPagina.paginaActual < ultimaPagina.ultimapagina) {
        return ultimaPagina.paginaActual + 1;
      }
      return undefined;
    },
    networkMode: "online",
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15, // 15 minutos
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const recetas =
    consultaGuardada.data?.pages.flatMap((pagina) => pagina.recetas) ?? [];

  return { consultaGuardada, recetas };
};

export default useMisRecetas;
