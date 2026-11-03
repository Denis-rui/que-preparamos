import type { ValoracionReceta } from "@/types/receta";
import { quePreparamos } from "./cliente";

// Registra o modifica el voto propio. Requiere sesión.
export async function guardarValoracion(
  recetaId: number | string,
  puntuacion: number,
): Promise<ValoracionReceta> {
  const respuesta = await quePreparamos.put<{
    mensaje: string;
    data: ValoracionReceta;
  }>(
    `/recetas/${encodeURIComponent(String(recetaId))}/valoracion`,
    { puntuacion },
    { autenticar: true },
  );
  return respuesta.data.data;
}