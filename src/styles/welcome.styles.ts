import { StyleSheet } from "react-native";

// Medidas del diseño original, pensado para un celular de ~390 px de ancho.
const ANCHO_BASE = 390;
// Alto que ocupan los elementos que se achican (logo, mascota, textos, ícono).
const ALTO_ESCALABLE = 660;
const ALTO_FIJO = 140;

export function calcularEscala(ancho: number, alto: number) {
  return Math.min(ancho / ANCHO_BASE, (alto - ALTO_FIJO) / ALTO_ESCALABLE, 1);
}

export function getWelcomeStyles(escala: number) {
  // e(): medidas. f(): textos largos, que no bajan del 80 % para seguir legibles.
  const e = (valor: number) => Math.round(valor * escala);
  const f = (valor: number) => Math.round(valor * Math.max(escala, 0.8));

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFBF0",
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    contentWrapper: {
      flex: 1,
      justifyContent: "center",
      marginHorizontal: -24,
      transform: [{ translateY: -e(18) }],
      alignItems: "center",
      paddingHorizontal: 24,
    },
    brandLockup: {
      alignItems: "center",
      marginBottom: e(8),
    },
    brandHeader: {
      alignItems: "center",
      flexDirection: "row",
      marginLeft: -e(8),
    },
    chefHat: {
      height: e(141),
      marginRight: -e(30),
      transform: [{ translateY: e(3) }],
      width: e(143),
    },
    titleLogo: {
      height: e(106),
      width: e(250),
    },
    mascota: {
      height: e(262),
      marginBottom: e(10),
      transform: [{ translateY: e(10) }],
      width: e(390),
    },
    brandTagline: {
      color: "#5B1D12",
      fontFamily: "Lobster_400Regular",
      fontSize: e(29),
      lineHeight: e(33),
    },
    taglineComma: {
      color: "#5B1D12",
      fontFamily: "Lobster_400Regular",
      fontSize: e(29),
      lineHeight: e(33),
      transform: [{ translateY: e(5) }],
    },
    taglineFirstLine: {
      alignItems: "flex-start",
      flexDirection: "row",
    },
    taglineText: {
      width: e(260),
    },
    taglineSecondLine: {
      color: "#5B1D12",
      fontFamily: "Lobster_400Regular",
      fontSize: e(29),
      lineHeight: e(33),
      marginLeft: e(34),
    },
    taglineSkew: {
      transform: [{ rotate: "-8deg" }],
    },
    taglineRow: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: e(6),
    },
    taglineHeart: {
      marginLeft: -e(10),
      transform: [{ rotate: "8deg" }],
    },
    copyBlock: {
      alignItems: "center",
      transform: [{ translateY: e(12) }],
    },
    title: {
      color: "#5B1D12",
      fontFamily: "Inter_800ExtraBold",
      fontSize: f(25),
      lineHeight: f(31),
      textAlign: "center",
    },
    description: {
      color: "#6D6D6D",
      fontFamily: "Inter_400Regular",
      fontSize: f(16),
      lineHeight: f(22),
      marginTop: e(8),
      textAlign: "center",
    },
    buttonsWrapper: {
      gap: 12,
      width: "100%",
      maxWidth: 420, 
      alignSelf: "center",
    },
    footerIcon: {
      width: e(72),
      height: e(60),
      alignSelf: "center",
      marginTop: e(8),
    },
  });
}