import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

// Avisamos a TanStack Query cuando Expo detecta que se fue o volvió el internet.
onlineManager.setEventListener((setOnline) => {
  if (typeof window === "undefined") return;

  let recibido = false;
  let activo = true;
  function actualizar(red: Network.NetworkState) {
    if (red.isConnected === false || red.isInternetReachable === false) setOnline(false);
    else if (red.isConnected === true) setOnline(true);
  }
  const suscripcion = Network.addNetworkStateListener((red) => {
    recibido = true;
    actualizar(red);
  });
  void Network.getNetworkStateAsync().then((red) => {
    if (activo && !recibido) actualizar(red);
  }).catch(() => { /* Si no podemos comprobar la red, dejamos el estado que ya teníamos. */ });
  return () => { activo = false; suscripcion.remove(); };
});
