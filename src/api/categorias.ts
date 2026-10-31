import { Categoria, CategoriaSubcategorias } from "@/types/categorias";
import { quePreparamos } from "./cliente";

export const getCategorias = async (
  signal?: AbortSignal,
): Promise<Categoria[]> => {
  const respuesta = await quePreparamos.get<CategoriaSubcategorias>(
    "/categorias",
    {
      signal,
    },
  );

  const json = respuesta.data;
  if (!Array.isArray(json.data)) {
    throw new Error("El servidor no ha devuelto un catalogo valido");
  }
  return json.data;
};
