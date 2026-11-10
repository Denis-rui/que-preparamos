import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

// El mismo respaldo se usa si no hay URL o si falla la descarga de la fotografía.
export function FotoReceta({
  uri,
  style,
  cabeceras,
}: {
  uri?: string | null;
  style: StyleProp<ViewStyle>;
  cabeceras?: Record<string, string>;
}) {
  const [urlFallida, setUrlFallida] = useState<string | null>(null);
  return (
    <View style={[styles.fondo, style]}>
      {uri && uri !== urlFallida ? (
        <Image
          source={{ uri, headers: cabeceras }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          onError={() => setUrlFallida(uri)}
        />
      ) : (
        <Image
          source={require("../../assets/imagenes/image-not-found-icon.png")}
          style={styles.imagenRespaldo}
          contentFit="contain"
          accessibilityLabel="Imagen de la receta no disponible"
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  fondo: {
    backgroundColor: "#F2EDE5",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  imagenRespaldo: {
    width: 64,
    height: 64,
  },
});
