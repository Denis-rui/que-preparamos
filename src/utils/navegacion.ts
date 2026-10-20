import { router, type Href } from "expo-router";

// Vacía el historial y abre la pantalla indicada, para que "volver"
// no regrese a pantallas de una sesión anterior.
export function reiniciarNavegacion(ruta: Href, luegoIr?: Href) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(ruta);
  if (luegoIr) router.push(luegoIr);
}