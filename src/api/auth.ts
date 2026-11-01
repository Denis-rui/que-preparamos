import type {
  DatosLogin,
  DatosRegistro,
  RespuestaLogin,
  RespuestaRegistro,
} from "@/types/auth";

import { obtenerMensajeError } from "@/utils/mensajeError";
import axios from "axios";
import { quePreparamos } from "./cliente";

// Conservamos el código HTTP para distinguir credenciales rechazadas de otros fallos.
export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function registrarUsuario(
  datosUsuario: DatosRegistro,
): Promise<RespuestaRegistro> {
  try {
    const respuesta = await quePreparamos.post<RespuestaRegistro>(
      "/auth/registro",
      datosUsuario,
      {
        headers: {
          // indicamos al servidor que le estamos enviando un JSON
          "Content-Type": "application/json",
        },
      },
    );

    // Axios convierte la respuesta a JSON.
    const json = respuesta.data;
    return json;
  } catch (error: unknown) {
    // si la respuesta no es correcta, lanza un error.
    if (axios.isCancel(error)) throw error;
    throw new AuthError(
      obtenerMensajeError(error) || "Error al registrar el usuario",
      axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0,
    );
  }
}

export async function iniciarSesion(
  datosUsuario: DatosLogin,
): Promise<RespuestaLogin> {
  try {
    const respuesta = await quePreparamos.post<RespuestaLogin>(
      "/auth/login",
      datosUsuario,
      {
        headers: {
          // indicamos al servidor que le estamos enviando un JSON
          "Content-Type": "application/json",
          // indicamos al servidor que esperamos recibir un JSON en la respuesta
          Accept: "application/json",
        },
      },
    );
    // Axios convierte la respuesta a JSON y devolvemos los datos.
    const json = respuesta.data;
    return json;
  } catch (error: unknown) {
    // si la respuesta no es correcta, lanza un error

    if (axios.isCancel(error)) throw error;
    throw new AuthError(
      obtenerMensajeError(error) || "Error al iniciar sesión",
      axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0,
    );
  }
}
