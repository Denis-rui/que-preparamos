import { useRecetasResumen } from "@/hooks/useRecetasResumen";
import { TarjetaReceta } from "@/components/recetas/TarjetaReceta";
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
}
export const RecetasAleatorias = ({ ComponenteCabecera }: Props) => {
  const { recetas, loading, error } = useRecetasResumen();

  return (
    <View style={styles.contenedorSeccion}>
      {/* cabecera de la sección de recomendaciones */}

      {/* lista de recetas en formato de cuadrícula */}
      <FlatList
        data={recetas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.filaCuadricula}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {ComponenteCabecera}
            <View style={styles.cabeceraSeccion}>
              <Text style={styles.tituloSeccion}>Recomendados para ti</Text>
              <TouchableOpacity>
                {/* aqui falta la funcionalidad del ver todo que me lleve a la pantalla de todas las recetas */}
                <Text style={styles.verTodo}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            {loading && (
              <View style={styles.centro}>
                <ActivityIndicator size="large" color="#FF5722" />
                <Text>Cargando recomendaciones...</Text>
              </View>
            )}
            {/* 4. Si hay error en recetas, lo mostramos aquí */}
            {error && (
              <View style={styles.centro}>
                <Text style={styles.textoError}>{error}</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => <TarjetaReceta receta={item} variante="cuadricula" />}
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
  // Estilo crucial para que haya espacio entre las dos columnas
  filaCuadricula: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  textoError: {
    color: "red",
  },
});
