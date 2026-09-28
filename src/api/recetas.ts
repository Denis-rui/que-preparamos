import type { RecetaResumen } from "@/types/receta";

export interface PaginaRecetas {
  data: RecetaResumen[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// El catálogo es público. Conservamos la paginación para añadir "cargar más" después.
export async function getRecetas(signal?: AbortSignal): Promise<PaginaRecetas> {
  const base = process.env.EXPO_PUBLIC_URL_API?.replace(/\/$/, "");
  if (!base) throw new Error("Falta configurar la dirección de la API.");
  const respuesta = await fetch(`${base}/recetas?page=1&per_page=15`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!respuesta.ok) throw new Error("No se pudieron cargar las recetas.");
  return respuesta.json();
}
