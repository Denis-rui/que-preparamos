import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const colores = ["#FFE8D6", "#FFD1DC", "#D4EAC8", "#D6E4FF", "#F3E8FF"];

export interface Categoria {
  id: number;
  nombre: string;
}

export const CategoriasInicio = ({
  categorias,
}: {
  categorias: Categoria[];
}) => {
  // Renderiza cada categoría con un color cíclico
  const renderizarCategoria = ({
    item,
    index,
  }: {
    item: Categoria;
    index: number;
  }) => {
    const color = colores[index % colores.length]; // colores cíclicos para cada categoría
    return (
      // Tarjeta de categoría
      <Pressable style={[styles.tarjeta, { backgroundColor: color }]}>
        <Text style={styles.textoTarjeta}>{item.nombre}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.tituloCategorias}>Categorías</Text>
      </View>
      <FlatList
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderizarCategoria}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contenedorCategorias}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  contenedor: {
    marginVertical: 15,
  },
  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tituloCategorias: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2723",
  },
  contenedorCategorias: {
    paddingHorizontal: 20,
    gap: 15,
  },
  tarjeta: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
  },
  textoTarjeta: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E2723",
    textAlign: "center",
  },
});
