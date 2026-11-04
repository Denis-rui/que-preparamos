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
  const json = await AsyncStorage.getItem(lista.clave);
  if (!json) return [];
  const datos: unknown = JSON.parse(json);
  if (!Array.isArray(datos))
    throw new Error("No pudimos leer tus favoritos locales.");
  return datos;
}

// Serializamos las escrituras para que dos recetas guardadas juntas no se sobrescriban.
let pendiente: Promise<unknown> = Promise.resolve();
function escribir<T>(operacion: () => Promise<T>): Promise<T> {
  const siguiente = pendiente.then(operacion, operacion);
  pendiente = siguiente.catch(() => undefined);
  return siguiente;
}

export function guardarFavorito(lista: ListaFavoritos, receta: RecetaDetalle) {
  return escribir(async () => {
    await comprobarLista(lista);
    const favoritos = await leerFavoritos(lista);
    if (favoritos.some((item) => item.id === receta.id)) return;
    let imagen: string | null = null;
    try {
      // Solo confirmamos el guardado cuando también se descargó la foto existente.
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
  return escribir(async () => {
    const favoritos = await leerFavoritos(lista);
    const anterior = favoritos.find((item) => item.id === id);
    await comprobarLista(lista);
    await AsyncStorage.setItem(
      lista.clave,
      JSON.stringify(favoritos.filter((item) => item.id !== id)),
    );
    if (anterior?.receta?.imagen_url) {
      await borrarImagenFavorito(anterior.receta.imagen_url).catch(
        () => undefined,
      );
    }
  });
}

// Un fallo de red o un 404 no demuestra eliminación. Solo usamos estados explícitos.
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
        // Persistimos la retirada antes de borrar la imagen.
        await comprobarLista(lista);
        await AsyncStorage.setItem(lista.clave, JSON.stringify(actuales));
        if (imagen) await borrarImagenFavorito(imagen).catch(() => undefined);
      }
    });
  }
}
