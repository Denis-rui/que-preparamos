import { ApiError, peticionAutenticada } from "./clienteAutenticado";

// Alias compatible con los imports anteriores.
export { ApiError as PerfilError } from "./clienteAutenticado";

export type Perfil = {
  id: number;
  name: string;
  email: string;
  foto_perfil_url: string | null;
  rol: string;
  activo: boolean;
};

export async function obtenerPerfil(): Promise<Perfil> {
  const json = await peticionAutenticada("/perfil");
  if (
    typeof json?.data?.name !== "string" ||
    typeof json?.data?.email !== "string"
  ) {
    throw new ApiError("El servidor no devolvió un perfil válido.", 200);
  }
  return json.data;
}
