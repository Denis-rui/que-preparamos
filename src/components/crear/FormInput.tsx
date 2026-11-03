import { Spacing, TemaFormulario } from "@/constants/theme";
import {
  StyleSheet,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface FormInputProps extends TextInputProps {
  etiqueta?: string;
  ayuda?: string;
  error?: string;
  sufijo?: string;
  estiloContenedor?: StyleProp<ViewStyle>;
}

export const FormInput = ({
  etiqueta,
  ayuda,
  error,
  sufijo,
  estiloContenedor,
  multiline = false,
  style,
  accessibilityLabel,
  placeholder,
  placeholderTextColor,
  ...props
}: FormInputProps) => {
  const campo = (
    <TextInput
      {...props}
      placeholder={placeholder}
      multiline={multiline}
      accessibilityLabel={
        accessibilityLabel ??
        (sufijo && etiqueta ? `${etiqueta}, ${sufijo}` : etiqueta ?? placeholder)
      }
      placeholderTextColor={
        placeholderTextColor ?? TemaFormulario.colores.secundario
      }
      style={[
        styles.campo,
        multiline && styles.multilinea,
        Boolean(error) && styles.campoError,
        Boolean(sufijo) && styles.entradaConSufijo,
        style,
      ]}
    />
  );

  return (
    <View style={[styles.contenedor, estiloContenedor]}>
      {etiqueta && <Text style={styles.etiqueta}>{etiqueta}</Text>}
      {sufijo ? (
        <View style={[styles.campoConSufijo, Boolean(error) && styles.campoError]}>
          {campo}
          <Text style={styles.sufijo}>{sufijo}</Text>
        </View>
      ) : (
        campo
      )}
      {ayuda && <Text style={styles.ayuda}>{ayuda}</Text>}
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  etiqueta: {
    color: TemaFormulario.colores.texto,
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoEtiqueta,
  },
  campo: {
    minHeight: TemaFormulario.altoCampo,
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoCampo,
    color: TemaFormulario.colores.texto,
  },
  multilinea: {
    // Puede crecer con el contenido o los estilos del consumidor.
    minHeight: 120,
    textAlignVertical: "top",
  },
  campoConSufijo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    paddingHorizontal: Spacing.three,
  },
  entradaConSufijo: {
    flex: 1,
    minWidth: 0,
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  sufijo: {
    flexShrink: 0,
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
  },
  campoError: {
    borderColor: TemaFormulario.colores.error,
  },
  ayuda: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
  },
  error: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.error,
  },
});
