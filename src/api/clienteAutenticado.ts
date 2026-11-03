import type { AxiosRequestConfig } from "axios";
import { quePreparamos } from "./cliente";

// Reutilizamos el cliente Axios
export async function peticionAutenticada<T = unknown>(
  ruta: string,
  opciones: AxiosRequestConfig = {},
  redirigirSiExpira = true,
): Promise<T | null> {
  const respuesta = await quePreparamos.request<T>({
    ...opciones,
    url: ruta,
    method: opciones.method ?? "GET",
    autenticar: true,
    redirigirExpiracion: redirigirSiExpira,
  });

  // Una respuesta 204 no contiene un cuerpo JSON.
  return respuesta.status === 204 ? null : respuesta.data;
}
