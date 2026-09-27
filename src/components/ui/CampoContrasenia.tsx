import { Image } from "expo-image";
import { Ref, forwardRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

import { styles } from "@/styles/auth.styles";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  label?: string;
  showLabel?: boolean;
  placeholder?: string;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: () => void;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
};

function CampoContrasenaInner(
  {
    value,
    onChangeText,
    error,
    label = "Contraseña",
    showLabel = true,
    placeholder = "Contraseña",
    returnKeyType = "done",
    onSubmitEditing,
    autoComplete = "password",
    textContentType = "password",
  }: Props,
  ref: Ref<TextInput>,
) {
  const [focused, setFocused] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  return (
    <View style={styles.inputGroup}>
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          !!error && styles.inputRowError,
        ]}
      >
        <Image
          source={require("../../assets/SVG/iconos/candado_blanco.svg")}
          style={styles.inputIcon}
          contentFit="contain"
        />
        <TextInput
          ref={ref}
          style={styles.inputField}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9D9DA7"
          secureTextEntry={!mostrar}
          autoCapitalize="none"
          autoComplete={autoComplete}
          textContentType={textContentType}
          accessibilityLabel={label}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Pressable
          style={styles.passwordToggle}
          onPress={() => setMostrar((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={
            mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          <Image
            source={
              mostrar
                ? require("../../assets/SVG/iconos/ojo.svg")
                : require("../../assets/SVG/iconos/ojo_cerrado.svg")
            }
            style={styles.passwordToggleIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export const CampoContrasena = forwardRef(CampoContrasenaInner);
