export async function getCategorias() {
  const API_CATEGORIAS = "https://quepreparamos.duckdns.org/api/v1/categorias";

  const respuesta = await fetch(API_CATEGORIAS, {
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
