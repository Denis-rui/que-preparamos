import { quePreparamos } from "./cliente";

export async function obtenerCantidadFavoritos(): Promise<number> {
  // meta.total cuenta toda la colección, no solo la página descargada.
  // Pedimos un solo elemento porque aquí únicamente necesitamos el total.
  const respuesta = await quePreparamos.get("/favoritos", {
    autenticar: true,
    params: {
      page: 1,
      per_page: 1,
    },
  });

  const total = respuesta.data?.meta?.total;
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new Error("No pudimos obtener la cantidad de recetas guardadas.");
  }
  return total;
}
