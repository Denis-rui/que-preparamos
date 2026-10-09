import { eliminarToken, obtenerToken } from "@/storage/token";
import { router } from "expo-router";

let solicitudEnCurso: Promise<void> | null = null;

export async function solicitarInicioSesion(tokenRechazado?: string) {
  // Varias peticiones pueden recibir 401 juntas: navegamos una sola vez.
  if (solicitudEnCurso) return solicitudEnCurso;
  solicitudEnCurso = (async () => {
    // Una respuesta antigua no debe borrar el token de un login más reciente.
    if (tokenRechazado && (await obtenerToken()) !== tokenRechazado) return;
    await eliminarToken();
    router.replace({ pathname: "/login", params: { sesionVencida: "1" } });
  })();
  try {
    await solicitudEnCurso;
  } finally {
    solicitudEnCurso = null;
  }
}
