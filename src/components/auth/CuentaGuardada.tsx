import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import type { CuentaRecordada } from "@/storage/cuentas";

import { styles } from "@/styles/auth.styles";

export type CuentaGuardadaData = CuentaRecordada;

type Props = {
  name: string;
  email: string;
  photoUri?: string;
  /** "lista": avatar grande (tarjeta de "Elegir cuenta"). "modal": avatar pequeño (encabezado del modal). */
  size?: "lista" | "modal";
};

const AVATAR_SIZE = {
  lista: { width: 60, height: 60 },
  modal: { width: 44, height: 44 },
};

export function CuentaGuardada({ name, email, photoUri, size = "lista" }: Props) {
  const [errorFoto, setErrorFoto] = useState(false);
  useEffect(() => setErrorFoto(false), [photoUri]);
  const mostrarFoto = Boolean(photoUri) && !errorFoto;
  return (
    <>
      <Image
        source={mostrarFoto ? { uri: photoUri } : require("../../assets/SVG/iconos/avatar_naranja.svg")}
        style={[styles.avatar, AVATAR_SIZE[size], { borderRadius: AVATAR_SIZE[size].width / 2 }]}
        contentFit={mostrarFoto ? "cover" : "contain"}
        onError={() => setErrorFoto(true)}
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
