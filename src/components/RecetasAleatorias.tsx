import { useRecetasResumen } from "@/hooks/useRecetasResumen";

import { TarjetaReceta } from "@/components/recetas/TarjetaReceta";
import { router } from "expo-router";
import { ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface Props {
  ComponenteCabecera?: ReactElement;
  avisoSinConexionVisible?: boolean;
}
export const RecetasAleatorias = ({ ComponenteCabecera, avisoSinConexionVisible = false }: Props) => {
  const {
    recetas,
    loading,
    enEspera,
    vacio,
    error,
    errorActualizacion,
    actualizando,
    actualizar,
  } = useRecetasResumen();

  const actualizarRecetas = () => {
    actualizar();
  };

  return (
    <View style={styles.contenedorSeccion}>
      {/* Encabezado de las recomendaciones. */}

      {/* Mostramos las recetas en dos columnas. */}
      <FlatList
        data={recetas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.filaCuadricula}
        showsVerticalScrollIndicator={false}
        refreshing={actualizando}
        onRefresh={actualizarRecetas}
        ListHeaderComponent={
          <>
            {ComponenteCabecera}
            <View style={styles.cabeceraSeccion}>
              <Text style={styles.tituloSeccion}>Recomendados para ti</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/explorar");
                }}
              >
                {/* Desde aquí se puede ir a explorar todas las recetas. */}
                <Text style={styles.verTodo}>Ver todo</Text>
              </TouchableOpacity>
            </View>

            {!avisoSinConexionVisible && enEspera && recetas.length > 0 && (
              <View style={styles.centro}>
                <Text>Esperando conexion</Text>
              </View>
            )}
            {!avisoSinConexionVisible && errorActualizacion && (
              <View style={styles.centro}>
                <Text
                  style={styles.textoError}
                  accessibilityLiveRegion="polite"
                >
                  {errorActualizacion}
                </Text>

                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={actualizando}
                  onPress={actualizarRecetas}
                >
                  <Text style={styles.verTodo}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.centro}>
            {loading && (
              <>
                <ActivityIndicator size="large" color="#FF5722" />
                <Text>Cargando recomendaciones</Text>
              </>
            )}
            {!avisoSinConexionVisible && !loading && enEspera && <Text>Esperando conexión</Text>}
            {!avisoSinConexionVisible && !loading && !enEspera && error && (
              <>
                <Text
                  style={styles.textoError}
                  accessibilityLiveRegion="polite"
                >
                  {error}
                </Text>

                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={actualizarRecetas}
                >
                  <Text style={styles.verTodo}>Reintentar recetas</Text>
                </TouchableOpacity>
              </>
            )}
            {!loading && !enEspera && !error && vacio && (
              <Text>No hay recetas disponibles por ahora.</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TarjetaReceta receta={item} variante="cuadricula" />
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  centro: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contenedorSeccion: {
    flex: 1,
    marginTop: 20,
  },
  cabeceraSeccion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  tituloSeccion: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A2B12", // Color marrón del Figma
  },
  verTodo: {
    color: "#4CAF50", // Color verde
    fontWeight: "bold",
  },
  // Dejamos espacio entre las dos columnas.
  filaCuadricula: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  textoError: {
    color: "red",
  },
});
