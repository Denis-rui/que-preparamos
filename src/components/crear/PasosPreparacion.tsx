import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "./FormInput";

export const PasosPreparacion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preparación</Text>

      {/* por el diseño actual hay dos , pero se pueden returilizar en un solo componente */}
      <View style={styles.pasoRow}>
        <View style={styles.circulo}>
          <Text style={styles.numero}>1</Text>
        </View>
        <View style={styles.inputContainer}>
          <FormInput placeholder="Ingrese el paso..." multiline={true} />
        </View>
      </View>

      <View style={styles.pasoRow}>
        <View style={styles.circulo}>
          <Text style={styles.numero}>2</Text>
        </View>
        <View style={styles.inputContainer}>
          <FormInput placeholder="Ingrese el paso..." multiline={true} />
        </View>
      </View>
      <TouchableOpacity style={styles.btnOtroPaso}>
        <Text style={styles.btnOtroPasoText}>Agregar otro paso</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderStyle: "dashed",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#552414",
    marginBottom: 15,
  },
  pasoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  circulo: {
    width: 25,
    height: 25,
    backgroundColor: "#FF6B35",
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 10,
  },
  numero: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  inputContainer: {
    flex: 1, // Hace que el input tome todo el espacio restante a la derecha del círculo
  },
  btnOtroPaso: {
    padding: 10,
    alignItems: "center",
  },
  btnOtroPasoText: {
    color: "#6F9D67", // Verde
    fontWeight: "bold",
  },
});
