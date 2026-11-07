import { AppButton } from "@/components/ui/appButton";
import { BotonVolver } from "@/components/ui/botonVolver";
import useAccesoCrear from "@/hooks/useAccesoCrear";
import { router } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MisRecetas = () => {
  const {
    estadoAcceso,
    mensajeError,
    comprobarAcceso,
    avisoAcceso,
    usuarioId,
  } = useAccesoCrear();

  const abrirLogin = () => {
    router.push({
      pathname: "/login",
      params: {
        volverA: "/mis-recetas",
      },
    });
  };
  const accesoPermitido = estadoAcceso === "permitido" && usuarioId !== null;

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.encabezado}>
        <BotonVolver variante="blanco" rutaAlternativa="/(tabs)/mi-perfil" />
        <Text accessibilityRole="header" style={styles.titulo}>
          Mis Recetas
        </Text>
      </View>

      <View style={[styles.contenido, { justifyContent: "center" }]}>
        {estadoAcceso === "comprobado" && (
          <>
            <ActivityIndicator size="large" color="#FF5008" />

            <Text style={styles.texto}>Cargando tus recetas...</Text>
          </>
        )}

        {estadoAcceso === "invitado" && (
          <>
            <Text style={[styles.texto, { textAlign: "center" }]}>
              Inicia sesión para consultar y administrar tus recetas.
            </Text>

            <AppButton label="Iniciar sesión" onPress={abrirLogin} />
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
          </>
        )}
        {estadoAcceso === "error" && (
          <>
            <Text accessibilityRole="alert" style={styles.texto}>
              {mensajeError ?? "No pudimos comprobar tu acceso."}
            </Text>

            <AppButton
              label="Reintentar"
              onPress={() => {
                void comprobarAcceso();
              }}
            />
          </>
        )}
        {accesoPermitido && (
          <View key={usuarioId} style={styles.bloque}>
            {avisoAcceso && (
              <Text accessibilityRole="alert" style={styles.texto}>
                {avisoAcceso}
              </Text>
            )}

            {/* Base temporal: los listados se incorporan en el paso 3. */}
            <Text style={styles.texto}>Consulta y administra tus recetas.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MisRecetas;
const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#FFFCF2",
  },

  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },

  titulo: {
    flex: 1,
    fontFamily: "Coiny_400Regular",
    fontSize: 28,
    color: "#552414",
  },

  contenido: {
    flex: 1,
    padding: 20,
    gap: 16,
  },

  bloque: {
    gap: 16,
  },

  texto: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#552414",
  },
});
