import { AuthError, iniciarSesion } from "@/api/auth";
import { useState } from "react";

// El token es secreto y se guarda en SecureStore.
import { guardarToken } from "@/storage/token";
// AsyncStorage recuerda solo nombre y correo, nunca contraseña ni token.
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      //el backend verifica las credenciales y devuelve el token

      const respuesta = await iniciarSesion({
        email: email.trim(),
        password,
      });

      // Comprobamos si recibimos un token antes de guardar
      if (typeof respuesta.token !== "string" || !respuesta.token.trim()) {
        throw new Error("No se recibio un token válido.");
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
