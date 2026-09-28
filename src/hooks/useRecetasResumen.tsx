import { getRecetasAleatorias } from "@/api/recetasAleatorias";
import { useEffect, useState } from "react";

import type { RecetaResumen } from "@/types/receta";

export const useRecetasResumen = () => {
  const [recetas, setRecetas] = useState<RecetaResumen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const data = await getRecetasAleatorias();
        setRecetas(data);
      } catch (err) {
        setError("Error al obtener las recetas aleatorias");
      } finally {
        setLoading(false);
      }
    };
    fetchRecetas();
  }, []);
  return { recetas, loading, error };
};
