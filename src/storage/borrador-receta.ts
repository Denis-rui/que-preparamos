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

const PATRON_ID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function idAnterior(usuarioId: number): string {
  return "anterior-" + usuarioId;
}

function claveBorrador(usuarioId: number, id: string): string {
  const base = clave(usuarioId);

  if (id === idAnterior(usuarioId)) return base;
  if (!PATRON_ID.test(id)) throw new Error("El borrador no es válido.");

  return base + ":" + id;
}
const escrituras = new Map<string, Promise<void>>();
function escribirEnOrden<T>(
  llave: string,
  operacion: () => Promise<T>,
): Promise<T> {
  const resultado = (escrituras.get(llave) ?? Promise.resolve()).then(
    operacion,
  );
  const fin = resultado.then(
    () => undefined,
    () => undefined,
  );

  escrituras.set(llave, fin);
  void fin.then(() => {
    if (escrituras.get(llave) === fin) escrituras.delete(llave);
  });

  return resultado;
}
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
    valor.usuarioId === usuarioId &&
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

export const interpretarBorrador = (
  texto: string,
  usuarioId: number,
  id: string,
): BorradorReceta => {
  const valor: unknown = JSON.parse(texto);

  if (!esBorrador(valor, usuarioId)) {
    throw new Error("El borrador guardado no es válido.");
  }

  const uri = valor.edicion.datos.imagen?.uri;
  if (uri && !esFotoPropia(uri, usuarioId)) {
    throw new Error("La referencia de la foto no es válida.");
  }
  return { ...valor, id };
};

export const leerBorrador = async (
  usuarioId: number,
  id: string,
): Promise<BorradorReceta | null> => {
  const texto = await AsyncStorage.getItem(claveBorrador(usuarioId, id));
  return texto === null ? null : interpretarBorrador(texto, usuarioId, id);
};

export const listarBorradores = async (usuarioId: number) => {
  const base = clave(usuarioId);
  const prefijo = base + ":";
  const claves = (await AsyncStorage.getAllKeys()).filter(
    (llave) =>
      llave === base ||
      (llave.startsWith(prefijo) &&
        PATRON_ID.test(llave.slice(prefijo.length))),
  );

  const borradores: BorradorReceta[] = [];
  let omitidos = 0;

  if (claves.length === 0) return { borradores, omitidos };

  for (const [llave, texto] of await AsyncStorage.multiGet(claves)) {
    if (texto === null) continue;

    const id =
      llave === base ? idAnterior(usuarioId) : llave.slice(prefijo.length);

    try {
      borradores.push(interpretarBorrador(texto, usuarioId, id));
    } catch {
      omitidos += 1;
    }
  }

  borradores.sort((a, b) => b.guardadoEn.localeCompare(a.guardadoEn));
  return { borradores, omitidos };
};

export const guardarBorrador = async (
  usuarioId: number,
  edicion: EstadoEdicionReceta,
  borradorId?: string,
): Promise<BorradorReceta> => {
  const id = borradorId ?? randomUUID();
  const llave = claveBorrador(usuarioId, id);
  return escribirEnOrden(llave, async () => {
    const anterior = await leerBorrador(usuarioId, id);
    if (borradorId !== undefined && !anterior) {
      throw new Error("Este borrador ya no está disponible.");
    }
    const origen = edicion.datos.imagen;
    const fotoAnterior = anterior?.edicion.datos.imagen?.uri;
    let imagen: EstadoEdicionReceta["datos"]["imagen"] = null;
    let fotoNueva: string | undefined;
    try {
      if (origen) {
        const archivo = new File(origen.uri);
        if (!archivo.exists) {
          throw new Error("No encontramos la foto. Selecciónala nuevamente.");
        }
        const tipo = origen.mimeType?.toLowerCase();
        const extension =
          tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";

        let uri = origen.uri;
        if (uri !== fotoAnterior) {
          const carpeta = directorio(usuarioId);
          carpeta.create({ intermediates: true, idempotent: true });
          const destino = new File(carpeta, randomUUID() + "." + extension);

          fotoNueva = destino.uri;
          await archivo.copy(destino);
          uri = destino.uri;
        }
        imagen = {
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

      const valor: Omit<BorradorReceta, "id"> = {
        version: 1,
        usuarioId,
        guardadoEn: new Date().toISOString(),
        edicion: { ...edicion, datos: { ...edicion.datos, imagen } },
      };
      if (!esBorrador(valor, usuarioId)) {
        throw new Error(
          "No pudimos guardar este borrador. Revisa su contenido.",
        );
      }

      await AsyncStorage.setItem(llave, JSON.stringify(valor));

      if (fotoAnterior !== imagen?.uri) limpiarFoto(fotoAnterior, usuarioId);

      return { ...valor, id };
    } catch (error) {
      limpiarFoto(fotoNueva, usuarioId);
      throw error;
    }
  });
};

export const eliminarBorrador = async (
  usuarioId: number,
  id: string,
): Promise<void> => {
  const llave = claveBorrador(usuarioId, id);
  return escribirEnOrden(llave, async () => {
    const borrador = await leerBorrador(usuarioId, id);
    if (!borrador) return;
    await AsyncStorage.removeItem(llave);
    limpiarFoto(borrador.edicion.datos.imagen?.uri, usuarioId);
  });
};
