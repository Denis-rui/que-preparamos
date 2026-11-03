import { restablecerContrasenia } from "@/api/recuperacion";
import { EncabezadoRecuperacion } from "@/components/auth/EncabezadoRecuperacion";
import { CampoContrasena } from "@/components/ui/CampoContrasenia";
import { AppButton } from "@/components/ui/appButton";
import { BotonVolver } from "@/components/ui/botonVolver";
import { getRecuperacionStyles } from "@/styles/recuperacion.styles";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  type TextInputInstance,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

// Ilustración del chef con su libro y los adornos con verduras.
const ILUSTRACION = require("../../assets/SVG/ilustraciones/chef_elegir_cuenta_con_adornos.svg");

// La política del backend pide al menos 12 caracteres.
const MINIMO_CARACTERES = 12;

type Errores = {
  password?: string;
  confirmacion?: string;
};

// Paso 3: crear la nueva contraseña con la autorización que llegó de
// la pantalla del código. Al terminar, la cuenta se loguea de nuevo.
export default function NuevaContrasenia() {
  // La autorización temporal (token_recuperacion) viene del paso 2.
  const { token } = useLocalSearchParams<{ token?: string }>();
  const codigoAutorizacion = typeof token === "string" ? token : "";

  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errors, setErrors] = useState<Errores>({});
  const [serverError, setServerError] = useState<string | null>(null);
  // Referencia para pasar del primer campo al segundo con la tecla "next".
  // TextInputInstance es el tipo del campo real enfocable.
  const confirmacionRef = useRef<TextInputInstance | null>(null);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getRecuperacionStyles(height - insets.top - insets.bottom);

  const restablecimiento = useMutation({
    mutationFn: restablecerContrasenia,
    retry: false,
    networkMode: "always",
    gcTime: 0,
  });

  function validarFormulario(): boolean {
    const nuevosErrores: Errores = {};

    if (!password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (password.length < MINIMO_CARACTERES) {
      nuevosErrores.password = `La contraseña debe tener al menos ${MINIMO_CARACTERES} caracteres`;
    }

    if (!confirmacion) {
      nuevosErrores.confirmacion = "Confirma tu contraseña";
    } else if (password !== confirmacion) {
      nuevosErrores.confirmacion = "Las contraseñas no coinciden";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarGuardar() {
    Keyboard.dismiss();
    setServerError(null);

    // Sin la autorización del paso 2 el servidor rechazará el cambio,
    // así que avisamos antes de enviar.
    if (!codigoAutorizacion) {
      setServerError(
        "La recuperación expiró. Solicita un código nuevo desde «Olvidé mi contraseña».",
      );
      return;
    }
    if (!validarFormulario()) return;

    try {
      await restablecimiento.mutateAsync({
        token_recuperacion: codigoAutorizacion,
        password,
        password_confirmation: confirmacion,
      });

      // Limpiamos los datos del formulario navegando al login; allí
      // avisamos con el parámetro restablecida=1.
      setPassword("");
      setConfirmacion("");
      router.replace("/login?restablecida=1");
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "No pudimos guardar la contraseña. Inténtalo nuevamente.",
      );
    }
  }

  function manejarVolver() {
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
                rutaAlternativa="/olvide-contrasenia"
                deshabilitado={restablecimiento.isPending}
                etiqueta="Volver a la pantalla del código"
              />

              <EncabezadoRecuperacion
                ilustracion={ILUSTRACION}
                titulo="Nueva contraseña"
                mensaje="Crea una contraseña segura para tu cuenta"
              />

              <View style={styles.form}>
                <CampoContrasena
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  showLabel={false}
                  onSubmitEditing={() => confirmacionRef.current?.focus()}
                />

                <CampoContrasena
                  ref={confirmacionRef}
                  value={confirmacion}
                  onChangeText={setConfirmacion}
                  error={errors.confirmacion}
                  placeholder="Confirmar contraseña"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  showLabel={false}
                  onSubmitEditing={manejarGuardar}
                />

                <Text style={styles.nota}>
                  Mínimo {MINIMO_CARACTERES} caracteres
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

              <View style={[styles.acciones, { marginTop: 18 }]}>
                <AppButton
                  label="Guardar contraseña"
                  onPress={manejarGuardar}
                  loading={restablecimiento.isPending}
                  loadingLabel="Guardando..."
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
                    label="Volver"
                    variant="secundario"
                    onPress={manejarVolver}
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
