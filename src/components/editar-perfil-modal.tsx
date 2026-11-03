import { styles } from "@/styles/editar-perfil.styles";
import { obtenerMensajeError } from "@/utils/mensajeError";
import type { EditableProfile, FotoPerfil } from "@/types/perfil";
import { validarFotoPerfil } from "@/utils/fotoPerfil";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState, type ComponentRef } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isAxiosError } from "axios";

export type { EditableProfile } from "@/types/perfil";
type Props = {
  profile: EditableProfile;

  guardando: boolean;
  // La descarga de la foto de perfil también requiere el token de la sesión.
  fotoHeaders?: Record<string, string>;

  onClose: () => void;
  // Sin foto nueva, el guardado conserva la imagen existente del servidor.
  onSave: (
    profile: EditableProfile,
    currentPassword?: string,
    foto?: FotoPerfil,
  ) => Promise<void>;
};

export default function EditarPerfilModal({
  profile,
  guardando,
  fotoHeaders,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);
  // Guardamos el archivo aparte de la URI que se usa para mostrar la vista previa.
  const [fotoSeleccionada, setFotoSeleccionada] = useState<FotoPerfil | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(false);

  const emailInput = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordInput = useRef<ComponentRef<typeof TextInput>>(null);
  const enviando = useRef(false);
  const insets = useSafeAreaInsets();

  const cambiaCorreo = email.trim() !== profile.email;
  const bloqueado = guardando || picking;

  function cerrar() {
    if (bloqueado || enviando.current) return;
    onClose();
  }

  async function choosePhoto() {
    if (bloqueado || enviando.current) return;
    setPicking(true);
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        const imagen = result.assets[0];

        // El backend admite JPG, PNG o WEBP de hasta 2048 KiB.
        // Si faltan metadatos, la validación definitiva corresponde al servidor.
        try {
          validarFotoPerfil(imagen);
        } catch (error) {
          setError(error instanceof Error ? error.message : "No pudimos validar la foto.");
          return;
        }

        // Cancelar o elegir un archivo inválido no reemplaza la selección anterior.
        setPhotoUri(imagen.uri);
        setFotoSeleccionada({
          uri: imagen.uri,
          mimeType: imagen.mimeType,
          fileName: imagen.fileName,
          fileSize: imagen.fileSize,
          file: imagen.file,
        });
      }
    } catch {
      setError("No pudimos abrir tus fotos. Inténtalo nuevamente.");
    } finally {
      setPicking(false);
    }
  }

  async function save() {
    if (bloqueado || enviando.current) return;
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName) {
      setError("Escribe tu nombre completo.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }

    if (cambiaCorreo && !currentPassword) {
      setError("Ingresa tu contraseña actual para cambiar el correo.");
      passwordInput.current?.focus();
      return;
    }

    // Evitamos enviar dos veces mientras se procesa la operación.
    enviando.current = true;

    try {
      await onSave(
        {
          name: cleanName,
          email: cleanEmail,
          photoUri,
        },
        cambiaCorreo ? currentPassword : undefined,
        // Entregamos un archivo solo si el usuario eligió una foto nueva.
        fotoSeleccionada ?? undefined,
      );
    } catch (error: unknown) {
      setError(
        error instanceof Error && !isAxiosError(error)
          ? error.message
          : obtenerMensajeError(error) ?? "No pudimos guardar los cambios. Inténtalo nuevamente.",
      );
    } finally {
      enviando.current = false;
    }
  }

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={cerrar}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.safeContent,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
          ]}
        >
          <View style={styles.card} accessibilityViewIsModal>
            <ScrollView
              contentContainerStyle={styles.cardContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                onPress={cerrar}
                disabled={bloqueado}
                accessibilityRole="button"
                accessibilityLabel="Cerrar edición de perfil"
                style={({ pressed }) => [
                  styles.close,
                  pressed && styles.pressed,
                ]}
              >
                <Image
                  source={require("../assets/SVG/iconos/cerrar.svg")}
                  style={styles.closeIcon}
                  contentFit="contain"
                />
              </Pressable>

              <View style={styles.headingRow}>
                <Image
                  source={require("../assets/SVG/adornos/hojas_izquierda.svg")}
                  style={styles.leaves}
                  contentFit="contain"
                />
                <Text style={styles.heading} accessibilityRole="header">
                  Editar perfil
                </Text>
                <Image
                  source={require("../assets/SVG/adornos/hojas_derecha.svg")}
                  style={styles.leaves}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.subtitle}>Actualiza tus datos y tu foto</Text>

              <View style={styles.photoRow}>
                <Image
                  source={require("../assets/SVG/adornos/hojas_avatar_izquierda.svg")}
                  style={styles.avatarLeaves}
                  contentFit="contain"
                />
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Image
                      source={
                        photoUri
                          ? {
                              uri: photoUri,
                              // Nunca enviamos el token a la URI local de una foto nueva.
                              headers: photoUri === profile.photoUri ? fotoHeaders : undefined,
                            }
                          : require("../assets/SVG/iconos/avatar_grande.svg")
                      }
                      style={photoUri ? styles.photo : styles.avatarIcon}
                      contentFit={photoUri ? "cover" : "contain"}
                      cachePolicy="none"
                      onError={() => {
                        setError(fotoSeleccionada
                          ? "No pudimos mostrar la foto seleccionada. Prueba con otra imagen."
                          : "No pudimos descargar tu foto del servidor.");
                      }}
                    />
                  </View>
                  <Pressable
                    onPress={choosePhoto}
                    disabled={bloqueado}
                    accessibilityRole="button"
                    accessibilityLabel="Elegir foto de perfil"
                    accessibilityState={{ disabled: bloqueado }}
                    style={({ pressed }) => [
                      styles.camera,
                      (pressed || bloqueado) && styles.pressed,
                    ]}
                  >
                    <Image
                      source={require("../assets/SVG/iconos/camara.svg")}
                      style={styles.cameraIcon}
                      contentFit="contain"
                    />
                  </Pressable>
                </View>
                <Image
                  source={require("../assets/SVG/adornos/hojas_avatar_derecha.svg")}
                  style={styles.avatarLeaves}
                  contentFit="contain"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nombre completo</Text>
                <View style={styles.inputRow}>
                  <Image
                    source={require("../assets/SVG/iconos/usuario_contorno.svg")}
                    style={styles.inputIcon}
                    contentFit="contain"
                  />
                  <TextInput
                    accessibilityLabel="Nombre completo"
                    value={name}
                    onChangeText={setName}
                    editable={!bloqueado}
                    style={styles.input}
                    placeholder="Tu nombre completo"
                    placeholderTextColor="#85858D"
                    autoCapitalize="words"
                    autoComplete="name"
                    maxLength={255}
                    returnKeyType="next"
                    onSubmitEditing={() => emailInput.current?.focus()}
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputRow}>
                  <Image
                    source={require("../assets/SVG/iconos/correo_oscuro.svg")}
                    style={styles.inputIcon}
                    contentFit="contain"
                  />

                  <TextInput
                    ref={emailInput}
                    accessibilityLabel="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    editable={!bloqueado}
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#85858D"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    keyboardType="email-address"
                    maxLength={255}
                    returnKeyType={cambiaCorreo ? "next" : "done"}
                    onSubmitEditing={() => {
                      if (cambiaCorreo) {
                        passwordInput.current?.focus();
                      } else {
                        void save();
                      }
                    }}
                  />
                </View>
              </View>

              {/* Laravel exige la contraseña actual al cambiar el correo. */}
              {cambiaCorreo && (
                <View style={styles.field}>
                  <Text style={styles.label}>Contraseña actual</Text>

                  <View style={styles.inputRow}>
                    <TextInput
                      ref={passwordInput}
                      accessibilityLabel="Contraseña actual"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      editable={!bloqueado}
                      style={styles.input}
                      placeholder="Tu contraseña actual"
                      placeholderTextColor="#85858D"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="current-password"
                      returnKeyType="done"
                      onSubmitEditing={() => void save()}
                    />
                  </View>
                </View>
              )}

              {error ? (
                <Text
                  style={styles.error}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  {error}
                </Text>
              ) : null}
              <View style={styles.actions}>
                <Pressable
                  onPress={() => void save()}
                  disabled={bloqueado}
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: bloqueado,
                    busy: guardando,
                  }}
                  style={({ pressed }) => [
                    styles.save,
                    (pressed || bloqueado) && styles.pressed,
                  ]}
                >
                  <Text style={styles.saveText}>
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={cerrar}
                  disabled={bloqueado}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.cancel,
                    (pressed || bloqueado) && styles.pressed,
                  ]}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
