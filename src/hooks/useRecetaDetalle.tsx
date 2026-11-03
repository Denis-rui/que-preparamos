import { getRecetaPorId } from "@/api/recetas";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { identificarListaFavoritos, leerFavoritos } from "@/storage/favoritos";
import type { RecetaDetalle } from "@/types/receta";

export function useRecetaDetalle(id: string, local = false){
  const [copia, setCopia] = useState<RecetaDetalle | null>(null);
  const [cargandoCopia, setCargandoCopia] = useState(true);
  const [errorCopia, setErrorCopia] = useState<string | null>(null);
  useFocusEffect(useCallback(() => {
    if (!local) return;
    let activo = true;
    setCopia(null);
    setCargandoCopia(true);
    setErrorCopia(null);
    void (async () => {
      try {
        const lista = await identificarListaFavoritos();
        const item = (await leerFavoritos(lista)).find((favorito) => favorito.id === Number(id));
        if (activo) {
          setCopia(item?.receta ?? null);
          if (!item?.receta) setErrorCopia(item?.aviso ?? "Esta receta no está descargada en tus favoritos.");
        }
      } catch {
        if (activo) setErrorCopia("No pudimos leer la receta descargada.");
      } finally {
        if (activo) setCargandoCopia(false);
      }
    })();
    return () => { activo = false; };
  }, [id, local]));
  const consulta = useQuery({
    queryKey: ["recetas", "detalle", id],
    queryFn: ({ signal }) => getRecetaPorId(id, signal),
    enabled: !!id && !local,
    staleTime: 1000 * 60*5, // 5 minutos
    gcTime: 1000 * 60*30,
    retry: false,
  });

  return {
    receta: local ? copia : consulta.data ?? null,
    loading: local ? cargandoCopia : consulta.isLoading,
    error: local ? errorCopia : obtenerMensajeError(consulta.error),
  }
}
