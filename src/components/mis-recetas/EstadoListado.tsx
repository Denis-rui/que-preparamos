import { ActivityIndicator, Text, View } from "react-native";
import { AppButton } from "../ui/appButton";

const EstadoListado = ({
  mensaje,
  cargando = false,
  reintentar,
}: {
  mensaje: string;
  cargando?: boolean;
  reintentar?: () => void;
}) => {
  return (
    <View>
      {cargando && <ActivityIndicator size="large" color="#FF5008" />}
      <Text style={{ textAlign: "center" }}>{mensaje}</Text>
      {reintentar && <AppButton label="Reintentar" onPress={reintentar} />}
    </View>
  );
};

export default EstadoListado;
