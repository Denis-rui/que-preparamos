import { Ingredientes } from "@/types/ingredientes";
import { useEffect, useState } from "react";
import { getIngredientes } from "../api/ingredientes";

export const useBuscarIngredientes = (texto: string) => {
  const [resultados, setResultados] = useState<Ingredientes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!texto.trim()) {
      setResultados([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setResultados([]);
    const controller = new AbortController();

    const temporizador = setTimeout(async () => {
      try {
        const json = await getIngredientes(texto.trim(), controller.signal);
        if (controller.signal.aborted) return;
        setResultados(json.data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(temporizador);
      controller.abort();
    };
  }, [texto]);

  return { resultados, loading, error };
};
