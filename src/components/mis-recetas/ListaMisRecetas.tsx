import { TemaFormulario } from "@/constants/theme";
import useMisRecetas from "@/hooks/useMisRecetas";
import { MisRecetas } from "@/types/mis-recetas";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FotoReceta } from "../recetas/FotoReceta";
import EstadoListado from "./EstadoListado";
type DatosMisRecetas = ReturnType<typeof useMisRecetas>;

export type AccionMisRecetas =
  | "editar"
  | "publicar"
  | "corregir"
  | "ver-solicitud"
  | "opciones";
interface Props {
  cabecerasImagen: Record<string, string> | null;
  recetas: DatosMisRecetas["recetas"];
  consulta: DatosMisRecetas["consultaGuardada"];
  filtro: "privadas" | "publicadas";
  busqueda: string;
  sinConexion: boolean;
  actualizar: () => void;
  cargarMas: () => void;
  cargarAutomaticamente: () => void;

  enAccion?: (accion: AccionMisRecetas, receta: MisRecetas) => void;
  textoPublicar?: string;
}

const ListaMisRecetas = ({
  cabecerasImagen,
  recetas,
  consulta,
  filtro,
  busqueda,
  sinConexion,
  actualizar,
  cargarMas,
  cargarAutomaticamente,
  enAccion,
  textoPublicar = "Publicar",
}: Props) => {
  return (
    <FlatList
      key={`${filtro}:${busqueda}`}
      data={recetas}
      keyExtractor={(receta) => String(receta.id)}
      contentContainerStyle={s.lista}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onEndReached={cargarAutomaticamente}
      onEndReachedThreshold={0.4}
      onRefresh={sinConexion ? undefined : actualizar}
      refreshing={consulta.isRefetching && !consulta.isPaused}
      ListHeaderComponent={
        <View>
          {(sinConexion || consulta.isPaused) && (
            <Text style={s.aviso}>Sin conexión</Text>
          )}

          {consulta.isError && !consulta.isFetchNextPageError && (
            <EstadoListado
              mensaje="No pudimos actualizar las recetas."
              reintentar={
                !sinConexion && !consulta.isPaused && !consulta.isFetching
                  ? actualizar
                  : undefined
              }
            />
          )}
        </View>
      }
      ListEmptyComponent={
        <EstadoListado
          mensaje={
            busqueda
              ? "No encontramos recetas con ese nombre."
              : filtro === "privadas"
                ? "Aún no tienes recetas privadas."
                : "Aún no tienes recetas publicadas."
          }
        />
      }
      renderItem={({ item }) => {
        const privada = item.visibilidad === "privada";
        const solicitud = item.solicitud_pendiente;
        const acciones: {
          tipo: AccionMisRecetas;
          etiqueta: string;
          principal?: boolean;
        }[] = solicitud
          ? [
              {
                tipo: "ver-solicitud",
                etiqueta: "Ver solicitud",
              },
            ]
          : privada
            ? [
                {
                  tipo: "editar",
                  etiqueta: "Editar",
                },
                {
                  tipo: "publicar",
                  etiqueta: textoPublicar,
                  principal: true,
                },
              ]
            : [
                {
                  tipo: "corregir",
                  etiqueta: "Proponer corrección",
                },
              ];
        return (
          <View style={s.tarjeta}>
            <View style={s.filaReceta}>
              <FotoReceta
                uri={cabecerasImagen ? item.imagen_url : null}
                cabeceras={cabecerasImagen ?? undefined}
                style={s.imagen}
              />
              <View style={s.informacion}>
                <View style={s.encabezadoReceta}>
                  <Text style={s.nombre}>{item.nombre}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Mas opciones de ${item.nombre}`}
                    accessibilityState={{ disabled: !enAccion }}
                    disabled={!enAccion}
                    onPress={() => enAccion?.("opciones", item)}
                    style={({ pressed }) => [
                      s.botonOpciones,
                      pressed && s.presionado,
                    ]}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color={colores.texto}
                    />
                  </Pressable>
                </View>
                {/* Estado de la receta */}
                <View style={s.estados}>
                  <View
                    style={[
                      s.etiqueta,
                      privada ? s.etiquetaPrivada : s.etiquetaPublicada,
                    ]}
                  >
                    <Ionicons
                      name={privada ? "lock-closed" : "checkmark-circle"}
                      size={15}
                      color={privada ? colores.texto : verdeEstado}
                    />
                    <Text
                      style={[s.textoEtiqueta, !privada && s.textoPublicada]}
                    >
                      {privada ? "Privada" : "Publicada"}
                    </Text>
                  </View>

                  {/* Estado de revisión */}
                  {solicitud && (
                    <View style={[s.etiqueta, s.etiquetaRevision]}>
                      <Text style={s.textoRevision}>
                        {solicitud.tipo === "publicacion"
                          ? "En revision"
                          : "Correccion en revision"}
                      </Text>
                    </View>
                  )}
                </View>
                {!privada && solicitud && (
                  <View style={s.avisoRevision}>
                    <Ionicons
                      name="information-circle-outline"
                      size={17}
                      color={colores.secundario}
                    />

                    <Text style={s.textoAvisoRevision}>
                      La versión aprobada sigue visible
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* botones de acciones*/}
            <View style={s.acciones}>
              {acciones.map((accion) => (
                <Pressable
                  key={accion.tipo}
                  accessibilityRole="button"
                  accessibilityLabel={`${accion.etiqueta}: ${item.nombre}`}
                  accessibilityState={{ disabled: !enAccion }}
                  disabled={!enAccion}
                  onPress={() => enAccion?.(accion.tipo, item)}
                  style={({ pressed }) => [
                    s.botonAccion,
                    accion.principal && s.botonAccionPrincipal,
                    pressed && s.presionado,
                    !enAccion && s.deshabilitado,
                  ]}
                >
                  <Text
                    style={[
                      s.textoAccion,
                      accion.principal && s.textoAccionPrincipal,
                    ]}
                  >
                    {accion.etiqueta}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      }}
      ListFooterComponent={
        <View style={s.pie}>
          {consulta.isFetchingNextPage && !consulta.isPaused && (
            <EstadoListado mensaje="Cargando más recetas…" cargando />
          )}

          {consulta.isFetchNextPageError && (
            <EstadoListado
              mensaje="No pudimos cargar más recetas."
              reintentar={
                !sinConexion && !consulta.isPaused && !consulta.isFetching
                  ? cargarMas
                  : undefined
              }
            />
          )}
        </View>
      }
    />
  );
};

export default ListaMisRecetas;
const colores = TemaFormulario.colores;
const verdeEstado = "#226423";
const s = StyleSheet.create({
  contenedor: { flex: 1, gap: 12 },
  tarjeta: {
    backgroundColor: colores.campo,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 20,
    padding: 12,
    gap: 12,
    marginBottom: 14,
    boxShadow: "0 3px 8px rgba(85, 36, 20, 0.08)",
  },

  filaReceta: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  imagen: {
    width: "32%",
    maxWidth: 110,
    aspectRatio: 1,
    flexShrink: 0,
    borderRadius: 13,
  },

  informacion: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },

  encabezadoReceta: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },

  nombre: {
    flex: 1,
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: 18,
    lineHeight: 24,
    color: colores.texto,
  },

  botonOpciones: {
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  estados: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  etiqueta: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 16,
  },

  etiquetaPrivada: {
    backgroundColor: "#EEE3D7",
  },

  etiquetaPublicada: {
    backgroundColor: "#DDF3D0",
  },

  etiquetaRevision: {
    backgroundColor: "#FFE8A3",
  },

  textoEtiqueta: {
    flexShrink: 1,
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: 13,
    lineHeight: 18,
    color: colores.texto,
  },

  textoPublicada: {
    color: verdeEstado,
  },

  textoRevision: {
    flexShrink: 1,
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: 13,
    lineHeight: 18,
    color: "#804000",
  },

  texto: {
    fontFamily: TemaFormulario.fuente,
    fontSize: 13,
    lineHeight: 19,
    color: colores.secundario,
  },

  avisoRevision: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },

  textoAvisoRevision: {
    flex: 1,
    fontFamily: TemaFormulario.fuente,
    fontSize: 13,
    lineHeight: 19,
    color: colores.secundario,
  },

  acciones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  botonAccion: {
    flexGrow: 1,
    flexBasis: 120,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colores.acento,
    borderRadius: 12,
  },

  botonAccionPrincipal: {
    backgroundColor: colores.acento,
  },

  textoAccion: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center",
    color: colores.acento,
  },

  textoAccionPrincipal: {
    color: colores.campo,
  },

  presionado: {
    opacity: 0.75,
  },

  deshabilitado: {
    opacity: 0.55,
  },
  pestanas: { flexDirection: "row" },
  pestana: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  pestanaActiva: {
    borderBottomColor: "#FF5008",
  },

  buscador: {
    backgroundColor: "#FFFFFF",
    color: "#552414",
    borderWidth: 1,
    borderColor: "#D9D1C7",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },

  botonLimpiar: {
    alignSelf: "flex-start",
    paddingVertical: 10,
  },

  lista: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  estado: {
    paddingVertical: 20,
    gap: 12,
  },
  pie: {
    paddingVertical: 12,
  },

  revision: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#A54400",
  },
  aviso: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#6D625B",
    marginBottom: 12,
  },
});
