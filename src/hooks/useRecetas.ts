import { getRecetas, type PaginaRecetas } from "@/api/recetas";
import { useEffect, useState } from "react";

export function useRecetas() {
  const [pagina, setPagina] = useState<PaginaRecetas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cancelamos la petición al desmontar la pantalla para no actualizar un estado antiguo.
    const controller = new AbortController();
    async function cargar() {
      try {
        const datos = await getRecetas(controller.signal);
        if (!controller.signal.aborted) setPagina(datos);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Error al cargar las recetas.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void cargar();
    return () => controller.abort();
  }, []);

  return { recetas: pagina?.data ?? [], meta: pagina?.meta, loading, error };
}
