import { ImagePickerAsset } from "expo-image-picker";
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
  imagen: ImagePickerAsset | null;
  categoriaId: number | null;
  subcategoriaId: number | null;
  ingredientes: IngredienteFormulario[];
  pasos: PasoFormulario[];
}
export interface PasoFormulario {
  id: number;
  instruccion: string;
}
