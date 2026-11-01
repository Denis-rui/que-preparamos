export interface TextosReceta {
  nombre: string;
  descripcion: string;
  porciones: string;
  tiempoPreparacion: string;
  tips: string;
}

export interface DatosFormularioReceta extends TextosReceta {
  categoriaId: number | null;
  subcategoriaId: number | null;
}
