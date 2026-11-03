import { solicitarCodigoRecuperacion } from "@/api/recuperacion";
import { EncabezadoRecuperacion } from "@/components/auth/EncabezadoRecuperacion";
import { AppButton } from "@/components/ui/appButton";
import { BotonVolver } from "@/components/ui/botonVolver";
import { getRecuperacionStyles } from "@/styles/recuperacion.styles";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

// Ilustración del chef con su libro y verduras.
const ILUSTRACION = require("../../assets/SVG/ilustraciones/chef_libro_con_verduras.svg");

type Errores = {
  email?: string;
};

// Paso 1 de «Olvidé mi contraseña»: la persona escribe su correo y el
// servidor manda un código de 6 dígitos a ese correo.
export default function OlvideContrasenia() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errores>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [focoCorreo, setFocoCorreo] = useState(false);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getRecuperacionStyles(height - insets.top - insets.bottom);

  // La petición al servidor viaja por react-query, como en login y register.
  const solicitud = useMutation({
    mutationFn: solicitarCodigoRecuperacion,
    retry: false,
    networkMode: "always",
    gcTime: 0,
  });

  // Comprobamos el correo antes de molestar al servidor.
  function validarFormulario(): boolean {
    const nuevosErrores: Errores = {};

    if (!email.trim()) {
      nuevosErrores.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nuevosErrores.email = "Ingresa un correo válido";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarEnviar() {
    Keyboard.dismiss();
    setServerError(null);
    if (!validarFormulario()) return;

    try {
      // El envío nunca confirma si la cuenta existe: la respuesta es
      // genérica. Continuamos a la pantalla del código en ambos casos.
      await solicitud.mutateAsync({ email: email.trim() });
      router.push({
        pathname: "/verificar-codigo",
        params: { email: email.trim() },
      });
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "No pudimos enviar el código. Inténtalo nuevamente.",
      );
    }
  }

  // Regresar al inicio de sesión; si llegamos aquí sin historial
  // (p. ej. la app abrió directo en esta pantalla), sustituimos la ruta.
  function irAIniciarSesion() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.page}>
              <BotonVolver
                rutaAlternativa="/login"
                deshabilitado={solicitud.isPending}
                etiqueta="Volver a iniciar sesión"
              />

              <EncabezadoRecuperacion
                ilustracion={ILUSTRACION}
                titulo="¿Olvidaste tu contraseña?"
                mensaje="Ingresa tu correo para recuperar el acceso a tu cuenta"
              />

              <View style={styles.form}>
                <View>
                  <View
                    style={[
                      styles.inputRow,
                      focoCorreo && styles.inputRowFocused,
                    ]}
                  >
                    <Image
                      source={require("../../assets/SVG/iconos/correo_blanco.svg")}
                      style={styles.inputIcon}
                      contentFit="contain"
                    />
                    <TextInput
                      style={styles.inputField}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Correo electrónico"
                      placeholderTextColor="#9D9DA7"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      accessibilityLabel="Correo electrónico"
                      returnKeyType="done"
                      onSubmitEditing={manejarEnviar}
                      onFocus={() => setFocoCorreo(true)}
                      onBlur={() => setFocoCorreo(false)}
                    />
                  </View>
                  {errors.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                <Text style={styles.nota}>
                  Te enviaremos un código de verificación
                </Text>

                {serverError ? (
                  <Text
                    style={[styles.errorText, { textAlign: "center" }]}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                  >
                    {serverError}
                  </Text>
                ) : null}
              </View>

              <View style={styles.acciones}>
                <AppButton
                  label="Enviar código"
                  onPress={manejarEnviar}
                  loading={solicitud.isPending}
                  loadingLabel="Enviando..."
                  icon={
                    <Image
                      source={require("../../assets/SVG/iconos/flecha_ingresar.svg")}
                      style={styles.buttonArrow}
                      contentFit="contain"
                    />
                  }
                />
                <View style={styles.botonVolverMarco}>
                  <Image
                    source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                    style={styles.hojaIzquierda}
                    contentFit="contain"
                    pointerEvents="none"
                  />
                  <Image
                    source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                    style={styles.hojaDerecha}
                    contentFit="contain"
                    pointerEvents="none"
                  />
                  <AppButton
                    label="Volver a iniciar sesión"
                    variant="secundario"
                    onPress={irAIniciarSesion}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
