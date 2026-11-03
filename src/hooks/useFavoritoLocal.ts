import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import type { RecetaDetalle } from "@/types/receta";
import {
  guardarFavorito, identificarListaFavoritos, leerFavoritos, quitarFavorito,
  type ListaFavoritos,
} from "@/storage/favoritos";

export function useFavoritoLocal(id: string) {
  const [lista, setLista] = useState<ListaFavoritos | null>(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => {
    let activo = true;
    setLista(null);
    setEsFavorito(false);
    setError(null);
    void (async () => {
      try {
        const actual = await identificarListaFavoritos();
        const items = await leerFavoritos(actual);
        if (activo) {
          setLista(actual);
          setEsFavorito(items.some((item) => item.id === Number(id)));
        }
      } catch {
        if (activo) setError("No pudimos abrir tus favoritos locales. Vuelve a intentarlo.");
      }
    })();
    return () => { activo = false; };
  }, [id]));

  async function alternar(receta: RecetaDetalle) {
    if (ocupado || !lista) return;
    setOcupado(true);
    setError(null);
    try {
      if (esFavorito) await quitarFavorito(lista, receta.id);
      else await guardarFavorito(lista, receta);
      setEsFavorito(!esFavorito);
      return true;
    } catch {
      setError("No pudimos guardar el cambio. Comprueba la conexión y el espacio del dispositivo e inténtalo nuevamente.");
    } finally {
      setOcupado(false);
    }
  }
  return { esFavorito, ocupado, preparado: !!lista, error, alternar };
}
