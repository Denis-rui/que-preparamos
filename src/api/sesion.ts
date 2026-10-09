import { eliminarToken, obtenerToken } from "@/storage/token";
import { ApiError, peticionAutenticada } from "./clienteAutenticado";

export async function cerrarSesion() {
  if (await obtenerToken()) {
    try {
      // Primero revocamos en Laravel. Sin conexión conservamos el token
      // para reintentar, en lugar de afirmar que se cerró en el servidor.
      await peticionAutenticada("/auth/logout", { method: "POST" }, false);
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) throw error;
    }
  }
  await eliminarToken();
}
