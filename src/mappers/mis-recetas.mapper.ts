import { MisRecetas } from "@/types/mis-recetas";
import { Datum } from "@/types/responses/mis-recetas.response";

export class Mapper {
  static fromMisRecetasResponseToMisRecetas(data: Datum): MisRecetas {
    return {
      id: data.id,
      nombre: data.nombre,
      imagen_url: data.imagen_url,
      visibilidad: data.visibilidad,
      version: data.version,
      solicitud_pendiente: data.solicitud_pendiente
        ? {
            id: data.solicitud_pendiente.id,
            tipo: data.solicitud_pendiente.tipo,
            estado: data.solicitud_pendiente.estado,
            solicitudCreada: new Date(data.solicitud_pendiente.created_at),
          }
        : null,
      creada: new Date(data.created_at),
      actualizada: new Date(data.updated_at),
      publicada: data.publicada_en ? new Date(data.publicada_en) : null,
    };
  }
}
