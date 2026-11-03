import { Spacing, TemaFormulario } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const stylesCrear = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: TemaFormulario.colores.fondo,
  },
  contenido: {
    padding: Spacing.four,
    paddingBottom: Spacing.five,
  },
  titulo: {
    fontFamily: "Coiny_400Regular",
    fontSize: 29,
    color: TemaFormulario.colores.texto,
    marginBottom: Spacing.three,
  },
  imagen: {
    minHeight: 160,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.three,
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    marginBottom: Spacing.four,
  },
  textoImagen: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoCampo,
    color: TemaFormulario.colores.secundario,
  },
});
