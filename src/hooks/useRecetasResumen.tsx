import { getRecetasAleatorias } from "@/api/recetasAleatorias";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useQuery } from "@tanstack/react-query";

export function useRecetasResumen() {
  const consulta = useQuery({
    queryKey: ["recetas", "aleatorias"],
    queryFn: ({ signal }) => getRecetasAleatorias(signal),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const sinDatos = consulta.data === undefined;
  const mensajeError = obtenerMensajeError(consulta.error);

  return {
    recetas: consulta.data ?? [],
    loading: consulta.isLoading,
    enEspera: consulta.fetchStatus === "paused",
    vacio: consulta.data !== undefined && consulta.data.length === 0,
    errorOriginal: consulta.error,
    error: sinDatos ? mensajeError : null,
    errorActualizacion: sinDatos ? null : mensajeError,
    actualizando: consulta.isRefetching,
    actualizar: () => consulta.refetch({ cancelRefetch: false }),
  };
}

/* export const useRecetasResumen = () => {
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
}; */
