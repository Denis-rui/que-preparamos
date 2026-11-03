import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import * as SecureStore from "expo-secure-store";
const TOKEN_KEY = "token_sesion";

export async function guardarToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await limpiarSesionRecordada(token);
}

export async function obtenerToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function eliminarToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
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
