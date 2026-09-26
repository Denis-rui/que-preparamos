import { styles } from "@/styles/perfil.styles";
import { Image } from "expo-image";
import { Text, View } from "react-native";
export const LogoQuePreparamos = () => {
  return (
    <View style={styles.brandRow}>
      <View
        style={styles.logo}
        accessible
        accessibilityLabel="¿Qué preparamos?"
      >
        <Image
          source={require("../assets/imagenes/icono_sombrero_chef.png")}
          style={styles.hat}
          contentFit="contain"
        />
        <Image
          source={require("../assets/imagenes/titulo.png")}
          style={styles.brandTitle}
          contentFit="contain"
          allowDownscaling={false}
        />
      </View>
      <View
        style={styles.tagline}
        accessible
        accessibilityLabel="Buenas comidas, mejores momentos"
      >
        <Image
          source={require("../assets/SVG/adornos/hojas_derecha.svg")}
          style={styles.taglineTopLeaves}
          contentFit="contain"
        />
        <Text style={styles.taglineText}>
          Buenas{"\n"}comidas,{"\n"}mejores{"\n"}momentos
        </Text>
        <Image
          source={require("../assets/SVG/iconos/corazon_contorno.svg")}
          style={styles.taglineHeart}
          contentFit="contain"
        />
        <Image
          source={require("../assets/SVG/adornos/hojas_izquierda.svg")}
          style={styles.taglineBottomLeaves}
          contentFit="contain"
        />
      </View>
    </View>
  );
};
