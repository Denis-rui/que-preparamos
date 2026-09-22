import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/styles/editar-perfil.styles';

export type EditableProfile = { name: string; email: string; photoUri?: string };
type Props = { profile: EditableProfile; onClose: () => void; onSave: (profile: EditableProfile) => void };

export default function EditarPerfilModal({ profile, onClose, onSave }: Props) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);
  const [error, setError] = useState('');
  const [picking, setPicking] = useState(false);
  const emailInput = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  async function choosePhoto() {
    if (picking) return;
    setPicking(true);
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    } catch {
      setError('No pudimos abrir tus fotos. Inténtalo nuevamente.');
    } finally {
      setPicking(false);
    }
  }

  function save() {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName) {
      setError('Escribe tu nombre completo.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }
    onSave({ name: cleanName, email: cleanEmail, photoUri });
  }

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.safeContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.card} accessibilityViewIsModal>
            <ScrollView contentContainerStyle={styles.cardContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar edición de perfil" style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
                <Image source={require('../assets/SVG/iconos/cerrar.svg')} style={styles.closeIcon} contentFit="contain" />
              </Pressable>

              <View style={styles.headingRow}>
                <Image source={require('../assets/SVG/adornos/hojas_izquierda.svg')} style={styles.leaves} contentFit="contain" />
                <Text style={styles.heading} accessibilityRole="header">Editar perfil</Text>
                <Image source={require('../assets/SVG/adornos/hojas_derecha.svg')} style={styles.leaves} contentFit="contain" />
              </View>
              <Text style={styles.subtitle}>Actualiza tus datos y tu foto</Text>

              <View style={styles.photoRow}>
                <Image source={require('../assets/SVG/adornos/hojas_avatar_izquierda.svg')} style={styles.avatarLeaves} contentFit="contain" />
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Image source={photoUri ? { uri: photoUri } : require('../assets/SVG/iconos/avatar_grande.svg')} style={photoUri ? styles.photo : styles.avatarIcon} contentFit={photoUri ? 'cover' : 'contain'} />
                  </View>
                  <Pressable onPress={choosePhoto} disabled={picking} accessibilityRole="button" accessibilityLabel="Elegir foto de perfil" accessibilityState={{ disabled: picking }} style={({ pressed }) => [styles.camera, (pressed || picking) && styles.pressed]}>
                    <Image source={require('../assets/SVG/iconos/camara.svg')} style={styles.cameraIcon} contentFit="contain" />
                  </Pressable>
                </View>
                <Image source={require('../assets/SVG/adornos/hojas_avatar_derecha.svg')} style={styles.avatarLeaves} contentFit="contain" />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nombre completo</Text>
                <View style={styles.inputRow}>
                  <Image source={require('../assets/SVG/iconos/usuario_contorno.svg')} style={styles.inputIcon} contentFit="contain" />
                  <TextInput accessibilityLabel="Nombre completo" value={name} onChangeText={setName} style={styles.input} placeholder="Tu nombre completo" placeholderTextColor="#85858D" autoCapitalize="words" autoComplete="name" maxLength={255} returnKeyType="next" onSubmitEditing={() => emailInput.current?.focus()} />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputRow}>
                  <Image source={require('../assets/SVG/iconos/correo_oscuro.svg')} style={styles.inputIcon} contentFit="contain" />
                  <TextInput ref={emailInput} accessibilityLabel="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} placeholder="correo@ejemplo.com" placeholderTextColor="#85858D" autoCapitalize="none" autoCorrect={false} autoComplete="email" keyboardType="email-address" maxLength={255} returnKeyType="done" onSubmitEditing={save} />
                </View>
              </View>

              {error ? <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text> : null}
              <View style={styles.actions}>
                <Pressable onPress={save} disabled={picking} accessibilityRole="button" style={({ pressed }) => [styles.save, (pressed || picking) && styles.pressed]}>
                  <Text style={styles.saveText}>Guardar cambios</Text>
                </Pressable>
                <Pressable onPress={onClose} accessibilityRole="button" style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}>
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
