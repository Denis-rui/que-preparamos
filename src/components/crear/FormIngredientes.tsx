import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";

export const FormIngredientes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ingredientes</Text>

      {/* lista de ingredientes: esto puede ir en un componente separado cuadno conectemos con la API */}
      <View style={styles.lista}>
        <View style={styles.item}>
          <Text style={styles.itemText}>🥩 Carne de res</Text>
          <Text style={styles.itemDetail}>500 g</Text>
          <TouchableOpacity style={styles.btnEliminar}>
            <Ionicons name="close-circle" size={22} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>🍋 Limón </Text>
          <Text style={styles.itemDetail}>1 unidad</Text>
          <TouchableOpacity style={styles.btnEliminar}>
            <Ionicons name="close-circle" size={22} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>🧂 Sal</Text>
          <Text style={styles.itemDetail}>Al gusto</Text>
          <TouchableOpacity style={styles.btnEliminar}>
            <Ionicons name="close-circle" size={22} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>
      {/* formulario para agregar nuevos ingredientes */}
      <FormSelect placeholder="Seleccione ingrediente..." />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormInput placeholder="Cantidad" />
        </View>
        <View style={styles.halfWidth}>
          <FormSelect placeholder="Unidad" />
        </View>
      </View>
      <FormInput placeholder="Notas (Ej: al gusto, picado fino)" />
      <TouchableOpacity style={styles.btnAgregar}>
        <Text style={styles.btnAgregarText}>Agregar Ingrediente</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF", // Fondo blanco para resaltar
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8", // Borde sutil
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#552414",
    marginBottom: 15,
  },
  lista: {
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  itemDetail: {
    fontSize: 16,
    color: "#777",
    marginRight: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  btnAgregar: {
    backgroundColor: "#FF6B35", // Color naranja
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 5,
  },
  btnAgregarText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  btnEliminar: {
    padding: 5,
  },
});
