import { Spacing, TemaFormulario } from "@/constants/theme";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface FormInputProps extends TextInputProps {
  etiqueta?: string;
  ayuda?: string;
  error?: string;
}

export const FormInput = ({
  etiqueta,
  ayuda,
  error,
  multiline = false,
  style,
  accessibilityLabel,
  placeholder,
  placeholderTextColor,
  ...props
}: FormInputProps) => {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        {...props}
        placeholder={placeholder}
        multiline={multiline}
        accessibilityLabel={accessibilityLabel ?? etiqueta ?? placeholder}
        placeholderTextColor={
          placeholderTextColor ?? TemaFormulario.colores.secundario
        }
        style={[
          styles.campo,
          multiline && styles.multilinea,
          Boolean(error) && styles.campoError,
          style,
        ]}
      />
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
