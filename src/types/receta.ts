export interface Recetas {
  data: Data;
}

export interface Data {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  porciones: number;
  tiempo_preparacion: number;
  categoria: Categoria;
  subcategoria: Categoria;
  valoracion_promedio: null;
  cantidad_valoraciones: number;
  ingredientes_resumen: IngredientesResuman[];
  cantidad_ingredientes: number;
  tips: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Ingrediente {
  ingrediente_id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  notas: string;
  orden: number;
}

export interface IngredientesResuman {
  ingrediente_id: number;
  nombre: string;
}

export interface Paso {
  orden: number;
  instruccion: string;
}
