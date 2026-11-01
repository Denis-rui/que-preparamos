import { Ingredientes } from "./ingredientes";

export interface TextosReceta {
  nombre: string;
  descripcion: string;
  porciones: string;
  tiempoPreparacion: string;
  tips: string;
}
export interface IngredienteFormulario extends Ingredientes {
  cantidad: string;
  unidad: string;
  notas: string;
}
export interface DatosFormularioReceta extends TextosReceta {
  categoriaId: number | null;
  subcategoriaId: number | null;
  ingredientes: IngredienteFormulario[];
}
