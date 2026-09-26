import { useEffect, useState } from "react";
import { getCategorias } from "../api/categorias";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los datos de categorías
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true); // establecer el estado de carga en true
        const data = await getCategorias(); // llamada a la API para obtener las categorías
        setCategorias(data); // actualizar el estado con los datos obtenidos
      } catch (err) {
        // Comprobar si el error es una instancia de Error y establecer el estado de error
        setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        setLoading(false); // terminar la carga, independientemente de si hubo un error o no
      }
    };
    cargarDatos();
  }, []);

  return { categorias, loading, error }; // devolver el estado de categorías, carga y error
};
