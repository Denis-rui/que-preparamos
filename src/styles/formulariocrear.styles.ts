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
  contenidoBorrador: {
    paddingTop: Spacing.two,
  },
  encabezadoBorrador: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  titulo: {
    fontFamily: "Coiny_400Regular",
    fontSize: 29,
    color: TemaFormulario.colores.texto,
  },
  tituloBorrador: {
    flex: 1,
  },
  tituloCrear: {
    marginBottom: Spacing.three,
    textAlign: "center",
    transform: [{ translateY: -Spacing.two }],
  },
  seccion: {
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    padding: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  tituloSeccion: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: 18,
    color: TemaFormulario.colores.texto,
  },
  avisoAcceso: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    padding: Spacing.three,
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
