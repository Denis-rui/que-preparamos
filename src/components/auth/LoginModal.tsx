import { CampoContrasena } from "@/components/ui/CampoContrasenia";
import { AppButton } from "@/components/ui/appButton";
import { useLogin } from "@/hooks/useLogin";
import { styles } from "@/styles/auth.styles";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CuentaGuardada, CuentaGuardadaData } from "./CuentaGuardada";

type Props = {
  cuenta: CuentaGuardadaData | null;
  aviso?: string;
  onClose: () => void;
  onSuccess: (respuesta: any, email: string) => Promise<void>;
};

export default function LoginModal({
  cuenta,
  aviso,
  onClose,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState("");
  // TextInputInstance es el tipo del campo real al pedir focus().
  const passwordRef = useRef<TextInputInstance | null>(null);
  const insets = useSafeAreaInsets();
  const { submit, loading, error, resetError, credencialesRechazadas } =
    useLogin(cuenta !== null);

  const correoAEnviar = cuenta ? cuenta.email : email.trim();

  // Ir a la recuperación de contraseña: cerramos el modal para que, al
  // regresar, no vuelva a aparecer tapando el inicio de sesión.
  function abrirRecuperacion() {
    onClose();
    router.push("/olvide-contrasenia");
  }

  async function handleSubmit() {
    if (loading) return;
    try {
      const respuesta = await submit({
        email: correoAEnviar,
        password,
      });
      // Esperamos a que la pantalla termine de recordar la cuenta y navegar.
      await onSuccess(respuesta, correoAEnviar);
    } catch {
      // el mensaje de error (se muestra bajo el campo)
    }
  }

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.safeContent,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card} accessibilityViewIsModal>
            <View style={styles.cardContent}>
              <View style={styles.headingRow}>
                <Image
                  source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                  style={styles.headingLeaves}
                  contentFit="contain"
                  accessible={false}
                />
                <Text style={styles.heading} accessibilityRole="header">
                  {cuenta ? "Iniciar sesión" : "Usar otra cuenta"}
                </Text>
                <Image
                  source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                  style={styles.headingLeaves}
                  contentFit="contain"
                  accessible={false}
                />
              </View>

              <Text style={styles.subtitle}>
                {cuenta
                  ? "Ingresa tu contraseña para continuar"
                  : "Ingresa tu correo y contraseña"}
              </Text>

              {/* El aviso de sesión se muestra dentro del modal visible. */}
              {aviso ? (
                <Text
                  style={styles.errorText}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  {aviso}
                </Text>
              ) : null}

              {cuenta ? (
                <View style={styles.accountRow}>
                  <CuentaGuardada
                    name={cuenta.name}
                    email={cuenta.email}
                    size="modal"
                  />
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <View
                    style={[
                      styles.inputRow,
                      emailFocused && styles.inputRowFocused,
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
                      onChangeText={(value) => {
                        setEmail(value);
                        resetError();
                      }}
                      placeholder="Correo electrónico"
                      placeholderTextColor="#9D9DA7"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      accessibilityLabel="Correo electrónico"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>
              )}

              <CampoContrasena
                ref={passwordRef}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  resetError();
                }}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                showLabel={false}
              />

              <Pressable
                style={({ pressed }) => [styles.forgotPasswordWrapper, pressed && styles.pressed]}
                onPress={abrirRecuperacion}
                accessibilityRole="button"
                accessibilityLabel="Recuperar contraseña"
              >
                <Text style={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>

              {error && (
                <Text
                  style={styles.errorText}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  {error}
                </Text>
              )}
              {!cuenta && credencialesRechazadas && (
                <AppButton
                  label="Crear cuenta"
                  variant="secundario"
                  onPress={() => {
                    onClose();
                    router.push("/register");
                  }}
                />
              )}

              <View style={styles.actions}>
                <AppButton
                  label="Ingresar"
                  onPress={handleSubmit}
                  loading={loading}
                  loadingLabel="Ingresando..."
                  icon={
                    <Image
                      source={require("../../assets/SVG/iconos/flecha_ingresar.svg")}
                      style={styles.buttonArrow}
                      contentFit="contain"
                    />
                  }
                />
                <View style={styles.cancelWrapper}>
                  <Image
                    source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                    style={styles.bottomLeavesLeft}
                    contentFit="contain"
                    pointerEvents="none"
                    accessible={false}
                  />
                  <Image
                    source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                    style={styles.bottomLeavesRight}
                    contentFit="contain"
                    pointerEvents="none"
                    accessible={false}
                  />
                  <AppButton
                    label="Cancelar"
                    variant="secundario"
                    onPress={onClose}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
