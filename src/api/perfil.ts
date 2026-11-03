import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import { obtenerToken } from "@/storage/token";
import { Perfil } from "@/types/perfil";
import { AxiosError, CanceledError } from "axios";
import { quePreparamos } from "./cliente";

interface RespuestaPerfil {
  data?: Perfil | null;
}

export const obtenerPerfil = async (signal?: AbortSignal): Promise<Perfil> => {
  const respuesta = await quePreparamos.get("/perfil", {
    autenticar: true,
    // redirigirExpiracion: false,
    signal,
  });
  const usuario = respuesta.data.data;
  if (
    !usuario ||
    !Number.isSafeInteger(usuario.id) ||
    usuario.id <= 0 ||
    typeof usuario.name !== "string" ||
    typeof usuario.email !== "string" ||
    usuario.activo !== true
  ) {
    throw new Error("El servidor no devolvió una sesión válida.");
  }

  const tokenPeticion = respuesta.config.tokenSesion;
  const tokenActual = await obtenerToken();

  if (signal?.aborted) {
    throw new CanceledError();
  }

  if (!tokenPeticion || tokenActual !== tokenPeticion) {
    throw new AxiosError(
      "La sesión cambió durante la comprobación.",
      "SESION_CAMBIADA",
      respuesta.config,
    );
  }
  clienteQuery.setQueryData<Perfil | null>(CLAVE_SESION, usuario);
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
