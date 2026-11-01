import { Spacing, TemaFormulario } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FormSelectProps {
  placeholder: string;
  etiqueta?: string;
  valor?: string | null;
  ayuda?: string;
  error?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export const FormSelect = ({
  etiqueta,
  valor,
  ayuda,
  error,
  disabled,
  onPress,
  placeholder,
}: FormSelectProps) => {
  const inhabilitado = disabled || !onPress;

  return (
    <View style={styles.contenedor}>
      {etiqueta && <Text style={styles.etiqueta}>{etiqueta}</Text>}
      <TouchableOpacity
        style={[
          styles.campo,
          inhabilitado && styles.deshabilitado,
          Boolean(error) && styles.campoError,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={inhabilitado}
        accessibilityRole="button"
        accessibilityLabel={etiqueta ?? placeholder}
        accessibilityValue={{ text: valor || placeholder }}
        accessibilityState={{ disabled: inhabilitado }}
      >
        <Text style={[styles.valor, !valor && styles.placeholder]}>
          {valor || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={TemaFormulario.colores.secundario}
        />
      </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
  },
  valor: {
    flex: 1,
    fontSize: TemaFormulario.tamanoCampo,
    fontFamily: TemaFormulario.fuente,
    color: TemaFormulario.colores.texto,
  },
  placeholder: {
    color: TemaFormulario.colores.secundario,
  },
  deshabilitado: {
    backgroundColor: TemaFormulario.colores.deshabilitado,
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
