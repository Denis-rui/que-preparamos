import { BorradorReceta, EstadoEdicionReceta } from "@/types/borradorReceta";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";
const clave = (usuarioId: number): string => {
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    throw new Error("cuenta del borrador no valida");
  }
  return `receta:borrador:v1:${usuarioId}`;
};

const directorio = (usuarioId: number): Directory => {
  return new Directory(Paths.document, "borradores-receta", String(usuarioId));
};

const esObjeto = (valor: unknown): valor is Record<string, unknown> => {
  return typeof valor === "object" && valor !== null;
};
function esId(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}
const esIdOpcional = (valor: unknown): boolean => {
  return valor === null || esId(valor);
};

const esIngrediente = (valor: unknown): boolean => {
  return esObjeto(valor) && esId(valor.id) && typeof valor.nombre === "string";
};

const esFoto = (valor: unknown): boolean => {
  return (
    valor === null ||
    (esObjeto(valor) &&
      typeof valor.uri === "string" &&
      typeof valor.width === "number" &&
      typeof valor.height === "number" &&
      (valor.mimeType == null || typeof valor.mimeType === "string") &&
      (valor.fileName == null || typeof valor.fileName === "string") &&
      (valor.fileSize === undefined || typeof valor.fileSize === "number") &&
      valor.file === undefined)
  );
};

const esEdicion = (valor: unknown): valor is EstadoEdicionReceta => {
  if (!esObjeto(valor)) return false;

  const datos = valor.datos;
  const ingrediente = valor.ingrediente;
  const publicacion = valor.publicacion;

  if (!esObjeto(datos) || !esObjeto(ingrediente)) return false;
  const textos = [
    "nombre",
    "descripcion",
    "porciones",
    "tiempoPreparacion",
    "tips",
  ];

  if (
    !textos.every((campo) => typeof datos[campo] === "string") ||
    !esIdOpcional(datos.categoriaId) ||
    !esIdOpcional(datos.subcategoriaId) ||
    !esFoto(datos.imagen)
  ) {
    return false;
  }

  if (
    !Array.isArray(datos.ingredientes) ||
    datos.ingredientes.length > 500 ||
    !datos.ingredientes.every(
      (item: unknown) =>
        esObjeto(item) &&
        esIngrediente(item) &&
        typeof item.cantidad === "string" &&
        typeof item.unidad === "string" &&
        typeof item.notas === "string",
    )
  ) {
    return false;
  }
  if (
    !Array.isArray(datos.pasos) ||
    datos.pasos.length < 1 ||
    datos.pasos.length > 500 ||
    !datos.pasos.every(
      (paso: unknown) =>
        esObjeto(paso) && esId(paso.id) && typeof paso.instruccion === "string",
    )
  ) {
    return false;
  }

  if (
    typeof ingrediente.busqueda !== "string" ||
    typeof ingrediente.cantidad !== "string" ||
    typeof ingrediente.unidad !== "string" ||
    typeof ingrediente.notas !== "string" ||
    (ingrediente.seleccionado !== null &&
      !esIngrediente(ingrediente.seleccionado))
  ) {
    return false;
  }
  return (
    publicacion === null ||
    (esObjeto(publicacion) &&
      esId(publicacion.idReceta) &&
      typeof publicacion.clave === "string" &&
      /^[0-9a-f-]{36}$/i.test(publicacion.clave))
  );
};

const esBorrador = (
  valor: unknown,
  usuarioId: number,
): valor is BorradorReceta => {
  return (
    esObjeto(valor) &&
    valor.version === 1 &&
    valor.usurioId === usuarioId &&
    typeof valor.guardadoEn === "string" &&
    esEdicion(valor.edicion)
  );
};

const esFotoPropia = (uri: string, usuarioId: number): boolean => {
  const prefijo = directorio(usuarioId).uri.replace(/\/$/, "") + "/";
  if (!uri.startsWith(prefijo)) return false;

  const nombre = uri.slice(prefijo.length);
  return /^[0-9a-f-]{36}\.(jpg|png|webp|jpeg)$/i.test(nombre);
};

const limpiarFoto = (uri: string | undefined, usuarioId: number): void => {
  if (!uri || !esFotoPropia(uri, usuarioId)) return;

  try {
    const archivo = new File(uri);
    if (archivo.exists) archivo.delete();
  } catch {}
};

export const leerBorrador = async (
  usuarioId: number,
): Promise<BorradorReceta | null> => {
  const texto = await AsyncStorage.getItem(clave(usuarioId));

  if (texto === null) return null;

  const valor: unknown = JSON.parse(texto);

  if (!esBorrador(valor, usuarioId))
    throw new Error("El borrador guardado no es válido.");

  const uri = valor.edicion.datos.imagen?.uri;
  if (uri && !esFotoPropia(uri, usuarioId))
    throw new Error("La referencia de la foto no es valida");

  return valor;
};

export const guardarBorrador = async (
  usuarioId: number,
  edicion: EstadoEdicionReceta,
): Promise<BorradorReceta> => {
  const anteriorBorrador = await leerBorrador(usuarioId);
  const copia: EstadoEdicionReceta = JSON.parse(JSON.stringify(edicion));

  const origen = edicion.datos.imagen;
  let fotoNueva: string | undefined;
  try {
    if (origen) {
      const tipo = origen.mimeType?.toLowerCase();
      const extension =
        tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";

      let uri = origen.uri;

      if (!esFotoPropia(uri, usuarioId)) {
        const carpeta = directorio(usuarioId);
        carpeta.create({
          intermediates: true,
          idempotent: true,
        });

        const archivoOrigin = new File(origen.uri);

        if (!archivoOrigin.exists)
          throw new Error("No se encontro la foto, seleccionala nuevamente");

        const destino = new File(carpeta, `${randomUUID()}.${extension}`);

        fotoNueva = destino.uri;
        await archivoOrigin.copy(destino);
        uri = destino.uri;
      }
      copia.datos.imagen = {
        uri,
        width: origen.width,
        height: origen.height,
        mimeType:
          origen.mimeType ??
          (extension === "png"
            ? "image/png"
            : extension === "webp"
              ? "image/webp"
              : "image/jpeg"),
        fileName: origen.fileName ?? `receta.${extension}`,
        fileSize: origen.fileSize,
        type: "image",
      };
    }

    const borrador: BorradorReceta = {
      version: 1,
      usuarioId,
      guardadoEn: new Date().toISOString(),
      edicion: copia,
    };

    await AsyncStorage.setItem(clave(usuarioId), JSON.stringify(borrador));

    const fotoAnterior = anteriorBorrador?.edicion.datos.imagen?.uri;

    if (fotoAnterior !== copia.datos.imagen?.uri)
      limpiarFoto(fotoAnterior, usuarioId);

    return borrador;
  } catch (error) {
    limpiarFoto(fotoNueva, usuarioId);
    throw error;
  }
};

export const eliminarBorrador = async (usuarioId: number): Promise<void> => {
  let anteriorBorrador: BorradorReceta | null = null;
  try {
    anteriorBorrador = await leerBorrador(usuarioId);
  } catch (error) {}

  await AsyncStorage.removeItem(clave(usuarioId));
  limpiarFoto(anteriorBorrador?.edicion.datos.imagen?.uri, usuarioId);
};
