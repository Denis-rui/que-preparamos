import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/appButton";
import { getRegisterStyles } from "@/styles/register.styles";

type FormData = {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  nombre?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Register() {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getRegisterStyles(height - insets.top - insets.bottom);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 12) {
      newErrors.password = "La contraseña debe tener al menos 12 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    // TODO: Integrar con API de Laravel para crear cuenta
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  const getInputStyle = (field: string, hasError: boolean) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    hasError && styles.inputError,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.page}>
              <Pressable
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.pressed,
                ]}
                onPress={() =>
                  router.canGoBack() ? router.back() : router.replace("/login")
                }
                accessibilityRole="button"
                accessibilityLabel="Volver al login"
              >
                <Image
                  source={require("../assets/SVG/iconos/volver.svg")}
                  style={styles.backIcon}
                  contentFit="contain"
                />
              </Pressable>

              <View style={styles.brand}>
                <View
                  style={styles.logoRow}
                  accessible
                  accessibilityLabel="¿Qué preparamos?"
                >
                  <Image
                    source={require("../assets/imagenes/icono_sombrero_chef.png")}
                    style={styles.chefHat}
                    contentFit="contain"
                  />
                  <Image
                    source={require("../assets/imagenes/titulo.png")}
                    style={styles.titleLogo}
                    contentFit="contain"
                  />
                </View>
                <View style={styles.taglineRow}>
                  <View style={styles.taglineText}>
                    <Text
                      style={styles.taglineFirstLine}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      Buenas comidas,
                    </Text>
                    <Text
                      style={styles.taglineSecondLine}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      mejores momentos
                    </Text>
                  </View>
                  <Image
                    source={require("../assets/SVG/iconos/corazon_contorno.svg")}
                    style={styles.taglineHeart}
                    contentFit="contain"
                  />
                </View>
                <Image
                  source={require("../assets/SVG/ilustraciones/chef_elegir_cuenta_con_adornos.svg")}
                  style={styles.chef}
                  contentFit="contain"
                />
                <View style={styles.headingRow}>
                  <Image
                    source={require("../assets/SVG/adornos/hojas_izquierda.svg")}
                    style={styles.headingLeaves}
                    contentFit="contain"
                  />
                  <Text accessibilityRole="header" style={styles.heading}>
                    Crear cuenta
                  </Text>
                  <Image
                    source={require("../assets/SVG/adornos/hojas_derecha.svg")}
                    style={styles.headingLeaves}
                    contentFit="contain"
                  />
                </View>
              </View>

              <View style={styles.formCard}>
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nombre completo</Text>
                    <TextInput
                      style={getInputStyle("nombre", !!errors.nombre)}
                      placeholder="Tu nombre"
                      placeholderTextColor="#9D9DA7"
                      value={formData.nombre}
                      onChangeText={(value) => handleInputChange("nombre", value)}
                      onFocus={() => setFocusedField("nombre")}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="words"
                      autoComplete="name"
                      textContentType="name"
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                    {errors.nombre ? (
                      <Text style={styles.errorText}>{errors.nombre}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      ref={emailRef}
                      style={getInputStyle("email", !!errors.email)}
                      placeholder="tu@email.com"
                      placeholderTextColor="#9D9DA7"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange("email", value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    {errors.email ? (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Contraseña</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        ref={passwordRef}
                        style={getInputStyle("password", !!errors.password)}
                        placeholder="Mínimo 12 caracteres"
                        placeholderTextColor="#9D9DA7"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange("password", value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                      />
                      <Pressable
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        <Image
                          source={
                            showPassword
                              ? require("../assets/SVG/iconos/ojo.svg")
                              : require("../assets/SVG/iconos/ojo_cerrado.svg")
                          }
                          style={styles.passwordToggleIcon}
                          contentFit="contain"
                        />
                      </Pressable>
                    </View>
                    {errors.password ? (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                    <TextInput
                      ref={confirmPasswordRef}
                      style={getInputStyle("confirmPassword", !!errors.confirmPassword)}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor="#9D9DA7"
                      value={formData.confirmPassword}
                      onChangeText={(value) =>
                        handleInputChange("confirmPassword", value)
                      }
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      textContentType="newPassword"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    {errors.confirmPassword ? (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    ) : null}
                  </View>

                  <AppButton
                    label="Crear cuenta →"
                    onPress={handleSubmit}
                    loading={isLoading}
                    loadingLabel="Creando cuenta..."
                  />

                  <Pressable
                    style={({ pressed }) => [
                      styles.loginLink,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Ya tengo cuenta, ir a iniciar sesión"
                  >
                    <Text style={styles.loginLinkText}>¿Ya tienes cuenta?</Text>
                    <Text style={styles.loginLinkButton}>Inicia sesión</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}