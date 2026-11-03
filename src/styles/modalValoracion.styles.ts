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
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cerrar: {
    position: "absolute",
    top: 14,
    right: 16,
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Kavoon_400Regular",
    color: "#552414",
    marginBottom: 28,
  },
  gorros: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },
  boton: {
    backgroundColor: "#FF6A1A",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 56,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#C0392B",
    fontSize: 12,
    textAlign: "center",
    marginTop: -16,
    marginBottom: 12,
  },
  iconoGracias: {
    marginBottom: 16,
  },
  tituloGracias: {
    marginBottom: 12,
    textAlign: "center",
  },
  mensajeGracias: {
    fontSize: 14,
    lineHeight: 20,
    color: "#756B64",
    textAlign: "center",
    marginBottom: 28,
  },
});