import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#FFFCF2" },
  cabeceraFija: {
    paddingHorizontal: 18,
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
  },
  areaLista: { flex: 1, minHeight: 0 },
  scroll: { flex: 1 },
  lista: {
    paddingHorizontal: 18,
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
  },
  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#B9D99C",
    marginBottom: 20,
    gap: 8,
  },
  // El sombrero queda a la izquierda, centrado junto a las dos palabras.
  marca: { flex: 1, minWidth: 0, paddingLeft: 84, paddingTop: 18, paddingBottom: 18 },
  sombrero: { position: "absolute", width: 100, height: 100, left: -8, top: 15 },
  tituloCurvo: { width: "100%", height: 64, marginTop: -10 },
  subtituloCurvo: {
    width: "95%",
    height: 48,
    alignSelf: "center",
    marginTop: -10,
  },
  hojasPlato: {
    position: "absolute",
    width: 34,
    height: 64,
    left: -23,
    top: "50%",
  },
  hojas: { width: 30, height: 32, position: "absolute", bottom: 0, left: 5 },
  // Dos sombras suaves dan profundidad sin modificar la fotografía original.
  sombraPlato: {
    width: "27%",
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: "#FFFCF2",
    boxShadow:
      "4px 9px 14px rgba(65, 36, 18, 0.24), 1px 2px 4px rgba(65, 36, 18, 0.12)",
  },
  plato: { width: "100%", height: "100%", borderRadius: 100 },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DEDEDE",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  placeholder: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    color: "#8B8580",
    fontSize: 12,
  },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    marginBottom: 18,
  },
  filtro: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: "#F5EEE4",
    borderRadius: 22,
  },
  filtroActivo: { backgroundColor: "#FF5008" },
  textoFiltro: {
    fontFamily: "Inter_600SemiBold",
    color: "#633A2D",
    fontSize: 11,
  },
  textoFiltroActivo: { color: "white" },
  estado: { alignItems: "center", padding: 24, gap: 12 },
  mensaje: {
    fontFamily: "Inter_400Regular",
    color: "#918983",
    textAlign: "center",
  },
  error: { color: "#B7392B" },
});
