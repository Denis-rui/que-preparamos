import type { DatosFormularioReceta } from "./formularioRecetas";
import type { Ingredientes } from "./ingredientes";

export interface IngredienteEnEdicion {
  seleccionado: Ingredientes | null;
  cantidad: string;
  unidad: string;
  notas: string;
}

export interface PublicacionPendiente {
  idReceta: number;
  clave: string;
}

export interface EstadoEdicionReceta {
  datos: DatosFormularioReceta;
  ingrediente: IngredienteEnEdicion;
  publicacion: PublicacionPendiente | null;
}

export interface BorradorReceta {
  version: 1;
  usuarioId: number;
  guardadoEn: string;
  edicion: EstadoEdicionReceta;
}
