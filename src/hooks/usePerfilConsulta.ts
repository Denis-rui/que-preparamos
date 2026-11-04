import { obtenerPerfil } from "@/api/perfil";
import { leerFavoritos } from "@/storage/favoritos";
import { guardarFotoPerfil, leerFotoPerfil } from "@/storage/fotoPerfil";
import { obtenerPerfilRecordado, obtenerToken } from "@/storage/token";
import type { Perfil } from "@/types/perfil";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

interface PerfilVista {
  usuario: Perfil;
  photoUri?: string;
  avisoFoto?: string;
}

export function usePerfilConsulta() {
  const cliente = useQueryClient();
  // Leemos lo que ya está guardado en el teléfono, aunque no haya internet.
  const dispositivo = useQuery({
    queryKey: ["perfil-dispositivo"],
    networkMode: "always",
    gcTime: 0,
    retry: false,
    queryFn: async () => {
      const token = await obtenerToken();
      const usuario = token ? await obtenerPerfilRecordado() : null;
      const photoUri = usuario?.foto_perfil_url
        ? await leerFotoPerfil(usuario.id).catch(() => null)
        : null;
      let cantidad: number | null = null;
      try {
        // Buscamos la lista directamente en el teléfono. identificarListaFavoritos
        // podría llamar al servidor si no encuentra el perfil guardado.
        if (!token || usuario) {
          cantidad = (await leerFavoritos({
            clave: usuario ? `favoritos:v1:cuenta:${usuario.id}` : "favoritos:v1:invitado",
            token,
          })).length;
        }
      } catch { /* Si no podemos leer la lista, no mostramos que tiene cero recetas. */ }
      if (await obtenerToken() !== token) throw new Error("La sesión cambió.");
      return { token, cantidad, perfil: usuario ? { usuario, photoUri: photoUri ?? undefined } as PerfilVista : undefined };
    },
  });
  const token = dispositivo.data?.token;
  const clave = ["perfil-vista", token] as const;
  const consulta = useQuery({
    queryKey: clave,
    enabled: Boolean(token),
    networkMode: "online",
    retry: false,
    gcTime: 0,
    initialData: () => dispositivo.data?.perfil,
    initialDataUpdatedAt: 0,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }): Promise<PerfilVista> => {
      const usuario = await obtenerPerfil(signal);
      let photoUri = usuario.foto_perfil_url ? await leerFotoPerfil(usuario.id).catch(() => null) : null;
      let avisoFoto: string | undefined;
      try {
        photoUri = await guardarFotoPerfil(usuario, token!);
      } catch {
        avisoFoto = "No pudimos actualizar tu foto. Conservamos la copia disponible; vuelve a entrar con conexión para reintentar.";
      }
      if (signal.aborted || await obtenerToken() !== token) throw new Error("La sesión cambió.");
      return { usuario, photoUri: photoUri ?? undefined, avisoFoto };
    },
  });
  const { refetch: leerDispositivo } = dispositivo;
  const { refetch } = consulta;
  useFocusEffect(useCallback(() => { void leerDispositivo(); }, [leerDispositivo]));
  useFocusEffect(useCallback(() => {
    if (token) void refetch({ cancelRefetch: false });
  }, [token, refetch]));

  async function actualizar(usuario: Perfil, descargarFoto = true) {
    if (!token || await obtenerToken() !== token) return;
    await cliente.cancelQueries({ queryKey: clave, exact: true });
    let photoUri = usuario.foto_perfil_url ? await leerFotoPerfil(usuario.id).catch(() => null) : null;
    let avisoFoto: string | undefined;
    if (descargarFoto) {
      try { photoUri = await guardarFotoPerfil(usuario, token); }
      catch { avisoFoto = "Tu perfil se guardó, pero no pudimos descargar la foto. Conservamos la copia anterior."; }
    }
    if (await obtenerToken() === token) cliente.setQueryData<PerfilVista>(clave, { usuario, photoUri: photoUri ?? undefined, avisoFoto });
    return avisoFoto;
  }

  return { consulta, dispositivo, token: token ?? null, actualizar };
}
