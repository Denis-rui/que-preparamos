// El catálogo de ingredientes es público. Se usa para autocompletar la búsqueda
// y evitar que el usuario escriba ingredientes que no existen en el backend.

export async function getIngredientes(buscar, signal) {
  const base = process.env.EXPO_PUBLIC_URL_API?.replace(/\/$/, "");
  if (!base) throw new Error("Falta configurar la dirección de la API.");

  const params = new URLSearchParams();
  if (buscar) params.set("buscar", buscar);
  params.set("per_page", "10");

  const respuesta = await fetch(`${base}/ingredientes?${params.toString()}`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!respuesta.ok) throw new Error("No se pudieron cargar los ingredientes.");
  return respuesta.json();
}