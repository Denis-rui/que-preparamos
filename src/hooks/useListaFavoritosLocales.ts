import { identificarListaFavoritos, leerFavoritos } from "@/storage/favoritos";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";

// Compartimos los favoritos entre pantallas con Query.
export function useListaFavoritosLocales() {
  const identidad = useQuery({
    queryKey: ["favoritos-locales", "lista"],
    queryFn: identificarListaFavoritos,
    networkMode: "always",
    retry: false,
    gcTime: 0,
    staleTime: Infinity,
  });
  const lista = identidad.data;
  const clave = useMemo(
    () =>
      ["favoritos-locales", "contenido", lista?.clave, lista?.token] as const,
    [lista?.clave, lista?.token],
  );
  const consulta = useQuery({
    queryKey: clave,
    queryFn: () => leerFavoritos(lista!),
    enabled: !!lista,
    networkMode: "always",
    retry: false,
  });
  const { refetch: identificar } = identidad;
  const { refetch: actualizar } = consulta;
  useFocusEffect(
    useCallback(() => {
      void identificar({ cancelRefetch: false });
      if (lista) void actualizar({ cancelRefetch: false });
    }, [identificar, actualizar, lista]),
  );

  return { lista, clave, consulta, identidad };
}
