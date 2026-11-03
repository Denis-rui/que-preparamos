import { StyleSheet } from "react-native";

// Estilos compartidos por las tres pantallas de recuperación de contraseña:
// solicitar código, verificar código y nueva contraseña. La estructura
// sigue el mismo formato de register.styles y login.styles.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF0" },
  content: {
    flexGrow: 1,
    alignItems: "center",
    // El contenido se pega arriba, como en los mockups. (El centrado
    // vertical empujaba el encabezado hacia abajo cuando sobraba espacio,
    // porque este flujo tiene menos campos que register.)
    justifyContent: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  page: { width: "100%", maxWidth: 390 },

  // Encabezado: logo, lema, ilustración, título y descripción.
  // Los valores copian a register.styles para que el encabezado se vea igual.
  brand: { alignItems: "center", marginTop: -18, marginBottom: 20 },
  logoRow: { width: "100%", flexDirection: "row", alignItems: "center" },
  chefHat: { width: "39%", aspectRatio: 143 / 141, marginRight: "-8%" },
  titleLogo: { width: "69%", aspectRatio: 250 / 106 },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    width: "90%",
    marginTop: -6,
    marginBottom: 8,
  },
  taglineText: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 9,
    transform: [{ rotate: "-8deg" }],
  },
  taglineFirstLine: {
    color: "#5B1D12",
    fontFamily: "Lobster_400Regular",
    fontSize: 26,
    lineHeight: 30,
    textAlign: "center",
  },
  taglineSecondLine: {
    color: "#5B1D12",
    fontFamily: "Lobster_400Regular",
    fontSize: 26,
    lineHeight: 30,
    marginLeft: 24,
    textAlign: "center",
  },
  taglineHeart: {
    width: 40,
    height: 40,
    flexShrink: 0,
    marginLeft: 5,
    transform: [{ rotate: "8deg" }],
  },
  // La ilustración comparte el marco de register: todo el ancho disponible.
  // 245 px es justamente la altura que logra el chef de register
  // (chef 580x410 dentro de ~346 px de ancho), así que las tres
  // ilustraciones ocupan un tamaño visual parecido.
  ilustracion: { width: "100%", height: 245 },
  heading: {
    color: "#5B1D12",
    fontFamily: "Inter_800ExtraBold",
    fontSize: 33,
    lineHeight: 40,
    marginTop: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#7C736C",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
    paddingHorizontal: 16,
    textAlign: "center",
  },

  // Formulario y mensajes.
  form: { gap: 14, width: "100%" },

  // Tarjeta del campo de correo (igual que en register y el LoginModal).
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
    boxShadow: "0px 4px 10px rgba(64, 38, 16, 0.06)",
  },
  inputRowFocused: { borderColor: "#FF5008" },
  inputRowError: { borderColor: "#FF4F0A" },
  inputIcon: { width: 40, height: 40, flexShrink: 0 },
  inputField: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    paddingVertical: 6,
    color: "#512013",
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },

  nota: {
    color: "#5B1D12",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
  },
  errorText: {
    color: "#FF4F0A",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 4,
  },

  // Cuenta regresiva «El código vence en: mm:ss».
  temporizadorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  temporizadorTexto: {
    color: "#6D6D7B",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  temporizadorTiempo: {
    color: "#512013",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
  },

  // Enlace «¿No recibiste el código? Reenviar código».
  reenvioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 4,
  },
  reenvioTexto: {
    color: "#6D6D7B",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  reenvioEnlace: {
    color: "#FF5008",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
  },
  // Mientras esperamos los 60 segundos entre envíos, el enlace se ve tenue.
  reenvioEsperando: {
    color: "#B3AA9F",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
  },

  // Botones finales (secundario con hojitas decorativas alrededor).
  acciones: { gap: 14, width: "100%" },
  botonVolverMarco: { position: "relative" },
  hojaIzquierda: {
    position: "absolute",
    width: 30,
    height: 38,
    left: -22,
    top: -18,
  },
  hojaDerecha: {
    position: "absolute",
    width: 30,
    height: 38,
    right: -22,
    bottom: 0,
  },
  buttonArrow: { width: 22, height: 22 },
  pressed: { opacity: 0.7 },
});

export function getRecuperacionStyles(availableHeight: number) {
  // Con suficiente espacio usamos los estilos base, como en register.
  if (availableHeight >= 900) return styles;

  // En pantallas bajas aplicamos las mismas reducciones de register
  // para que el encabezado siga viéndose igual pero quepa el formulario.
  return {
    ...styles,
    content: { ...styles.content, paddingVertical: 12 },
    brand: { ...styles.brand, marginBottom: 12 },
    logoRow: { ...styles.logoRow, width: "85%" as const },
    taglineRow: { ...styles.taglineRow, marginBottom: 4 },
    taglineText: { ...styles.taglineText, paddingVertical: 5 },
    taglineFirstLine: {
      ...styles.taglineFirstLine,
      fontSize: 24,
      lineHeight: 27,
    },
    taglineSecondLine: {
      ...styles.taglineSecondLine,
      fontSize: 24,
      lineHeight: 27,
    },
    ilustracion: {
      ...styles.ilustracion,
      // Piso de 110 px: siguiendo la fórmula de register tal cual, en
      // pantallas muy bajas el chef quedaba de 70 px (invisible).
      height: Math.max(110, Math.min(160, availableHeight - 630)),
    },
    heading: { ...styles.heading, fontSize: 28, lineHeight: 34 },
    subtitle: { ...styles.subtitle, fontSize: 14, lineHeight: 19, marginTop: 4 },
    form: { ...styles.form, gap: 11 },
    inputRow: { ...styles.inputRow, paddingVertical: 6 },
    inputIcon: { ...styles.inputIcon, width: 36, height: 36 },
    acciones: { ...styles.acciones, gap: 11 },
  };
}
