import type { FotoPerfil } from "@/types/perfil";

const TAMANO_MAXIMO = 10 * 1024 * 1024;
const TIPOS_POR_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
const TIPOS_ADMITIDOS = new Set(Object.values(TIPOS_POR_EXTENSION));

// La selección puede carecer de metadatos; antes de subir exigimos un MIME válido.
export function validarFotoPerfil(
  foto: FotoPerfil,
  exigirTipo = false,
): string | undefined {
  const tamano = foto.file?.size ?? foto.fileSize;
  if (tamano !== undefined && tamano > TAMANO_MAXIMO) {
    throw new Error("La foto debe pesar como máximo 2 MiB.");
  }

  const extension = (foto.fileName ?? foto.uri.split("?")[0])
    .split(".")
    .pop()
    ?.toLowerCase();
  const declarado = (foto.mimeType || foto.file?.type || "").toLowerCase();
  const tipo =
    declarado === "image/jpg"
      ? "image/jpeg"
      : declarado || TIPOS_POR_EXTENSION[extension ?? ""];

  if ((tipo && !TIPOS_ADMITIDOS.has(tipo)) || (!tipo && exigirTipo)) {
    throw new Error("Selecciona una foto JPG, PNG o WEBP.");
  }
  return tipo;
}
