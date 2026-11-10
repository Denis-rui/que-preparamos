import useMisRecetas from "@/hooks/useMisRecetas";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { FotoReceta } from "../recetas/FotoReceta";
import EstadoListado from "./EstadoListado";
type DatosMisRecetas = ReturnType<typeof useMisRecetas>;
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
      renderItem={({ item }) => (
        <View style={s.tarjeta}>
          <FotoReceta
            uri={cabecerasImagen ? item.imagen_url : null}
            cabeceras={cabecerasImagen ?? undefined}
            style={s.imagen}
          />
          <Text style={s.nombre}>{item.nombre}</Text>

          <Text style={s.texto}>
            {item.visibilidad === "privada" ? "Privada" : "Publicada"}
          </Text>

          {item.solicitud_pendiente && (
            <Text style={s.revision}>
              {item.solicitud_pendiente.tipo === "publicacion"
                ? "Publicación en revisión"
                : "Corrección en revisión"}
            </Text>
          )}
        </View>
      )}
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
const s = StyleSheet.create({
  contenedor: { flex: 1, gap: 12 },
  imagen: {
    width: "100%",
    aspectRatio: 2.8,
    borderRadius: 14,
    marginBottom: 8,
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

  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D1C7",
    borderRadius: 16,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },

  nombre: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#552414",
  },
  texto: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#6D625B",
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
