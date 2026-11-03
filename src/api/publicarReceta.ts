import { AxiosError } from "axios";
import { quePreparamos } from "./cliente";

export type EstadoPublicacion =
  | "publicada"
  | "pendiente"
  | "rechazada"
  | "aprobada"
  | "cancelada";

interface RespuestaPublicacion {
  receta?: {
    id: number;
    visibilidad: string;
  };

  solicitud?: {
    id: number;
    receta_id: number;
    tipo: string;
    estado: string;
  };
}

export const publicarReceta = async (
  recetaId: number,
  clave: string,
): Promise<EstadoPublicacion> => {
  const respuesta = await quePreparamos.post<RespuestaPublicacion>(
    `/mis-recetas/${recetaId}/publicar`,
    {
      clave_idempotencia: clave,
    },
    {
      autenticar: true,
    },
  );
  const json = respuesta.data;

  if (
    json?.receta?.id === recetaId &&
    json.receta.visibilidad === "publicada"
  ) {
    return "publicada";
  }

  const solicitud = json?.solicitud;
  if (
    solicitud &&
    Number.isSafeInteger(solicitud.id) &&
    solicitud.id > 0 &&
    solicitud.receta_id === recetaId &&
    solicitud.tipo === "publicacion"
  ) {
    switch (solicitud.estado) {
      case "pendiente":
      case "rechazada":
      case "aprobada":
      case "cancelada":
        return solicitud.estado;
    }
  }
  throw new AxiosError(
    "No se pudo confirmar el estado de la publicacion",
    "NO_DATA",
    respuesta.config,
    respuesta.request,
    respuesta,
  );
};
