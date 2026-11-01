import type {
  FiltrosRecetas,
  PaginaRecetas,
  PaginaRecomendaciones,
} from "@/types/receta";
import { quePreparamos } from "./cliente";

// El catálogo es público. Conservamos la paginación para añadir "cargar más" después.
//Consulta categorias y subcategorias

//Busqueda por ingrediente
interface OpcionesRecomendaciones {
  categoriaId?: number;
  page?: number;
  per_page?: number;
  signal?: AbortSignal;
}

//Consulta busqueda y filtro
export async function getRecetas(
  signal?: AbortSignal,
  filtros: FiltrosRecetas = {},
): Promise<PaginaRecetas> {
  const respuesta = await quePreparamos.get<PaginaRecetas>("/recetas", {
    signal,
    params: {
      page: "1",
      per_page: "15",
      buscar: filtros.buscar?.trim() || undefined,
      categoria_id: filtros.categoriaId,
      subcategoria_id: filtros.subcategoriaId,
    },
  });
  return respuesta.data;
}

// Recomendaciones por ingredientes disponibles.
export async function getRecomendaciones(
  ids: (number | string)[],
  opciones: OpcionesRecomendaciones = {},
): Promise<PaginaRecomendaciones> {
  const lista = [
    ...new Set(ids.map(Number).filter((id) => Number.isInteger(id) && id > 0)),
  ].slice(0, 50);

  if (lista.length === 0)
    throw new Error("Selecciona al menos un ingrediente.");

  const parametros = new URLSearchParams();

  lista.forEach((id) => parametros.append("ingredientes[]", String(id)));
  const categoriaId = Number(opciones.categoriaId);
  if (Number.isInteger(categoriaId) && categoriaId > 0) {
    parametros.set("categoria_id", String(categoriaId));
  }
  parametros.set("page", String(opciones.page ?? 1));
  parametros.set("per_page", String(opciones.per_page ?? 30));

  const respuesta = await quePreparamos.get<PaginaRecomendaciones>("/recetas", {
    signal: opciones.signal,
    params: parametros,
  });
  return respuesta.data;
}

// El detalle también es público. Devuelve ingredientes, pasos y tips completos.
export async function getRecetaPorId(
  id: number | string,
  signal?: AbortSignal,
) {
  const respuesta = await quePreparamos(
    `/recetas/${encodeURIComponent(String(id))}`,
    {
      signal,
    },
  );
  return respuesta.data;
}
