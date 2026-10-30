export interface CategoriaResumen {
  id: number;
  nombre: string;
}

export interface SubcategoriaResumen {
  id: number;
  nombre: string;
}
export interface Categoria extends CategoriaResumen {
  subcategorias: SubcategoriaResumen[];
}

export interface RespuestaCategorias {
  data: Categoria[];
}
