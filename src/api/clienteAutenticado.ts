import { obtenerToken } from "@/storage/token";
import { solicitarInicioSesion } from "@/utils/solicitarInicioSesion";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Reutilizamos solo en rutas protegidas. El catálogo público conserva su fetch.
export async function peticionAutenticada(
  ruta: string,
  opciones: RequestInit = {},
  redirigirSiExpira = true,
) {
  const token = await obtenerToken();
  if (!token) throw new ApiError("Debes iniciar sesión.", 401);
  const headers = new Headers(opciones.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  const controller = new AbortController();
  const espera = setTimeout(() => controller.abort(), 15000);
  let respuesta: Response;
  try {
    respuesta = await fetch(`${process.env.EXPO_PUBLIC_URL_API}${ruta}`, {
      ...opciones,
      headers,
      signal: opciones.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(espera);
  }
  // Descartamos respuestas de una cuenta anterior después de salir o cambiarla.
  if ((await obtenerToken()) !== token) {
    throw new ApiError("La sesión cambió. Inténtalo nuevamente.", 409);
  }
  if (respuesta.status === 401) {
    if (redirigirSiExpira) await solicitarInicioSesion(token);
    throw new ApiError("Tu sesión ha expirado. Inicia sesión nuevamente.", 401);
  }
  // Un error del servidor puede llegar sin JSON; preservamos el estado HTTP.
  const json = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ApiError(
      json?.mensaje || json?.message || "No pudimos completar la solicitud.",
      respuesta.status,
    );
  }
  if (respuesta.status !== 204 && json === null) {
    throw new ApiError(
      "El servidor devolvió una respuesta inválida.",
      respuesta.status,
    );
  }
  return json;
}
