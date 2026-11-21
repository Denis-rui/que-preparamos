import { obtenerDetalleMiRecetaApi } from "@/api/mis-recetas";
import { CLAVE_SESION } from "@/config/cliente-query";
import { Perfil } from "@/types/perfil";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { esFalloDeConexion } from "./useConexion";

const useDetalleMiReceta = (usuarioId: number, id: number) => {
  const cliente = useQueryClient();

  const consulta = useQuery({
    queryKey: ["mis-recetas-detalle", usuarioId, id],
    queryFn: async ({ signal }) => {
      const comprobarCuenta = () => {
        if (
          cliente.getQueryData<Perfil | null>(CLAVE_SESION)?.id !== usuarioId
        ) {
          throw new AxiosError("La sesion cambio", "SESION_CAMBIADA");
        }
      };
      comprobarCuenta();
      const receta = await obtenerDetalleMiRecetaApi(id, signal);
      comprobarCuenta();
      return receta;
    },
    refetchOnMount: "always",
    gcTime: 0,
    retry: (intentos, error) => intentos < 1 && esFalloDeConexion(error),
  });
  const estado = isAxiosError(consulta.error)
    ? consulta.error.response?.status
    : undefined;
  const accesoPerdido =
    isAxiosError(consulta.error) &&
    (estado === 401 ||
      estado === 403 ||
      estado === 404 ||
      consulta.error.code === "SESION_CAMBIADA" ||
      consulta.error.code === "SESION_NO_ENCONTRADA");
  return {
    ...consulta,
    receta: accesoPerdido ? undefined : consulta.data,
  };
};

export default useDetalleMiReceta;
