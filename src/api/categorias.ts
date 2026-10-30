import { Categoria, CategoriaSubcategorias } from "@/types/categorias";

export async function getCategorias(
  signal?: AbortSignal,
): Promise<Categoria[]> {
  const URL = `${process.env.EXPO_PUBLIC_URL_API}`;

  if (!URL) {
    throw new Error("falta configurar la direccion de la API");
  }

  const respuesta = await fetch(`${URL}/categorias`, {
    headers: {
      // le decimos al servidor que le estamos enviando un JSON
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal,
  });

  // si la respuesta no es correcta, lanzamos un error
  if (!respuesta.ok) {
    throw new Error("Error al obtener las categorías");
  }
  // convertimos la respuesta a JSON y devolvemos los datos
  const json: CategoriaSubcategorias = await respuesta.json();
  if (!Array.isArray(json.data)) {
    throw new Error("el servidor devolvio un catalogo invalido");
  }
  return json.data;
}
