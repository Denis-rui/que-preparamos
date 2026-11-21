import { CategoriaResumen } from "../categorias";
import { IngredienteDetalle, PasoReceta } from "../receta";

export interface DetalleMISRecetas {
  data: Data;
}

export interface Data {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  porciones: number;
  tiempo_preparacion: number;
  tips: null | string;
  visibilidad: "privada" | "publicada";
  version: number;
  solicitud_pendiente: SolicitudPendiente | null;
  categoria: CategoriaResumen | null;
  subcategoria: CategoriaResumen | null;
  ingredientes: IngredienteDetalle[];
  pasos: PasoReceta[];
  created_at: string | null;
  updated_at: string | null;
  publicada_en: string | null;
}

export interface SolicitudPendiente {
  id: number;
  tipo: "publicacion" | "correccion";
  estado: "pendiente" | "aprobada" | "rechazada" | "cancelada";
  created_at: string | null;
}
