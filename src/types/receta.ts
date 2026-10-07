// Resumen compartido por Inicio y Explorar.
// Los tipos permanecen aquí; el servicio de API está escrito en JavaScript.
export interface PaginaRecetas {
  data: RecetaResumen[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

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

// Respuesta de GET /recetas cuando se filtra por ingredientes[].
// El backend agrega disponibles/faltantes solo con selección no vacía.
export interface RecetaRecomendada extends RecetaResumen {
  ingredientes_disponibles: IngredienteResumen[];
  ingredientes_faltantes: IngredienteResumen[];
  cantidad_coincidencias: number;
  cantidad_faltantes: number;
}

export interface PaginaRecomendaciones {
  data: RecetaRecomendada[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
