import AccesoCrear from "@/components/crear/accesoCrear";
import FormularioCrear from "@/components/crear/formularioCrear";
import { BotonVolver } from "@/components/ui/botonVolver";
import useAccesoCrear from "@/hooks/useAccesoCrear";
import { stylesCrear } from "@/styles/formulariocrear.styles";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const volver = () => router.dismissTo("/mis-recetas");

const EditarBorrador = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    usuarioId,
    estadoAcceso,
    mensajeError,
    comprobarAcceso,
    avisoAcceso,
  } = useAccesoCrear();

  if (
    estadoAcceso === "permitido" &&
    usuarioId !== null &&
    typeof id === "string"
  ) {
    return (
      <FormularioCrear
        key={usuarioId + ":" + id}
        usuarioId={usuarioId}
        borradorId={id}
        avisoAcceso={avisoAcceso}
        alVolver={volver}
      />
    );
  }

  return (
    <SafeAreaView style={stylesCrear.pantalla}>
      <View style={stylesCrear.contenido}>
        <BotonVolver variante="blanco" onPress={volver} />
      </View>
      {estadoAcceso === "permitido" ? (
        <Text style={stylesCrear.avisoAcceso}>
          Este borrador no está disponible.
        </Text>
      ) : (
        <AccesoCrear
          estado={estadoAcceso}
          mensajeError={mensajeError}
          iniciarSesion={() =>
            router.push({
              pathname: "/login",
              params: { volverA: "/mis-recetas" },
            })
          }
          reintentar={comprobarAcceso}
        />
      )}
    </SafeAreaView>
  );
};

export default EditarBorrador;
