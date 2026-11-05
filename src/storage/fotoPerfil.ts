import { CLAVE_CUENTAS, clienteQuery } from "@/config/cliente-query";
import type { Perfil } from "@/types/perfil";
import AsyncStorage from "@react-native-async-storage/async-storage";

const clave = (id: number) => `foto-perfil:v1:${id}`;

export async function leerFotoPerfil(id: number): Promise<string | null> {
  return AsyncStorage.getItem(clave(id));
}

export async function borrarFotoPerfil(id: number): Promise<void> {
  await AsyncStorage.removeItem(clave(id));
}

// Guardamos una foto por cuenta. Cambiamos la anterior cuando la nueva termina de descargarse.
export async function guardarFotoPerfil(
  perfil: Perfil,
  token: string,
): Promise<string | null> {
  if (!perfil.foto_perfil_url) {
    await AsyncStorage.removeItem(clave(perfil.id));
    void clienteQuery.invalidateQueries({ queryKey: CLAVE_CUENTAS });
    return null;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const respuesta = await fetch(perfil.foto_perfil_url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
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
    void clienteQuery.invalidateQueries({ queryKey: CLAVE_CUENTAS });
    return uri;
  } finally {
    clearTimeout(timeout);
  }
}
