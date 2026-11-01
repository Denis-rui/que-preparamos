import AccesoCrear from "@/components/crear/accesoCrear";
import FormularioCrear from "@/components/crear/formularioCrear";
import useAccesoCrear from "@/hooks/useAccesoCrear";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function Crear() {
  const { estadoAcceso, mensajeError, comprobarAcceso } = useAccesoCrear();

  const abrirLogin = () => {
    router.push({
      pathname: "/login",
      params: {
        volverA: "/(tabs)/crear",
      },
    });
  };

  if (estadoAcceso !== "permitido") {
    return (
      <AccesoCrear
        estado={estadoAcceso}
        mensajeError={mensajeError}
        iniciarSesion={abrirLogin}
        reintentar={comprobarAcceso}
      />
    );
  }

  return <FormularioCrear />;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFCF2",
  },
  contenedor: {
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  flecha: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#552414",
    marginRight: 15,
  },
  tituloTexto: {
    fontFamily: "Coiny_400Regular",
    fontSize: 29,
    color: "#552414",
  },
  subirImagen: {
    backgroundColor: "#B5CEAB",
    height: 180,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  subirImagenTexto: {
    color: "#555",
    fontWeight: "500",
    fontSize: 16,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mitad: {
    width: "48%",
  },
});
