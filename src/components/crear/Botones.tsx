import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Botones() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnPrivada}>
        <Text style={styles.btnText}>Guardar Privada</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPublicar}>
        <Text style={styles.btnText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  btnPrivada: {
    flex: 1,
    backgroundColor: "#327C34",
    padding: 15,
    borderRadius: 25,
    marginRight: 10,
    alignItems: "center",
  },
  btnPublicar: {
    flex: 1,
    backgroundColor: "#327C34",
    padding: 15,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
