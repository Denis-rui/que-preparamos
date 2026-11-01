import axios from "axios";

export function obtenerMensajeError(error: unknown): string | null {
  if (error == null || axios.isCancel(error)) {
    return null;
  }
  if (!axios.isAxiosError<unknown>(error)) {
    return "No pudimos completar la operación. Inténtalo nuevamente.";
  }

  // Códigos locales definidos en tu cliente Axios.
  if (error.code === "SESION_CAMBIADA") {
    return "La sesión cambió. Vuelve a cargar la información.";
  }

  if (error.code === "SESION_NO_ENCONTRADA") {
    return "Inicia sesión para continuar.";
  }

  if (error.code === "NO_DATA") {
    return "El servidor devolvió información incompleta.";
  }

  const estado = error.response?.status;

  if (estado !== undefined) {
    // No mostramos posibles mensajes técnicos del servidor.
    if (estado >= 500) {
      return "El servidor no pudo completar la operación. Inténtalo más tarde.";
    }

    if (error.code === "ERR_BAD_RESPONSE") {
      return "No pudimos interpretar la respuesta del servidor.";
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
