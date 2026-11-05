import { getRecomendaciones } from "@/api/recetas";
import type { RecetaRecomendada } from "@/types/receta";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useEffect, useRef, useState } from "react";

// La clave resume la búsqueda; el efecto la usa como dependencia estable.
function idsDesdeClave(clave: string): number[] {
  if (!clave) return [];
  return clave
    .split(",")
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function useRecomendaciones(ids: number[], categoriaId?: number | null) {
  const [recetas, setRecetas] = useState<RecetaRecomendada[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [tieneMas, setTieneMas] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [errorMas, setErrorMas] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const cargandoMasRef = useRef(false);
  const cargarMasControllerRef = useRef<AbortController | null>(null);

  // "1,2,3" ordenados: si cambia, es otra búsqueda y se vuelve a pedir.
  const clave = [...ids].sort((a, b) => a - b).join(",");

  // Reintentar es simplemente pedir de nuevo (sube el contador).
  function recargar() {
    setIntento((n) => n + 1);
  }

  useEffect(() => {
    // Si cambia la búsqueda, cancelamos cualquier carga adicional anterior.
    cargarMasControllerRef.current?.abort();
    cargarMasControllerRef.current = null;
    cargandoMasRef.current = false;
    setCargandoMas(false);
    setErrorMas(null);

    const idsConsulta = idsDesdeClave(clave);
    if (idsConsulta.length === 0) {
      setRecetas([]);
      setTotal(0);
      setTieneMas(false);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const respuesta = await getRecomendaciones(idsConsulta, {
          categoriaId: categoriaId ?? undefined,
          per_page: 30,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          // El backend ya entrega el orden acordado; no reordenamos aquí.
          setRecetas(respuesta.data ?? []);
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
            obtenerMensajeError(err) ??
              "No se pudieron cargar las recomendaciones.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void cargar();

    return () => {
      controller.abort();
      cargarMasControllerRef.current?.abort();
      cargarMasControllerRef.current = null;
      cargandoMasRef.current = false;
    };
  }, [clave, categoriaId, intento]);

  // Scroll infinito: pide la página siguiente y la suma a la lista.
  async function cargarMas() {
    if (cargandoMasRef.current || !tieneMas) return;
    const idsConsulta = idsDesdeClave(clave);
    if (idsConsulta.length === 0) return;

    const controller = new AbortController();
    cargarMasControllerRef.current = controller;
    cargandoMasRef.current = true;
    setCargandoMas(true);
    setErrorMas(null);
    try {
      const siguiente = pagina + 1;
      const respuesta = await getRecomendaciones(idsConsulta, {
        categoriaId: categoriaId ?? undefined,
        page: siguiente,
        per_page: 30,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      // Evitamos duplicados si onEndReached dispara más de una vez.
      setRecetas((previas) => {
        const vistos = new Set(previas.map((receta) => receta.id));
        const nuevas = (respuesta.data ?? []).filter(
          (receta) => !vistos.has(receta.id),
        );
        return [...previas, ...nuevas];
      });
      setPagina(siguiente);
      setTieneMas(
        (respuesta.meta?.current_page ?? siguiente) <
          (respuesta.meta?.last_page ?? siguiente),
      );
    } catch (err) {
      if (!controller.signal.aborted) {
        setErrorMas(
          obtenerMensajeError(err) ?? "No se pudieron cargar más recetas.",
        );
      }
    } finally {
      if (cargarMasControllerRef.current === controller) {
        cargarMasControllerRef.current = null;
        cargandoMasRef.current = false;
        setCargandoMas(false);
      }
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
    errorMas,
    cargarMas,
  };
}
