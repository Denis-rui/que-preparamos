import { useState } from "react";

import { AuthError, iniciarSesion } from "@/api/auth";

export type LoginCredentials = {
  email: string;
  password: string;
};

export function useLogin(cuentaGuardada = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credencialesRechazadas, setCredencialesRechazadas] = useState(false);

  async function submit({ email, password }: LoginCredentials) {
    setLoading(true);
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

      const respuesta = await iniciarSesion({
        email: email.trim(),
        password,
      });

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
    } finally {
      setLoading(false);
    }
  }

  function resetError() {
    setError(null);
    setCredencialesRechazadas(false);
  }

  return {
    submit,
    loading,
    error,
    resetError,
    credencialesRechazadas,
  };
}
