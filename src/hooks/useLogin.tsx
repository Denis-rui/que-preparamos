import { AuthError, iniciarSesion } from "@/api/auth";
import type { DatosLogin } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// El token es secreto y se guarda en SecureStore.
import { guardarToken, obtenerToken } from "@/storage/token";
// AsyncStorage recuerda solo nombre y correo, nunca contraseña ni token.
import { CLAVE_SESION } from "@/config/cliente-query";
import { Perfil } from "@/types/perfil";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      //el backend verifica las credenciales y devuelve el token

      const respuesta = await iniciarSesion({
        email: email.trim(),
        password,
      });

      // Comprobamos si recibimos un token antes de guardar
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

      // Recordamos la cuenta para pedir su contraseña si la sesión vence.
      await AsyncStorage.setItem(
        "ultimaCuentaSesion",
        JSON.stringify({
          name: respuesta.usuario.name,
          email: respuesta.usuario.email,
        }),
      );

      // Guardamos el token de forma segura
      await guardarToken(respuesta.token);
      if ((await obtenerToken()) !== respuesta.token) {
        throw new Error("La sesión cambió. Inténtalo nuevamente.");
      }

      clienteQuery.setQueryData<Perfil | null>(CLAVE_SESION, usuario);
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
    // No conservamos las credenciales ni la respuesta de acceso en la caché.
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
