// En web guardamos una imagen embebida; no dependemos de una URL remota.
export async function descargarImagenFavorito(url: string): Promise<string> {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("No se pudo descargar la imagen.");

  const imagDescargada = await respuesta.blob();
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result));
    lector.onerror = () => reject(new Error("No se pudo guardar la imagen."));
    lector.readAsDataURL(imagDescargada);
  });
}

export async function borrarImagenFavorito(_uri: string) {}
