// Conservamos el código HTTP para distinguir credenciales rechazadas de otros fallos.
export class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export async function registrarUsuario(datosUsuario) {
  const URL = `${process.env.EXPO_PUBLIC_URL_API}/auth/registro`;

  const respuesta = await fetch(URL, {
    method: "POST",
    headers: {
      // le decimos al servidor que le estamos enviando un JSON
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datosUsuario), // enviamos los datos del usuario en el cuerpo de la solicitud
  });

  // convertimos la respuesta a JSON
  const json = await respuesta.json();

  // si la respuesta no es correcta, lanzamos un error
  if (!respuesta.ok) {
    // Nuestra API usa "mensaje" y las validaciones de Laravel pueden usar "message".
    // Si ninguno trae un mensaje, mostramos el texto de respaldo.
    throw new Error(
      json.mensaje || json.message || "Error al registrar el usuario",
    );
  }
  return json;
}

export async function iniciarSesion(datosUsuario) {
  const URL = `${process.env.EXPO_PUBLIC_URL_API}/auth/login`;

  const respuesta = await fetch(URL, {
    method: "POST",
    headers: {
      // le decimos al servidor que le estamos enviando un JSON
      "Content-Type": "application/json",
      // le decimos al servidor que esperamos recibir un JSON en la respuesta
      Accept: "application/json",
    },
    body: JSON.stringify(datosUsuario), // enviamos los datos del usuario
  });
  // convertimos la respuesta a JSON y devolvemos los datos
  const json = await respuesta.json();
  // si la respuesta no es correcta, lanzamos un error
  if (!respuesta.ok) {
    // Aceptamos tanto "mensaje" de nuestra API como "message" de Laravel.
    // useLogin recibe este error y lo muestra en el formulario.
    throw new AuthError(
      json.mensaje || json.message || "Error al iniciar sesión",
      respuesta.status,
    );
  }

  return json;
}
