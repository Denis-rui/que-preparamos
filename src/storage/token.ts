import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import type { Perfil } from "@/types/perfil";
import * as SecureStore from "expo-secure-store";
const TOKEN_KEY = "token_sesion";
const PERFIL_KEY = "perfil_sesion_local";

// Se conserva junto a la credencial, nunca se usa para autorizar operaciones remotas.
export async function recordarPerfil(perfil: Perfil, token: string) {
  if ((await obtenerToken()) !== token) return;
  await SecureStore.setItemAsync(PERFIL_KEY, JSON.stringify({ token, perfil }));
}

export async function obtenerPerfilRecordado(): Promise<Perfil | null> {
  const token = await obtenerToken();
  if (!token) return null;
  const json = await SecureStore.getItemAsync(PERFIL_KEY);
  if (!json) return null;
  try {
    const datos = JSON.parse(json);
    return datos.token === token &&
      Number.isSafeInteger(datos.perfil?.id) &&
      datos.perfil.id > 0
      ? datos.perfil
      : null;
  } catch {
    return null;
  }
}

export async function guardarToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await limpiarSesionRecordada(token);
}

export async function obtenerToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function eliminarToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(PERFIL_KEY);
  await limpiarSesionRecordada(null);
}
async function limpiarSesionRecordada(
  tokenEsperado: string | null,
): Promise<void> {
  await clienteQuery.cancelQueries({
    queryKey: CLAVE_SESION,
    exact: true,
  });
  const tokenActual = await obtenerToken();

  if (tokenActual !== tokenEsperado) {
    return;
  }

  clienteQuery.setQueryData(CLAVE_SESION, null);
}
