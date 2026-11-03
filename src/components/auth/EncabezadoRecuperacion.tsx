import { Image } from "expo-image";
import {
  Text,
  View,
  useWindowDimensions,
  type ImageRequireSource,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getRecuperacionStyles } from "@/styles/recuperacion.styles";

type Props = {
  // La ilustración del chef que acompaña cada paso de la recuperación.
  ilustracion: ImageRequireSource;
  titulo: string;
  // Frase de apoyo bajo el título, p. ej. "Ingresa tu correo para...".
  mensaje?: string;
  // La lema «Buenas comidas, mejores momentos» solo aparece cuando hay
  // espacio suficiente en la pantalla.
  mostrarTagline?: boolean;
};

// Encabezado compartido por las pantallas de recuperación de contraseña:
// logo, lema opcional, ilustración del chef, título y descripción.
export function EncabezadoRecuperacion({
  ilustracion,
  titulo,
  mensaje,
  mostrarTagline = true,
}: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getRecuperacionStyles(height - insets.top - insets.bottom);

  return (
    <View style={styles.brand}>
      <View
        style={styles.logoRow}
        accessible
        accessibilityLabel="¿Qué preparamos?"
      >
        <Image
          source={require("../../assets/imagenes/icono_sombrero_chef.png")}
          style={styles.chefHat}
          contentFit="contain"
        />
        <Image
          source={require("../../assets/imagenes/titulo.png")}
          style={styles.titleLogo}
          contentFit="contain"
        />
      </View>

      {mostrarTagline && (
        <View style={styles.taglineRow}>
          <View style={styles.taglineText}>
            <Text
              style={styles.taglineFirstLine}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Buenas comidas,
            </Text>
            <Text
              style={styles.taglineSecondLine}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              mejores momentos
            </Text>
          </View>
          <Image
            source={require("../../assets/SVG/iconos/corazon_contorno.svg")}
            style={styles.taglineHeart}
            contentFit="contain"
          />
        </View>
      )}

      <Image
        source={ilustracion}
        style={styles.ilustracion}
        contentFit="contain"
      />

      <Text accessibilityRole="header" style={styles.heading}>
        {titulo}
      </Text>
      {mensaje ? <Text style={styles.subtitle}>{mensaje}</Text> : null}
    </View>
  );
}
