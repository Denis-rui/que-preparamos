// Resumen compartido por Inicio y Explorar.
export interface CategoriaResumen {
  id: number;
  nombre: string;
}
export interface IngredienteResumen {
  ingrediente_id: number;
  nombre: string;
}
export interface RecetaResumen {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  porciones: number;
  tiempo_preparacion: number;
  categorias: CategoriaResumen[];
  valoracion_promedio: number | null;
  cantidad_valoraciones: number;
  ingredientes_resumen: IngredienteResumen[];
  cantidad_ingredientes: number;
}
