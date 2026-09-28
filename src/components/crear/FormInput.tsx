import { StyleSheet, TextInput, View } from "react-native";

interface FormInputProps {
  placeholder: string;
  multiline?: boolean;
}

export const FormInput = ({ placeholder, multiline }: FormInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        multiline={multiline}
        placeholderTextColor="#999"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#E4E4E4",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
