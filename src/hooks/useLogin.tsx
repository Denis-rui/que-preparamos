import { AuthError, iniciarSesion } from "@/api/auth";
import type { DatosLogin } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Guardamos el token en SecureStore.
import { CLAVE_SESION } from "@/config/cliente-query";
import { trasladarFavoritosInvitado } from "@/storage/favoritos";
import {
  eliminarToken,
  guardarToken,
  obtenerToken,
  recordarPerfil,
} from "@/storage/token";
import { Perfil } from "@/types/perfil";

export type LoginCredentials = Pick<DatosLogin, "email" | "password">;

export function useLogin(cuentaGuardada = false) {
  const [error, setError] = useState<string | null>(null);
  const [credencialesRechazadas, setCredencialesRechazadas] = useState(false);
  const clienteQuery = useQueryClient();

  async function ejecutarLogin({ email, password }: LoginCredentials) {
    setError(null);
    setCredencialesRechazadas(false);

    try {
      if (!email.trim() || !password) {
        throw new Error(
          cuentaGuardada
            ? "Ingresa tu contraseña."
            : "Ingresa tu correo y contraseña.",
        );
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new Error("Ingresa un correo electrónico válido.");
      }

      // Validamos el acceso con el servidor.

      const respuesta = await iniciarSesion({
        email: email.trim(),
        password,
      });

      // Revisamos el token recibido.
      if (typeof respuesta.token !== "string" || !respuesta.token.trim()) {
        throw new Error("No se recibio un token válido.");
      }
      const usuario = respuesta.usuario;
      if (
        !usuario ||
        !Number.isSafeInteger(usuario.id) ||
        usuario.id <= 0 ||
        typeof usuario.name !== "string" ||
        typeof usuario.email !== "string" ||
        usuario.activo !== true
      ) {
        throw new Error("El servidor no devolvió una cuenta válida.");
      }

      // Guardamos la sesión.
      await guardarToken(respuesta.token);
      await recordarPerfil(usuario, respuesta.token);
      if ((await obtenerToken()) !== respuesta.token) {
        throw new Error("La sesión cambió. Inténtalo nuevamente.");
      }

      try {
        await trasladarFavoritosInvitado(usuario.id, respuesta.token);
      } catch {
        if ((await obtenerToken()) === respuesta.token) await eliminarToken();
        await clienteQuery.invalidateQueries({
          queryKey: ["favoritos-locales"],
        });
        throw new Error(
          "No pudimos trasladar tus favoritos a la cuenta. Tus recetas se conservan; vuelve a iniciar sesión para reintentar.",
        );
      }
      if ((await obtenerToken()) !== respuesta.token) {
        throw new Error("La sesión cambió. Inténtalo nuevamente.");
      }

      clienteQuery.setQueryData<Perfil | null>(CLAVE_SESION, usuario);
      await Promise.all([
        clienteQuery.invalidateQueries({ queryKey: ["favoritos-locales"] }),
        clienteQuery.invalidateQueries({ queryKey: ["perfil-dispositivo"] }),
      ]);
      return respuesta;
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "";

      const accesoRechazado = err instanceof AuthError && err.status === 401;

      setCredencialesRechazadas(accesoRechazado);

      const esErrorDeConexion =
        /fetch failed|failed to fetch|network request failed|NoRouteToHostException/i.test(
          mensaje,
        );

      setError(
        accesoRechazado
          ? cuentaGuardada
            ? "Credenciales incorrectas. Verifica tu contraseña."
            : "Revisa tu correo y contraseña. Si aún no tienes una cuenta, selecciona «Crear cuenta»."
          : esErrorDeConexion
            ? "No pudimos conectar con el servidor. Inténtalo nuevamente."
            : mensaje || "No pudimos iniciar sesión.",
      );

      throw err;
    }
  }

  const consulta = useMutation({
    mutationFn: ejecutarLogin,
    retry: false,
    networkMode: "always",
    // Evitamos guardar las credenciales en caché.
    gcTime: 0,
  });

  async function submit(credenciales: LoginCredentials) {
    try {
      return await consulta.mutateAsync(credenciales);
    } finally {
      consulta.reset();
    }
  }

  function resetError() {
    setError(null);
    setCredencialesRechazadas(false);
  }

  return {
    submit,
    loading: consulta.isPending,
    error,
    resetError,
    credencialesRechazadas,
  };
}
