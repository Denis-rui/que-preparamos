import { Spacing, TemaFormulario } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/appButton";

interface Props {
  guardarRecetaPri: () => Promise<void>;
  guardando: boolean;
  bloqueado: boolean;
  error: string | null;
}

export default function Botones({
  guardarRecetaPri,
  guardando,
  bloqueado,
  error,
}: Props) {
  return (
    <View style={styles.contenedor}>
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      <AppButton
        label="Guardar Privada"
        onPress={guardarRecetaPri}
        loading={guardando || bloqueado}
        loadingLabel={guardando ? "Guardando..." : "Esperando foto..."}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  error: {
    fontFamily: TemaFormulario.fuente,
    color: TemaFormulario.colores.error,
  },
});
