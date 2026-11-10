import { obtenerMisRecetasApi } from "@/api/mis-recetas";
import { CLAVE_SESION } from "@/config/cliente-query";
import { obtenerToken } from "@/storage/token";
import { Perfil } from "@/types/perfil";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useMisRecetas = (
  usuarioId: number,
  filtro: "privadas" | "publicadas",
  buscar?: string,
) => {
  const cliente = useQueryClient();

  const [cabecerasImagen, setCabecerasImagen] = useState<Record<
    string,
    string
  > | null>(null);

  const [errorCabeceraImagen, setErrorCabeceraImagen] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let vigente = true;
    setCabecerasImagen(null);
    const prepararCabecera = async () => {
      try {
        const token = await obtenerToken();
        if (!vigente) return;
        const perfil = cliente.getQueryData<Perfil | null>(CLAVE_SESION);
        if (!token || perfil?.id !== usuarioId) {
          throw new Error("No pudimos verificar la sesión.");
        }
        const tokenActual = await obtenerToken();
        if (!vigente) return;
        if (tokenActual !== token) {
          throw new Error("La sesión cambió.");
        }
        setCabecerasImagen({
          Authorization: `Bearer ${token}`,
        });
      } catch (error) {
        if (!vigente) return;

        setErrorCabeceraImagen("No pudimos preparar el acceso a las imágenes.");
      }
    };
    void prepararCabecera();

    return () => {
      vigente = false;
    };
  }, [cliente, usuarioId]);

  const consultaGuardada = useInfiniteQuery({
    queryKey: ["mis-recetas", usuarioId, filtro, buscar],
    enabled: Number.isSafeInteger(usuarioId) && usuarioId > 0,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const comprobarCuentaActual = () => {
        const perfil = cliente.getQueryData<Perfil | null>(CLAVE_SESION);
        if (perfil?.id !== usuarioId) {
          throw new AxiosError("La sesión cambió.", "SESION_CAMBIADA");
        }
      };
      comprobarCuentaActual();
      const resultado = await obtenerMisRecetasApi(
        signal,
        filtro,
        buscar,
        pageParam,
      );
      comprobarCuentaActual();
      return resultado;
    },

    getNextPageParam: (ultimaPagina) => {
      if (ultimaPagina.paginaActual < ultimaPagina.ultimapagina) {
        return ultimaPagina.paginaActual + 1;
      }
      return undefined;
    },
    networkMode: "online",
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15, // 15 minutos
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const recetas =
    consultaGuardada.data?.pages.flatMap((pagina) => pagina.recetas) ?? [];

  return { consultaGuardada, recetas, cabecerasImagen, errorCabeceraImagen };
};

export default useMisRecetas;
