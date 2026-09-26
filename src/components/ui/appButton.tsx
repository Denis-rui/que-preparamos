import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primario" | "secundario";
  icon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const AppButton = ({
  label,
  onPress,
  variant = "primario",
  icon,
  loading = false,
  loadingLabel = "Cargando...",
}: Props) => {
  const isPrimary = variant === "primario";

  return (
    <Pressable
      style={({ pressed }) => [
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        styles.content,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <>
          <ActivityIndicator color={isPrimary ? "#fff" : "#1A1A1A"} size="small" />
          <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>
            {loadingLabel}
          </Text>
        </>
      ) : (
        <>
          <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>
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