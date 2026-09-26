import { CategoriasInicio } from "@/components/CategoriasInicio";
import { RecetasAleatorias } from "@/components/RecetasAleatorias";

import { useCategorias } from "@/hooks/useCategorias";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { categorias, loading, error } = useCategorias();

  const cabeceraCategorias = (
    <View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3E2723"
          style={{ marginTop: 30 }}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <CategoriasInicio categorias={categorias}></CategoriasInicio>
      )}
    </View>
  );

  return (
    <SafeAreaView>
      <RecetasAleatorias ComponenteCabecera={cabeceraCategorias} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Para que la vista ocupe toda la pantalla
    backgroundColor: "#fff", // O el color de fondo general de tu app
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
