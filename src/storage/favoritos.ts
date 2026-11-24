import { quePreparamos } from "@/api/cliente";
import { obtenerPerfil } from "@/api/perfil";
import type { RecetaDetalle } from "@/types/receta";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  borrarImagenFavorito,
  descargarImagenFavorito,
} from "./imagenFavorito";
import { obtenerPerfilRecordado, obtenerToken } from "./token";

export interface ListaFavoritos {
  clave: string;
  token: string | null;
}
export interface FavoritoLocal {
  id: number;
  nombre: string;
  guardadoEn: string;
  receta: RecetaDetalle | null;
  aviso?: string;
}

export async function identificarListaFavoritos(): Promise<ListaFavoritos> {
  const token = await obtenerToken();
  if (!token)
    return {
      clave: "favoritos:v1:invitado",
      token: null,
    };
  const perfil = (await obtenerPerfilRecordado()) ?? (await obtenerPerfil());
  if ((await obtenerToken()) !== token) throw new Error("La sesión cambió.");
  return { clave: `favoritos:v1:cuenta:${perfil.id}`, token };
}

export async function comprobarLista(lista: ListaFavoritos) {
  if ((await obtenerToken()) !== lista.token)
    throw new Error("La sesión cambió. Vuelve a abrir Favoritos.");
}

export async function leerFavoritos(
  lista: ListaFavoritos,
): Promise<FavoritoLocal[]> {
  await comprobarLista(lista);
  return leerLista(lista.clave);
}

async function leerLista(clave: string): Promise<FavoritoLocal[]> {
  const json = await AsyncStorage.getItem(clave);
  if (!json) return [];
  const datos: unknown = JSON.parse(json);
  if (!Array.isArray(datos))
    throw new Error("No pudimos leer tus favoritos locales.");
  return datos;
}

// Guardamos de una en una para no perder cambios.
let pendiente: Promise<unknown> = Promise.resolve();
function escribir<T>(operacion: () => Promise<T>): Promise<T> {
  const siguiente = pendiente.then(operacion, operacion);
  pendiente = siguiente.catch(() => undefined);
  return siguiente;
}

// Conservamos las fotos que todavía usa otra lista.
async function borrarImagenSinReferencias(uri: string) {
  await borrarImagenesSinReferencias([uri]);
}

async function borrarImagenesSinReferencias(imagenes: Iterable<string>) {
  const pendientes = new Set(imagenes);
  if (!pendientes.size) return;
  const claves = (await AsyncStorage.getAllKeys()).filter((clave) =>
    clave.startsWith("favoritos:v1:"),
  );
  for (const clave of claves) {
    for (const item of await leerLista(clave)) {
      if (item.receta?.imagen_url) pendientes.delete(item.receta.imagen_url);
    }
  }
  for (const uri of pendientes) {
    await borrarImagenFavorito(uri).catch(() => undefined);
  }
}

export function trasladarFavoritosInvitado(usuarioId: number, token: string) {
  return escribir(async () => {
    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0 || !token) {
      throw new Error("No se pudo identificar la cuenta de destino.");
    }
    const lista = { clave: `favoritos:v1:cuenta:${usuarioId}`, token };
    await comprobarLista(lista);
    const invitados = await leerLista("favoritos:v1:invitado");
    if (!invitados.length) return;
    const actuales = await leerFavoritos(lista);
    const fusionados = new Map(actuales.map((item) => [item.id, item]));
    for (const item of invitados) {
      const existente = fusionados.get(item.id);
      // Si la receta fue eliminada, conservamos el aviso.
      if (!existente || (!item.receta && existente.receta)) {
        fusionados.set(item.id, item);
      }
    }
    await comprobarLista(lista);
    await AsyncStorage.setItem(
      lista.clave,
      JSON.stringify([...fusionados.values()]),
    );
    await comprobarLista(lista);
    // Vaciamos el invitado después de guardar en la cuenta.
    await AsyncStorage.removeItem("favoritos:v1:invitado");
    const imagenes = new Set(
      [...invitados, ...actuales]
        .map((item) => item.receta?.imagen_url)
        .filter((uri): uri is string => !!uri),
    );
    const conservadas = new Set(
      [...fusionados.values()].map((item) => item.receta?.imagen_url),
    );
    for (const uri of imagenes) {
      if (!conservadas.has(uri))
        await borrarImagenSinReferencias(uri).catch(() => undefined);
    }
  });
}

export function guardarFavorito(lista: ListaFavoritos, receta: RecetaDetalle) {
  return escribir(async () => {
    await comprobarLista(lista);
    const favoritos = await leerFavoritos(lista);
    if (favoritos.some((item) => item.id === receta.id)) return;
    let imagen: string | null = null;
    try {
      // Descargamos la foto antes de confirmar el guardado.
      imagen = receta.imagen_url
        ? await descargarImagenFavorito(receta.imagen_url)
        : null;
      await comprobarLista(lista);
      favoritos.unshift({
        id: receta.id,
        nombre: receta.nombre,
        guardadoEn: new Date().toISOString(),
        receta: { ...receta, imagen_url: imagen },
      });
      await AsyncStorage.setItem(lista.clave, JSON.stringify(favoritos));
    } catch (error) {
      if (imagen) await borrarImagenFavorito(imagen).catch(() => undefined);
      throw error;
    }
  });
}

export function quitarFavorito(lista: ListaFavoritos, id: number) {
  return quitarFavoritos(lista, [id]);
}

export function quitarFavoritos(lista: ListaFavoritos, ids: readonly number[]) {
  return eliminarFavoritos(lista, ids);
}

export function vaciarFavoritos(lista: ListaFavoritos) {
  return eliminarFavoritos(lista, null);
}

function eliminarFavoritos(
  lista: ListaFavoritos,
  ids: readonly number[] | null,
) {
  return escribir(async () => {
    const favoritos = await leerFavoritos(lista);
    const seleccion = ids === null ? null : new Set(ids);
    const eliminados = favoritos.filter(
      (item) => seleccion === null || seleccion.has(item.id),
    );
    const restantes = favoritos.filter(
      (item) => seleccion !== null && !seleccion.has(item.id),
    );
    if (!eliminados.length) return restantes;
    await comprobarLista(lista);
    // Quitamos toda la selección en un solo guardado.
    await AsyncStorage.setItem(lista.clave, JSON.stringify(restantes));
    const imagenes = eliminados
      .map((item) => item.receta?.imagen_url)
      .filter((uri): uri is string => !!uri);
    await borrarImagenesSinReferencias(imagenes).catch(() => undefined);
    return restantes;
  });
}

// Solo retiramos recetas cuya eliminación esté confirmada.
export async function verificarFavoritos(lista: ListaFavoritos) {
  const favoritos = await leerFavoritos(lista);
  for (let inicio = 0; inicio < favoritos.length; inicio += 50) {
    const ids = favoritos
      .slice(inicio, inicio + 50)
      .filter((item) => item.receta)
      .map((item) => item.id);
    if (!ids.length) continue;
    const respuesta = await quePreparamos.post<{
      data: { id: number; estado: string }[];
    }>("/recetas/verificar-disponibilidad", { ids });
    if (!Array.isArray(respuesta.data?.data)) continue;
    await escribir(async () => {
      const actuales = await leerFavoritos(lista);
      for (const resultado of respuesta.data.data) {
        if (
          !["eliminada_autor", "eliminada_administracion"].includes(
            resultado.estado,
          )
        )
          continue;
        const item = actuales.find((favorito) => favorito.id === resultado.id);
        if (!item) continue;
        const imagen = item.receta?.imagen_url;
        item.receta = null;
        item.aviso =
          resultado.estado === "eliminada_autor"
            ? "Esta receta fue eliminada por su autor."
            : "Esta receta fue eliminada.";
        // Guardamos el aviso antes de borrar la foto.
        await comprobarLista(lista);
        await AsyncStorage.setItem(lista.clave, JSON.stringify(actuales));
        if (imagen)
          await borrarImagenSinReferencias(imagen).catch(() => undefined);
      }
    });
  }
}
