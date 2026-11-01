import { EstadoAccesoCrear } from "@/hooks/useAccesoCrear";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../ui/appButton";

interface Props {
  estado: EstadoAccesoCrear;
  mensajeError: string | null;
  iniciarSesion: () => void;
  reintentar: () => void;
}

const accesoCrear = ({
  estado,
  mensajeError,
  iniciarSesion,
  reintentar,
}: Props) => {
  return (
    <SafeAreaView style={styles.pantalla} edges={["top", "left", "right"]}>
      <View style={styles.contenido}>
        {estado === "comprobado" && (
          <>
            <ActivityIndicator size={"large"} color={"#552414"} />
            <Text style={styles.texto}>Comprobando sesion...</Text>
          </>
        )}
        {estado === "invitado" && (
          <>
            <Text style={styles.titulo}>Nueva Receta</Text>
            <Text style={styles.texto}>
              Debes iniciar sesión para crear una receta.
            </Text>
            <AppButton label="Iniciar Sesion" onPress={iniciarSesion} />
          </>
        )}

        {estado === "error" && (
          <>
            <Text style={styles.titulo}>Error</Text>
            <Text style={styles.texto}>
              {mensajeError || "Ha ocurrido un error al comprobar el acceso."}
            </Text>
            <AppButton label="Reintentar" onPress={reintentar} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default accesoCrear;
const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#FFFCF2",
  },
  contenido: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  titulo: {
    fontFamily: "Coiny_400Regular",
    fontSize: 29,
    color: "#552414",
    textAlign: "center",
  },
  texto: {
    fontSize: 16,
    color: "#552414",
    textAlign: "center",
  },
});
