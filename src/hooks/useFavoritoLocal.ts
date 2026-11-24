import { getRecetaPorId } from "@/api/recetas";
import {
  guardarFavorito,
  leerFavoritos,
  quitarFavorito,
} from "@/storage/favoritos";
import type { RecetaDetalle } from "@/types/receta";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";
import { useListaFavoritosLocales } from "./useListaFavoritosLocales";

export function useFavoritoLocal(id: string) {
  const cliente = useQueryClient();
  const bloqueado = useRef(false);
  const { lista, clave, consulta, identidad } = useListaFavoritosLocales();

  const esFavorito =
    consulta.data?.some((item) => item.id === Number(id)) ?? false;
  const claveMutacion = ["alternar-favorito-local", lista?.clave, id] as const;
  const pendientes = useIsMutating({ mutationKey: claveMutacion, exact: true });
  const mutacion = useMutation({
    mutationKey: claveMutacion,
    // También permite quitar favoritos sin internet.
    networkMode: "always",
    retry: false,
    mutationFn: async (receta?: RecetaDetalle) => {
      if (!lista) throw new Error("No se pudo abrir la lista de favoritos.");
      const guardados = await leerFavoritos(lista);
      if (guardados.some((item) => item.id === Number(id))) {
        await quitarFavorito(lista, Number(id));
      } else {
        // Pedimos la receta completa para guardarla sin conexión.
        const detalle =
          receta ??
          (await cliente.fetchQuery<RecetaDetalle>({
            queryKey: ["recetas", "detalle", id],
            queryFn: ({ signal }) => getRecetaPorId(id, signal),
            staleTime: 5 * 60 * 1000,
            networkMode: "always",
            retry: false,
          }));
        await guardarFavorito(lista, detalle);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        cliente.invalidateQueries({ queryKey: clave, exact: true }),
        cliente.invalidateQueries({ queryKey: ["perfil-dispositivo"] }),
      ]);
    },
  });

  const preparado =
    !!lista &&
    identidad.isSuccess &&
    !identidad.isFetching &&
    consulta.isSuccess;
  const ocupado = pendientes > 0;
  async function alternar(receta?: RecetaDetalle) {
    if (bloqueado.current || ocupado || !preparado) return;
    bloqueado.current = true;
    try {
      await mutacion.mutateAsync(receta);
      return true;
    } catch {
      return false;
    } finally {
      bloqueado.current = false;
    }
  }
  const error = mutacion.isError
    ? "No pudimos guardar el cambio. Comprueba la conexión y el espacio del dispositivo e inténtalo nuevamente."
    : identidad.isError || consulta.isError
      ? "No pudimos abrir tus favoritos locales. Vuelve a intentarlo."
      : null;
  return { esFavorito, ocupado, preparado, error, alternar };
}
