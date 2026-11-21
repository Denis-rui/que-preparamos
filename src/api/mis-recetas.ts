import { Mapper } from "@/mappers/mis-recetas.mapper";
import { DetalleMISRecetas } from "@/types/responses/detalleMisRecetas.response";
import { MisRecetas } from "@/types/responses/mis-recetas.response";
import { AxiosError } from "axios";
import { quePreparamos } from "./cliente";

export const obtenerMisRecetasApi = async (
  signal?: AbortSignal,
  filtro?: string,
  buscar?: string,
  pagina?: number,
) => {
  const { data } = await quePreparamos.get<MisRecetas>("mis-recetas", {
    autenticar: true,
    signal,
    params: {
      filtro: filtro,
      buscar: buscar ?? undefined,
      page: pagina ?? 1,
      per_page: 15,
    },
  });
  if (
    !Array.isArray(data?.data) ||
    !data?.meta ||
    !Number.isSafeInteger(data.meta.current_page) ||
    data.meta.current_page < 1 ||
    !Number.isSafeInteger(data.meta.last_page) ||
    data.meta.last_page < 1 ||
    !Number.isSafeInteger(data.meta.total) ||
    data.meta.total < 0
  ) {
    throw new AxiosError(
      "El servidor devolvió un listado incompleto.",
      "NO_DATA",
    );
  }
  const recetas = data.data.map(Mapper.fromMisRecetasResponseToMisRecetas);
  return {
    recetas,
    paginaActual: data.meta.current_page,
    ultimapagina: data.meta.last_page,
    total: data.meta.total,
  };
};

export const obtenerDetalleMiRecetaApi = async (
  id: number,
  signal?: AbortSignal,
) => {
  const { data } = await quePreparamos.get<DetalleMISRecetas>(
    `mis-recetas/${id}`,
    {
      autenticar: true,
      signal,
    },
  );
  const receta = data?.data;

  if (
    !receta ||
    receta.id !== id ||
    (receta.visibilidad !== "privada" && receta.visibilidad !== "publicada") ||
    !Array.isArray(receta.ingredientes) ||
    !Array.isArray(receta.pasos)
  ) {
    throw new AxiosError("La receta no está disponible", "NO_DATA");
  }

  return {
    ...receta,
    imagen_url: quePreparamos.getUri({ url: `mis-recetas/${id}/imagen` }),
  };
};
