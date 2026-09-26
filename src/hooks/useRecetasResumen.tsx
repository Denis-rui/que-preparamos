import { getRecetasAleatorias } from "@/api/recetasAleatorias";
import { useEffect, useState } from "react";

export interface CategoriaResumen {
  id: number;
  nombre: string;
}
export interface IngredienteResumen {
  ingrediente_id: number;
  nombre: string;
}
export interface RecetaAleatoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  porciones: number;
  tiempo_preparacion: number;
  categorias: CategoriaResumen[];
  valoracion_promedio: number | null;
  cantidad_valoraciones: number;
  ingredientes_resumen: IngredienteResumen[];
  cantidad_ingredientes: number;
}
export const useRecetasResumen = () => {
  const [recetas, setRecetas] = useState<RecetaAleatoria[]>([]);
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
