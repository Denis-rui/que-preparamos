export async function getRecetasAleatorias() {
  const URL = `${process.env.EXPO_PUBLIC_URL_API}/recetas/aleatorias`;

  const respuesta = await fetch(URL, {
    headers: {
      // le decimos al servidor que le estamos enviando un JSON
      "Content-Type": "application/json",
    },
  });

  // si la respuesta no es correcta, lanzamos un error
  if (!respuesta.ok) {
    throw new Error("Error al obtener las recetas aleatorias");
  }
  // convertimos la respuesta a JSON y devolvemos los datos
  const json = await respuesta.json();
  return json.data;
}
