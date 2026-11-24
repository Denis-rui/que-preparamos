import { Ionicons } from "@expo/vector-icons";
import { estiloCorazonAnimado } from "@/styles/corazon-favorito.styles";
import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated } from "react-native";

export function CorazonFavorito({ seleccionado, size = 24 }: {
  seleccionado: boolean;
  size?: number;
}) {
  const escala = useRef(new Animated.Value(1)).current;
  const anterior = useRef(seleccionado);

  useEffect(() => {
    const cambio = anterior.current !== seleccionado;
    anterior.current = seleccionado;
    if (!cambio) return;
    let activo = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reducir) => {
      if (!activo || reducir) return;
      Animated.sequence([
        Animated.timing(escala, { toValue: seleccionado ? 1.3 : 0.85, duration: 120, useNativeDriver: true }),
        Animated.spring(escala, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true }),
      ]).start();
    });
    return () => {
      activo = false;
      escala.stopAnimation();
      escala.setValue(1);
    };
  }, [seleccionado, escala]);

  return (
    <Animated.View accessible={false} style={estiloCorazonAnimado(escala)}>
      <Ionicons name={seleccionado ? "heart" : "heart-outline"} size={size}
        color={seleccionado ? "#E53935" : "#633A2D"} />
    </Animated.View>
  );
}
