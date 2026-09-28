import Botones from "@/components/crear/Botones";
import { FormIngredientes } from "@/components/crear/FormIngredientes";
import { FormInput } from "@/components/crear/FormInput";
import { FormSelect } from "@/components/crear/FormSelect";
import { PasosPreparacion } from "@/components/crear/PasosPreparacion";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Crear() {
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.contenedor}>
        <View style={styles.header}>
          <Text style={styles.tituloTexto}>Nueva Receta</Text>
        </View>
        <TouchableOpacity style={styles.subirImagen} activeOpacity={0.8}>
          <Text style={styles.subirImagenTexto}>Subir imagen</Text>
        </TouchableOpacity>
        <FormInput placeholder="Ingrese el título de la receta ..." />
        <FormInput placeholder="Ingrese una descripción ..." multiline={true} />
        <FormSelect placeholder="Ingrese categorías ..." />
        <View style={styles.fila}>
          <View style={styles.mitad}>
            <FormInput placeholder="Porciones" />
          </View>
          <View style={styles.mitad}>
            <FormInput placeholder="Tiempo de preparación" />
          </View>
        </View>
        <FormIngredientes />
        <PasosPreparacion />
        <Botones />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFCF2",
  },
  contenedor: {
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  flecha: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#552414",
    marginRight: 15,
  },
  tituloTexto: {
    fontFamily: "Coiny_400Regular",
    fontSize: 29,
    color: "#552414",
  },
  subirImagen: {
    backgroundColor: "#B5CEAB",
    height: 180,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  subirImagenTexto: {
    color: "#555",
    fontWeight: "500",
    fontSize: 16,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mitad: {
    width: "48%",
  },
});
