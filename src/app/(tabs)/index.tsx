import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.tituloCategoria}>Categorías</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tituloCategoria: {
    fontWeight: "700",
    fontSize: 17,
    color: "#552414",
    marginLeft: -4,
  },
});
