import { useNetworkState } from "expo-network";
import { isAxiosError } from "axios";

export function useConexion() {
  const red = useNetworkState();
  // Un estado todavía desconocido no equivale a estar desconectado.
  return { sinConexion: red.isConnected === false || red.isInternetReachable === false };
}

export function esFalloDeConexion(error: unknown) {
  return isAxiosError(error) && !error.response &&
    ["ERR_NETWORK", "ETIMEDOUT", "ECONNABORTED"].includes(error.code ?? "");
}
