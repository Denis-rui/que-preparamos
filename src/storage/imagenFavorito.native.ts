import { randomUUID } from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";

function carpeta() {
  const directorio = new Directory(Paths.document, "favoritos");
  directorio.create({ idempotent: true, intermediates: true });
  return directorio;
}

export async function descargarImagenFavorito(url: string): Promise<string> {
  const destino = new File(carpeta(), `${randomUUID()}.img`);
  try {
    await File.downloadFileAsync(url, destino);
    return destino.uri;
  } catch (error) {
    if (destino.exists) destino.delete();
    throw error;
  }
}

export async function borrarImagenFavorito(uri: string) {
  const prefijo = carpeta().uri.replace(/\/$/, "") + "/";
  if (!uri.startsWith(prefijo)) return;
  const archivo = new File(uri);
  if (archivo.exists) archivo.delete();
}
