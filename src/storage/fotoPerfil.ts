import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Perfil } from "@/types/perfil";

const clave = (id: number) => `foto-perfil:v1:${id}`;

export async function leerFotoPerfil(id: number): Promise<string | null> {
  return AsyncStorage.getItem(clave(id));
}

// La copia queda separada por cuenta y solo se reemplaza tras descargarla completa.
export async function guardarFotoPerfil(perfil: Perfil, token: string): Promise<string | null> {
  if (!perfil.foto_perfil_url) {
    await AsyncStorage.removeItem(clave(perfil.id));
    return null;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const respuesta = await fetch(perfil.foto_perfil_url, {
      headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
      signal: controller.signal,
    });
    if (!respuesta.ok) throw new Error("No se pudo descargar la foto.");
    const blob = await respuesta.blob();
    const uri = await new Promise<string>((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(String(lector.result));
      lector.onerror = () => reject(new Error("No se pudo guardar la foto."));
      lector.readAsDataURL(blob);
    });
    await AsyncStorage.setItem(clave(perfil.id), uri);
    return uri;
  } finally {
    clearTimeout(timeout);
  }
}
