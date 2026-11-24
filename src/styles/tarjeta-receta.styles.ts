import { StyleSheet } from "react-native";

export function estiloAltoTarjeta(alto: number) {
  return { minHeight: alto, marginBottom: 0 };
}

export const styles = StyleSheet.create({
  presionado: { opacity: 0.85 },
  guardando: { opacity: 0.5 },
  error: { color: "#B3261E", fontSize: 11 },
  // Tamaño de los sombreritos.
  sombrerito: { width: 18, height: 18 },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 14,
    boxShadow: "0px 5px 14px rgba(64,38,16,0.06)",
  },
  horizontal: { flexDirection: "row", padding: 10, gap: 12 },
  cuadricula: { width: "48%", borderRadius: 15, paddingBottom: 15 },
  fotoHorizontal: {
    // Foto de Explorar.
    width: "32%",
    maxWidth: 110,
    aspectRatio: 1,
    flexShrink: 0,
    alignSelf: "center",
    borderRadius: 13,
    overflow: "hidden",
  },
  fotoCuadricula: {
    // Foto de Inicio.
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  // La foto ocupa todo su espacio.
  foto: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  corazon: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
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
  contenido: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 4,
    paddingVertical: 3,
  },
  contenidoCuadricula: { paddingHorizontal: 10, paddingTop: 10, gap: 5 },
  nombre: { fontFamily: "Inter_800ExtraBold", fontSize: 14, color: "#512013" },
  descripcion: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 15,
    color: "#918983",
  },
  ingredientes: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  etiqueta: {
    maxWidth: "100%",
    fontSize: 10,
    color: "#7C736C",
    backgroundColor: "#E9E5E1",
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  fila: { flexDirection: "row", alignItems: "center", gap: 2 },
  tiempo: { fontSize: 10, color: "#918983" },
  pie: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    marginTop: 3,
  },
  valoracion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  flecha: {
    backgroundColor: "#FF5008",
    borderRadius: 12,
    width: 21,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
