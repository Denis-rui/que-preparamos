import { obtenerPerfil } from "@/api/perfil";
import { obtenerToken } from "@/storage/token";
import { useNetworkState } from "expo-network";
import { useEffect, useRef } from "react";

// La lectura local no valida el token. Volvemos a comprobarlo al recuperar la red.
export function useComprobarReconexion() {
  const red = useNetworkState();
  const sinConexion = red.isConnected === false || red.isInternetReachable === false;
  const conexionDisponible = red.isConnected === true && !sinConexion;
  const desconectado = useRef(false);
  useEffect(() => {
    if (sinConexion) {
      desconectado.current = true;
      return;
    }
    if (!desconectado.current || !conexionDisponible) return;
    desconectado.current = false;
    const controlador = new AbortController();
    void (async () => {
      try {
        if (await obtenerToken()) await obtenerPerfil(controlador.signal);
      } catch {
        // Axios gestiona el 401; un fallo de red o servidor conserva la sesión local.
      }
    })();
    return () => controlador.abort();
  }, [sinConexion, conexionDisponible]);
}
