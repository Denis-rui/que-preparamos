import { Perfil } from "@/types/perfil";
import { quePreparamos } from "./cliente";

// Alias compatible con los imports anteriores.
export { ApiError as PerfilError } from "./clienteAutenticado";

export const obtenerPerfil = async (signal?: AbortSignal): Promise<Perfil> => {
  const respuesta = await quePreparamos.get("/perfil", {
    autenticar: true,
    redirigirExpiracion: false,
    signal,
  });
  const usuario = respuesta.data.data;
  if (
    !usuario ||
    !Number.isInteger(usuario.id) ||
    typeof usuario.name !== "string" ||
    typeof usuario.email !== "string" ||
    usuario.activo !== true
  ) {
    throw new Error("El servidor no devolvió una sesión válida.");
  }
  return usuario;
};

/* export async function obtenerPerfil(): Promise<Perfil> {
  const json = await peticionAutenticada("/perfil");
  if (
    typeof json?.data?.name !== "string" ||
    typeof json?.data?.email !== "string"
  ) {
    throw new ApiError("El servidor no devolvió un perfil válido.", 200);
  }
  return json.data;
} */
