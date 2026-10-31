import { obtenerToken } from "@/storage/token";
import { solicitarInicioSesion } from "@/utils/solicitarInicioSesion";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig<D, P> {
    autenticar?: boolean; // si se require autenticacion
    redirigirExpiracion?: boolean;
    tokenSesion?: string;
  }
}

const baseURL = process.env.EXPO_PUBLIC_URL_API;

if (!baseURL) {
  throw new Error("Falta configurar la direccion de la API");
}

export const quePreparamos = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
  responseType: "json",
  transitional: {
    silentJSONParsing: false,
    clarifyTimeoutError: true,
  },
});

// comprobar si la sesion ha cambiado

const comprobarSesion = async (
  configuracion?: InternalAxiosRequestConfig,
): Promise<void> => {
  const token = configuracion?.tokenSesion;
  if (token && (await obtenerToken()) !== token) {
    throw new AxiosError(
      "la sesion ha cambiado, intentalo nuevamente",
      "SESION_CAMBIADA",
      configuracion,
    );
  }
};

// INTERCEPTORES
// interceptamos la peticion para agregar el token de sesion si es necesario
quePreparamos.interceptors.request.use(async (configuracion) => {
  configuracion.tokenSesion = undefined;
  if (configuracion.autenticar) {
    const token = await obtenerToken();
    if (!token) {
      throw new AxiosError(
        "No se ha encontrado un token de sesion",
        "SESION_NO_ENCONTRADA",
        configuracion,
      );
    }
    configuracion.tokenSesion = token;
    configuracion.headers.set("Authorization", `Bearer ${token}`);
  }
  return configuracion;
});

// interceptamos la respuesta para comprobar si la sesion ha cambiado
quePreparamos.interceptors.response.use(
  async (respuesta) => {
    await comprobarSesion(respuesta.config);
    if (respuesta.status !== 204 && respuesta.data == null) {
      throw new AxiosError(
        "El servidor no ha devuelto datos",
        "NO_DATA",
        respuesta.config,
        respuesta.request,
        respuesta,
      );
    }
    return respuesta;
  },
  async (error: unknown) => {
    if (axios.isCancel(error)) {
      throw error;
    }

    if (!axios.isAxiosError<unknown>(error)) {
      throw error;
    }

    await comprobarSesion(error.config);

    const token = error.config?.tokenSesion;
    if (
      token &&
      error.response?.status === 401 &&
      error.config?.redirigirExpiracion !== false
    ) {
      await solicitarInicioSesion(token);
    }
    throw error;
  },
);
