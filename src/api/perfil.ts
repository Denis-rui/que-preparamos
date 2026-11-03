import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import { obtenerToken } from "@/storage/token";
import type {
  DatosActualizarPerfil,
  FotoPerfil,
  Perfil,
  RespuestaActualizarFotoPerfil,
  RespuestaActualizarPerfil,
} from "@/types/perfil";
import { AxiosError, CanceledError } from "axios";
import { Platform } from "react-native";
import { quePreparamos } from "./cliente";
import { validarFotoPerfil } from "@/utils/fotoPerfil";

interface RespuestaPerfil {
  data?: Perfil | null;
}

// Descargamos la foto del usuario autenticado usando la URL de API
// configurada en la app, evitando direcciones incorrectas del servidor.
function urlFotoPerfil(): string {
  return quePreparamos.getUri({ url: "/perfil/foto" });
}

function normalizarPerfil(usuario: Perfil): Perfil {
  return {
    ...usuario,
    foto_perfil_url: usuario.foto_perfil_url ? urlFotoPerfil() : null,
  };
}

export const obtenerPerfil = async (signal?: AbortSignal): Promise<Perfil> => {
  const respuesta = await quePreparamos.get<RespuestaPerfil>("/perfil", {
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
  const perfil = normalizarPerfil(usuario);
  clienteQuery.setQueryData<Perfil | null>(CLAVE_SESION, perfil);
  return perfil;
};

// funcion para actualizar el perfil del ususario con el backend

export async function actualizarPerfil(
  datos: DatosActualizarPerfil,
): Promise<Perfil> {
  const respuesta = await quePreparamos.patch<RespuestaActualizarPerfil>(
    "/perfil",
    datos,
    { autenticar: true },
  );
  return normalizarPerfil(respuesta.data.usuario);
}

// Preparamos el archivo antes de guardar datos para detectar errores locales.
export function prepararFotoPerfil(foto: FotoPerfil): FormData {
  const tipo = validarFotoPerfil(foto, true)!;
  const cuerpo = new FormData();
  if (Platform.OS === "web") {
    if (!foto.file)
      throw new Error("Vuelve a seleccionar la foto desde el navegador.");
    cuerpo.append("foto_perfil", foto.file, foto.file.name);
  } else {
    // React Native adjunta archivos locales mediante URI, nombre y MIME.
    const cuerpoNativo = cuerpo as FormData & {
      append(
        campo: string,
        archivo: { uri: string; name: string; type: string },
      ): void;
    };
    cuerpoNativo.append("foto_perfil", {
      uri: foto.uri,
      name: `perfil.${tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg"}`,
      type: tipo,
    });
  }
  return cuerpo;
}

export async function actualizarFotoPerfil(cuerpo: FormData): Promise<string> {
  const respuesta = await quePreparamos.post<RespuestaActualizarFotoPerfil>(
    "/perfil/foto",
    cuerpo,
    { autenticar: true },
  );
  // Axios y el entorno construyen Content-Type con su boundary.
  const url = respuesta.data.foto_perfil_url;
  if (typeof url !== "string" || !url.trim()) {
    throw new Error(
      "El servidor no devolvió la dirección de la foto actualizada.",
    );
  }
  return urlFotoPerfil();
}
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
