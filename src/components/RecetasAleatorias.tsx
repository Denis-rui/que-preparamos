import { RecetaAleatoria, useRecetasResumen } from "@/hooks/useRecetasResumen";
import { Ionicons } from "@expo/vector-icons";
import { ReactElement, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
  const [esFavorito, setEsFavorito] = useState<boolean>(false);

  const tarjetaReceta = ({ receta }: { receta: RecetaAleatoria }) => {
    return (
      <TouchableOpacity style={styles.tarjetaContenedor}>
        <View style={styles.imagenWrapper}>
          <Image style={styles.imagen} source={{ uri: receta.imagen_url }} />

          <TouchableOpacity style={styles.corazonFlotante}>
            {/* falta la funcionalidad del corazón y conectarlo con la api, ademas de hacerlo que se guarde cuando no inice sesion */}
            <Ionicons
              name={esFavorito ? "heart" : "heart-outline"}
              size={24}
              color={esFavorito ? "#FF5722" : "#333"}
            />
          </TouchableOpacity>
          <View style={styles.tiempoFlotante}>
            <Text style={styles.textoTiempo}>
              ⏱ {receta.tiempo_preparacion} min
            </Text>
          </View>
        </View>
        <Text style={styles.titulo} numberOfLines={1}>
          {receta.nombre}
        </Text>
        <Text style={styles.descripcion} numberOfLines={2}>
          {receta.descripcion}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text>Cargando recomendaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoError}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedorSeccion}>
      {/* cabecera de la sección de recomendaciones */}
      <View style={styles.cabeceraSeccion}>
        <Text style={styles.tituloSeccion}>Recomendados para ti</Text>
        <TouchableOpacity>
          {/* aqui falta la funcionalidad del ver todo que me lleve a la pantalla de todas las recetas */}
          <Text style={styles.verTodo}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      {/* lista de recetas en formato de cuadrícula */}
      <FlatList
        data={recetas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.filaCuadricula}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ComponenteCabecera}
        renderItem={({ item }) => tarjetaReceta({ receta: item })}
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
  // Estilos de la tarjeta individual
  tarjetaContenedor: {
    width: "48%", // Al darle 48%, entran dos en el 100% dejando un 4% de margen al medio
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    paddingBottom: 15, // Espacio abajo del texto
    // Sombra suave (opcional)
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imagenWrapper: {
    position: "relative", // Importante para que los botones flotantes funcionen
  },
  imagen: {
    width: "100%",
    height: 120, // Ajusta según el Figma
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  corazonFlotante: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
  },
  tiempoFlotante: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoTiempo: {
    fontSize: 12,
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    paddingHorizontal: 10,
    color: "#4A2B12",
  },
  descripcion: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    paddingHorizontal: 10,
  },
  textoError: {
    color: "red",
  },
});
