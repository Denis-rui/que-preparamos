export interface MisRecetas {
  id: number;
  nombre: string;
  imagen_url: string;
  visibilidad: string;
  version: number;
  solicitud_pendiente: SolicitudPendiente | null;
  creada: Date;
  actualizada: Date;
  publicada: Date | null;
}
export interface SolicitudPendiente {
  id: number;
  tipo: string;
  estado: string;
  solicitudCreada: Date;
}
