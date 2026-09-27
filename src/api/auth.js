export async function registrarUsuario() {
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
    throw new Error(json.message || "Error al registrar el usuario");
  }
  return json;
}

export async function loginUsuario() {
  const URL = `${process.env.EXPO_PUBLIC_URL_API}/auth/login`;

  const respuesta = await fetch(URL, {
    headers: {
      // le decimos al servidor que le estamos enviando un JSON
      "Content-Type": "application/json",
    },
  });

  // si la respuesta no es correcta, lanzamos un error
  if (!respuesta.ok) {
    throw new Error("Error al obtener las categorías");
  }
  // convertimos la respuesta a JSON y devolvemos los datos
  const json = await respuesta.json();
  return json.data;
}
