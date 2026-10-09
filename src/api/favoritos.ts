import { ApiError, peticionAutenticada } from "./clienteAutenticado";

export async function obtenerCantidadFavoritos(): Promise<number> {
  // meta.total cuenta toda la colección, no solo la página descargada.
  // Pedimos un solo elemento porque aquí únicamente necesitamos el total.
  const json = await peticionAutenticada("/favoritos?page=1&per_page=1");
  const total = json?.meta?.total;
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new ApiError(
      "No pudimos obtener la cantidad de recetas guardadas.",
      200,
    );
  }
  return total;
}
