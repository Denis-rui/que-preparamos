// El catálogo es público. Conservamos la paginación para añadir "cargar más" después.

export async function getRecetas(signal) {
  const base = process.env.EXPO_PUBLIC_URL_API?.replace(/\/$/, "");
  if (!base) throw new Error("Falta configurar la dirección de la API.");
  const respuesta = await fetch(`${base}/recetas?page=1&per_page=15`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!respuesta.ok) throw new Error("No se pudieron cargar las recetas.");
  return respuesta.json();
}


// El detalle también es público. Devuelve ingredientes, pasos y tips completos.
export async function getRecetaPorId(id, signal){
  const base = process.env.EXPO_PUBLIC_URL_API?.replace(/\/$/, "");
  if(!base) throw new Error("Falta configurar la dirección de la API");
  const respuesta = await fetch(`${base}/recetas/${id}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if(!respuesta.ok) throw new Error("No se pudo cargar la receta.");
  return respuesta.json();
}