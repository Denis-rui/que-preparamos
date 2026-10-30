export interface CategoriaSubcategorias {
  data: Categoria[];
}

export interface Categoria {
  id: number;
  nombre: string;
  subcategorias: Subcategoria[];
}

export interface Subcategoria {
  id: number;
  nombre: string;
}
export interface CategoriaResumen {
  id: number;
  nombre: string;
}
