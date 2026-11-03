import { actualizarPerfil, actualizarFotoPerfil, prepararFotoPerfil, obtenerPerfil } from "@/api/perfil";
import { CLAVE_SESION } from "@/config/cliente-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerToken, recordarPerfil } from "@/storage/token";
import type { DatosActualizarPerfil, FotoPerfil, Perfil } from "@/types/perfil";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { AxiosError } from "axios";

// Las dos peticiones no son atómicas: conservamos los datos ya confirmados.
export class PerfilGuardadoParcialError extends Error {
  constructor(public usuario: Perfil, detalle: string, datosGuardados: boolean) {
    super(`${datosGuardados ? "Tus datos se guardaron, pero no pudimos actualizar la foto." : "No pudimos actualizar la foto."} ${detalle}`);
    this.name = "PerfilGuardadoParcialError";
  }
}

export function useActualizarPerfil() {
  const clienteQuery = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ foto, ...datos }: DatosActualizarPerfil & { foto?: FotoPerfil }) => {
      const token = await obtenerToken();
      if (!token) throw new Error("Inicia sesión para guardar el perfil.");
      async function comprobarSesion() {
        if (await obtenerToken() !== token) {
          throw new AxiosError("La sesión cambió.", "SESION_CAMBIADA");
        }
      }
      const cuerpo = foto ? prepararFotoPerfil(foto) : undefined;
      // Una edición de solo foto no necesita reenviar nombre y correo.
      let usuario = Object.keys(datos).length > 0
        ? await actualizarPerfil(datos)
        : await obtenerPerfil();
      await comprobarSesion();
      await recordarPerfil(usuario, token);
      clienteQuery.setQueryData(CLAVE_SESION, usuario);
      if (cuerpo) {
        try {
          await comprobarSesion();
          const url = await actualizarFotoPerfil(cuerpo);
          await comprobarSesion();
          usuario = { ...usuario, foto_perfil_url: url };
          await recordarPerfil(usuario, token);
        } catch (error) {
          await comprobarSesion();
          throw new PerfilGuardadoParcialError(
            usuario,
            obtenerMensajeError(error) ?? "Inténtalo nuevamente.",
            Object.keys(datos).length > 0,
          );
        }
      }
      return usuario;
    },
    retry: false,
    networkMode: "always",
    gcTime: 0,

    onSuccess: (usuario) => {
      // Actualizamos los datos de la sesión con la respuesta de Laravel.
      clienteQuery.setQueryData(CLAVE_SESION, usuario);
    },
  });

  return {
    guardarPerfil: mutation.mutateAsync,
    guardando: mutation.isPending,
    limpiarEstado: mutation.reset,
  };
}
