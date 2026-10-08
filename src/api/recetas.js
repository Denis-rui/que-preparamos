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


// Recomendaciones por ingredientes disponibles.
// GET /recetas?ingredientes[]=1&ingredientes[]=2 (+ categoria_id opcional).
// El backend incluye recetas con al menos 1 coincidencia y agrega
// ingredientes_disponibles, ingredientes_faltantes, cantidad_coincidencias
// y cantidad_faltantes. No guarda la selección (solo viene en la consulta).
export async function getRecomendaciones(ids, opciones = {}) {
  const base = process.env.EXPO_PUBLIC_URL_API?.replace(/\/$/, "");
  if (!base) throw new Error("Falta configurar la dirección de la API.");

  const lista = [...new Set((ids ?? []).map(Number).filter((n) => Number.isInteger(n) && n > 0))].slice(0, 50);
  if (lista.length === 0) throw new Error("Selecciona al menos un ingrediente.");

  const params = new URLSearchParams();
  lista.forEach((id) => params.append("ingredientes[]", String(id)));
  const categoriaId = Number(opciones.categoriaId);
  if (Number.isInteger(categoriaId) && categoriaId > 0) params.set("categoria_id", String(categoriaId));
  params.set("page", String(opciones.page ?? 1));
  params.set("per_page", String(opciones.per_page ?? 30));

  const respuesta = await fetch(`${base}/recetas?${params.toString()}`, {
    headers: { Accept: "application/json" },
    signal: opciones.signal,
  });
  if (!respuesta.ok) throw new Error("No se pudieron cargar las recomendaciones.");
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