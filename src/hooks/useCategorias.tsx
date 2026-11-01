import { getCategorias } from "@/api/categorias";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { useQuery } from "@tanstack/react-query";

export function useCategorias() {
  const consulta = useQuery({
    queryKey: ["categorias"],
    queryFn: ({ signal }) => getCategorias(signal),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30,
    retry: false,
  });

  const sinDatos = consulta.data === undefined;

  const mensajeError = obtenerMensajeError(consulta.error);
  return {
    categorias: consulta.data ?? [],
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

/* export const useCategorias = () => {
  // const [categorias, setCategorias] = useState<Categoria[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // // Función para cargar los datos de categorías
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const cargarDatos = async () => {
  //     try {
  //       setLoading(true); // establecer el estado de carga en true
  //       const data = await getCategorias(controller.signal); // llamada a la API para obtener las categorías
  //       if (!controller.signal.aborted) {
  //         setCategorias(data); // actualizar el estado de categorías con los datos obtenidos
  //       }
  //     } catch (err: unknown) {
  //       if (controller.signal.aborted) return;
  //       // Comprobar si el error es una instancia de Error y establecer el estado de error
  //       setError(err instanceof Error ? err.message : "Error inesperado");
  //     } finally {
  //     if (!controller.signal.aborted) {
  //       setLoading(false); // terminar la carga, independientemente de si hubo un error o no
  //     }
  //   }
  // };
  //   cargarDatos();
  //   return () => controller.abort(); // limpiar la llamada si el componente se desmonta
  // }, []);
  // return { categorias, loading, error }; // devolver el estado de categorías, carga y error
  
}; */
