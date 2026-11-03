import { Spacing, TemaFormulario } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/appButton";

interface Props {
  guardarRecetaPri: () => Promise<void>;
  publicar: () => Promise<void>;
  guardando: boolean;
  bloqueado: boolean;
  publicando: boolean;
  publicacionSinConfirmar: boolean;
  error: string | null;
}

export default function Botones({
  guardarRecetaPri,
  guardando,
  bloqueado,
  error,
  publicar,
  publicando,
  publicacionSinConfirmar,
}: Props) {
  const ocupado = guardando || bloqueado;

  return (
    <View style={styles.contenedor}>
      {publicacionSinConfirmar && !guardando && (
        <Text style={styles.aviso}>
          La receta ya se guardó en tu cuenta. Reintenta para confirmar el
          resultado de su publicación.
        </Text>
      )}

      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
      {!publicacionSinConfirmar && (
        <AppButton
          label="Guardar privada"
          variant="secundario"
          onPress={() => {
            void guardarRecetaPri();
          }}
          disabled={ocupado}
          loading={guardando && !publicando}
          loadingLabel="Guardando..."
        />
      )}

      <AppButton
        label={publicacionSinConfirmar ? "Reintentar publicación" : "Publicar"}
        onPress={() => {
          void publicar();
        }}
        disabled={ocupado}
        loading={publicando}
        loadingLabel="Enviando..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  aviso: {
    fontFamily: TemaFormulario.fuente,
    color: TemaFormulario.colores.secundario,
  },
  error: {
    fontFamily: TemaFormulario.fuente,
    color: TemaFormulario.colores.error,
  },
});
