import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface FormSelectProps {
  placeholder: string;
}

export const FormSelect = ({ placeholder }: FormSelectProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Text style={styles.text}>{placeholder}</Text>
      <Ionicons name="chevron-down" size={20} color="#555" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E4E4E4",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#777",
    fontSize: 16,
  },
});
