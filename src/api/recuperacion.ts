import type {
  DatosRestablecerContrasenia,
  DatosSolicitarRecuperacion,
  DatosVerificarRecuperacion,
  RespuestaRestablecerContrasenia,
  RespuestaSolicitarRecuperacion,
  RespuestaVerificarRecuperacion,
} from "@/types/auth";

import { obtenerMensajeError } from "@/utils/mensajeError";
import axios from "axios";
import { quePreparamos } from "./cliente";

// Conservamos el código HTTP (por ejemplo 429 cuando se reenvía muy seguido)
// para que cada pantalla decida cómo mostrar el problema.
export class RecuperacionError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "RecuperacionError";
  }
}

// Paso 1: pedir el envío del código. La respuesta del servidor es un
// mensaje genérico; no confirma si el correo existe, para evitar que
// extraños descifren qué cuentas están registradas.
export async function solicitarCodigoRecuperacion(
  datos: DatosSolicitarRecuperacion,
): Promise<RespuestaSolicitarRecuperacion> {
  try {
    const respuesta = await quePreparamos.post<RespuestaSolicitarRecuperacion>(
      "/auth/recuperacion/solicitar",
      datos,
      {
        headers: {
          // indicamos al servidor que estamos enviando un JSON
          "Content-Type": "application/json",
        },
      },
    );
    return respuesta.data;
  } catch (error: unknown) {
    // si la petición fue cancelada la volvemos a lanzar sin modificarla
    if (axios.isCancel(error)) throw error;
    throw new RecuperacionError(
      obtenerMensajeError(error) || "No pudimos enviar el código",
      axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0,
    );
  }
}

// Paso 2: comprobar el código escrito por la persona. Si es correcto,
// el servidor devuelve la autorización temporal (token_recuperacion)
// necesaria para el paso 3. Este token es de un solo uso.
export async function verificarCodigoRecuperacion(
  datos: DatosVerificarRecuperacion,
): Promise<RespuestaVerificarRecuperacion> {
  try {
    const respuesta = await quePreparamos.post<RespuestaVerificarRecuperacion>(
      "/auth/recuperacion/verificar",
      datos,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return respuesta.data;
  } catch (error: unknown) {
    if (axios.isCancel(error)) throw error;
    throw new RecuperacionError(
      obtenerMensajeError(error) || "No pudimos comprobar el código",
      axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0,
    );
  }
}

// Paso 3: guardar la nueva contraseña usando la autorización del paso 2.
// El servidor también cierra todas las sesiones abiertas de esa cuenta.
export async function restablecerContrasenia(
  datos: DatosRestablecerContrasenia,
): Promise<RespuestaRestablecerContrasenia> {
  try {
    const respuesta = await quePreparamos.post<RespuestaRestablecerContrasenia>(
      "/auth/recuperacion/restablecer",
      datos,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return respuesta.data;
  } catch (error: unknown) {
    if (axios.isCancel(error)) throw error;
    throw new RecuperacionError(
      obtenerMensajeError(error) || "No pudimos guardar la nueva contraseña",
      axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0,
    );
  }
}
