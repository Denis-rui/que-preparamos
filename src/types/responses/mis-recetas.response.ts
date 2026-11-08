export interface MisRecetas {
  data: Datum[];
  links: Links;
  meta: Meta;
}

export interface Datum {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  porciones: number;
  tiempo_preparacion: number;
  categoria: Categoria;
  subcategoria: Categoria;
  ingredientes_resumen: IngredientesResuman[];
  cantidad_ingredientes: number;
  visibilidad: string;
  version: number;
  solicitud_pendiente: SolicitudPendiente | null;
  created_at: string;
  updated_at: string;
  publicada_en: string | null;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface IngredientesResuman {
  ingrediente_id: number;
  nombre: string;
}

export interface SolicitudPendiente {
  id: number;
  tipo: string;
  estado: string;
  created_at: string;
}

export interface Links {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  page: number | null;
  active: boolean;
}
