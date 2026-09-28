import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

// El mismo respaldo se usa si no hay URL o si falla la descarga de la fotografía.
export function FotoReceta({
  uri,
  style,
}: {
  uri?: string | null;
  style: StyleProp<ViewStyle>;
}) {
  const [urlFallida, setUrlFallida] = useState<string | null>(null);
  return (
    <View style={[styles.fondo, style]}>
      {uri && uri !== urlFallida ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          onError={() => setUrlFallida(uri)}
        />
      ) : (
        <Ionicons
          name="restaurant-outline"
          size={30}
          color="#987B6C"
          accessibilityLabel="Receta sin fotografía"
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
});
