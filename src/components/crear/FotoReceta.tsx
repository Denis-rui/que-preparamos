import { Spacing, TemaFormulario } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { ImagePickerAsset } from "expo-image-picker";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  imagen: ImagePickerAsset | null;
  seleccionando: boolean;
  error: string | null;
  seleccionarImagen: () => Promise<void>;
  quitarImagen: () => void;
}

export const FotoReceta = ({
  imagen,
  seleccionando,
  error,
  seleccionarImagen,
  quitarImagen,
}: Props) => {
  return (
    <View style={styles.seccion}>
      <View style={styles.marco}>
        <Pressable
          onPress={() => {
            seleccionarImagen();
          }}
          disabled={seleccionando}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar una foto"
          accessibilityState={{
            disabled: seleccionando,
            busy: seleccionando,
          }}
          style={({ pressed }) => [
            styles.recuadro,
            !imagen && styles.sinSeleccion,
            pressed && styles.pulsado,
          ]}
        >
          {imagen ? (
            <Image
              source={{ uri: imagen.uri }}
              style={styles.imagen}
              contentFit="contain"
              accessible
            />
          ) : (
            <View style={styles.vacio}>
              <Image
                source={require("../../assets/imagenes/image-not-found-icon.png")}
                style={styles.imagenVacia}
                contentFit="contain"
              />
              <Text style={styles.ayuda}>Toca para seleccionar una foto</Text>
            </View>
          )}
          {seleccionando && (
            <View style={styles.cargando}>
              <ActivityIndicator
                size="large"
                color={TemaFormulario.colores.acento}
              />
              <Text style={styles.ayuda} accessibilityLiveRegion="polite">
                Abriendo fotos...
              </Text>
            </View>
          )}
        </Pressable>

        {imagen && (
          <Pressable
            onPress={quitarImagen}
            disabled={seleccionando}
            accessibilityRole="button"
            accessibilityLabel="Quitar foto"
            accessibilityState={{ disabled: seleccionando }}
            style={styles.eliminar}
          >
            <Ionicons
              name="close"
              size={24}
              color={TemaFormulario.colores.campo}
            />
          </Pressable>
        )}
      </View>

      <Text style={styles.ayuda}>
        {imagen ? "Toca la foto para cambiarla. " : ""}
        JPG, PNG o WEBP. Hasta 10 MB.
      </Text>

      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  seccion: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  titulo: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoCampo,
    color: TemaFormulario.colores.texto,
  },
  marco: {
    // Sirve como referencia para colocar la X en la esquina.
    position: "relative",
  },
  recuadro: {
    aspectRatio: 4 / 3,
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    overflow: "hidden",
  },
  sinSeleccion: {
    borderStyle: "dashed",
  },
  imagenVacia: {
    width: 120,
    height: 120,
  },
  pulsado: {
    opacity: 0.8,
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  vacio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
  },
  invitacion: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoCampo,
    color: TemaFormulario.colores.texto,
    textAlign: "center",
  },
  ayuda: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
  },
  cargando: {
    // Cubre el recuadro mientras esperamos al selector.
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: TemaFormulario.colores.campo,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.two,
  },
  eliminar: {
    position: "absolute",
    top: Spacing.two,
    right: Spacing.two,
    // Área de pulsación cómoda para el dedo.
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TemaFormulario.colores.texto,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.error,
  },
});
