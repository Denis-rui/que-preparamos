import axios from "axios";

// mensajes de error para mostrar al usuario según el tipo de error recibido.

export function obtenerMensajeError(error: unknown): string | null {
  // Si no hay error o la solicitud fue cancelada, no mostramos mensaje.
  if (error == null || axios.isCancel(error)) {
    return null;
  }
  // Si no es un error de Axios, devolvemos un mensaje genérico.
  if (!axios.isAxiosError<unknown>(error)) {
    return "No pudimos completar la operación. Inténtalo nuevamente.";
  }
  // si la sesion a cambiado
  if (error.code === "SESION_CAMBIADA") {
    return "La sesión cambió. Vuelve a cargar la información.";
  }

  // si no existen sesion
  if (error.code === "SESION_NO_ENCONTRADA") {
    return "Inicia sesión para continuar.";
  }
  // si no hay datos
  if (error.code === "NO_DATA") {
    return "El servidor devolvió información incompleta.";
  }

  const estado = error.response?.status;

  if (estado !== undefined) {
    if (estado >= 500) {
      return "El servidor no pudo completar la operación. Inténtalo más tarde.";
    }

    if (error.code === "ERR_BAD_RESPONSE") {
      return "No pudimos interpretar la respuesta del servidor.";
    }

    if (estado >= 400 && estado < 500) {
      const cuerpo = error.response?.data;
      //
      if (typeof cuerpo === "object" && cuerpo !== null) {
        const mensaje = "mensaje" in cuerpo ? cuerpo.mensaje : undefined;
        if (typeof mensaje === "string" && mensaje.trim()) {
          return mensaje.trim();
        }

        // Si mensaje no existe o está vacío, probamos message.
        const message = "message" in cuerpo ? cuerpo.message : undefined;

        if (typeof message === "string" && message.trim()) {
          return message.trim();
        }
      }
    }
    switch (estado) {
      case 401:
        return "No pudimos verificar tu acceso.";
      case 403:
        return "No tienes permiso para realizar esta acción.";
      case 404:
        return "El contenido solicitado no está disponible.";
      case 409:
        return "La información cambió. Actualiza e inténtalo nuevamente.";
      case 422:
        return "Revisa los datos ingresados.";
      case 429:
        return "Espera un momento antes de volver a intentarlo.";
      default:
        return "No pudimos completar la solicitud.";
    }
  }

  if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
    return "El servidor tardó demasiado en responder.";
  }

  if (error.code === "ERR_BAD_RESPONSE") {
    return "No pudimos interpretar la respuesta del servidor.";
  }

  if (error.code === "ERR_NETWORK" || error.request) {
    return "No pudimos comunicarnos con el servidor. Revisa tu conexión.";
  }

  return "No pudimos preparar la solicitud.";
}
