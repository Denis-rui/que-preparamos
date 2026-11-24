import type { Animated } from "react-native";

export function estiloCorazonAnimado(escala: Animated.Value) {
  return { transform: [{ scale: escala }] };
}
