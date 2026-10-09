import * as SecureStore from "expo-secure-store";
const TOKEN_KEY = "token_sesion";

export async function guardarToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function obtenerToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function eliminarToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
