import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(32, 26, 19, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFBF0",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#D4B72E",
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cerrar: {
    position: "absolute",
    top: 14,
    right: 16,
  },
  iconoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FBEEDC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Kavoon_400Regular",
    color: "#552414",
    textAlign: "center",
    marginBottom: 10,
  },
  mensaje: {
    fontSize: 13,
    lineHeight: 19,
    color: "#756B64",
    textAlign: "center",
    marginBottom: 24,
  },
  acciones: {
    width: "100%",
    gap: 10,
  },
});