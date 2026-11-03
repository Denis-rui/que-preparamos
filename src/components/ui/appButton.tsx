import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primario" | "secundario";
  icon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
}

export const AppButton = ({
  label,
  onPress,
  variant = "primario",
  icon,
  loading = false,
  loadingLabel = "Cargando...",
  disabled = false,
}: Props) => {
  const isPrimary = variant === "primario";
  const inhabilitado = loading || disabled;
  return (
    <Pressable
      style={({ pressed }) => [
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        styles.content,
        pressed && styles.pressed,
        inhabilitado && styles.disabled,
      ]}
      onPress={onPress}
      disabled={inhabilitado}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: inhabilitado,
        busy: loading,
      }}
    >
      {loading ? (
        <>
          <ActivityIndicator
            color={isPrimary ? "#fff" : "#1A1A1A"}
            size="small"
          />
          <Text
            style={
              isPrimary ? styles.primaryButtonText : styles.secondaryButtonText
            }
          >
            {loadingLabel}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={
              isPrimary ? styles.primaryButtonText : styles.secondaryButtonText
            }
          >
            {label}
          </Text>
          {icon}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#FF4F0A",
    paddingVertical: 16,
    borderRadius: 30,
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
  },
  secondaryButtonText: {
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});
