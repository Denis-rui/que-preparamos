import { eliminarToken, obtenerToken } from "@/storage/token";
import { isAxiosError } from "axios";
import { quePreparamos } from "./cliente";

export async function cerrarSesion() {
  if (await obtenerToken()) {
    try {
      // Primero revocamos en Laravel. Sin conexión conservamos el token
      // para reintentar, en lugar de afirmar que se cerró en el servidor.
      await quePreparamos.post("/auth/logout", null, {
        autenticar: true,
        redirigirExpiracion: false,
      });
    } catch (error) {
      //Si el servidor no acepta el token, podemos cerrar sesion local.
      if (!(isAxiosError(error) && error.response?.status === 401)) {
        throw error;
      }
    }
  }
  await eliminarToken();
}
