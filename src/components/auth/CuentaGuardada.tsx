import { Image } from "expo-image";
import { Text, View } from "react-native";

import { styles } from "@/styles/auth.styles";

export type CuentaGuardadaData = { name: string; email: string };

type Props = {
  name: string;
  email: string;
  /** "lista": avatar grande (tarjeta de "Elegir cuenta"). "modal": avatar pequeño (encabezado del modal). */
  size?: "lista" | "modal";
};

const AVATAR_SIZE = {
  lista: { width: 60, height: 60 },
  modal: { width: 44, height: 44 },
};

export function CuentaGuardada({ name, email, size = "lista" }: Props) {
  return (
    <>
      <Image
        source={require("../../assets/SVG/iconos/avatar_naranja.svg")}
        style={[styles.avatar, AVATAR_SIZE[size]]}
        contentFit="contain"
      />
      <View style={styles.accountCopy}>
        <Text style={styles.accountName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.accountEmail} numberOfLines={1}>
          {email}
        </Text>
      </View>
    </>
  );
}
