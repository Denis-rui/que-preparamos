import { getRecomendaciones } from "@/api/recetas";
import type { RecetaRecomendada } from "@/types/receta";
import { useEffect, useState } from "react";

// Orden que pidió el equipo: primero las completas (0 faltantes),
// luego las que menos ingredientes piden prestados.
export function ordenarRecomendaciones(
  recetas: RecetaRecomendada[],
): RecetaRecomendada[] {
  return [...recetas].sort((a, b) => {
    const faltantesA = a.cantidad_faltantes ?? 0;
    const faltantesB = b.cantidad_faltantes ?? 0;
    if (faltantesA !== faltantesB) return faltantesA - faltantesB;
    if (a.cantidad_ingredientes !== b.cantidad_ingredientes) {
      return a.cantidad_ingredientes - b.cantidad_ingredientes;
    }
    return b.id - a.id;
  });
}

export function useRecomendaciones(ids: number[], categoriaId?: number | null) {
  const [recetas, setRecetas] = useState<RecetaRecomendada[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [tieneMas, setTieneMas] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [intento, setIntento] = useState(0);

  // "1,2,3" ordenados: si cambia, es otra búsqueda y se vuelve a pedir.
  const clave = [...ids].sort((a, b) => a - b).join(",");

  // Reintentar es simplemente pedir de nuevo (sube el contador).
  function recargar() {
    setIntento((n) => n + 1);
  }

  useEffect(() => {
    if (ids.length === 0) {
      setRecetas([]);
      setTotal(0);
      setTieneMas(false);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const respuesta = await getRecomendaciones(ids, {
          categoriaId: categoriaId ?? undefined,
          per_page: 30,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setRecetas(ordenarRecomendaciones(respuesta.data ?? []));
          setTotal(respuesta.meta?.total ?? respuesta.data?.length ?? 0);
          setPagina(1);
          setTieneMas(
            (respuesta.meta?.current_page ?? 1) <
              (respuesta.meta?.last_page ?? 1),
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las recomendaciones.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void cargar();
    return () => controller.abort();
  }, [clave, categoriaId, intento]);

  // Scroll infinito: pide la página siguiente y la suma a la lista.
  async function cargarMas() {
    if (cargandoMas || !tieneMas) return;
    setCargandoMas(true);
    try {
      const siguiente = pagina + 1;
      const respuesta = await getRecomendaciones(ids, {
        categoriaId: categoriaId ?? undefined,
        page: siguiente,
        per_page: 30,
      });
      setRecetas((previas) =>
        ordenarRecomendaciones([...previas, ...(respuesta.data ?? [])]),
      );
      setPagina(siguiente);
      setTieneMas(
        (respuesta.meta?.current_page ?? siguiente) <
          (respuesta.meta?.last_page ?? siguiente),
      );
    } catch {
      setError("No se pudieron cargar más recetas.");
    } finally {
      setCargandoMas(false);
    }
  }

  return {
    recetas,
    total,
    loading,
    error,
    recargar,
    tieneMas,
    cargandoMas,
    cargarMas,
  };
}
