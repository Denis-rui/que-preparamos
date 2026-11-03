import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
} from "react-native";

type Props = {
  // El valor es la cadena completa, por ejemplo "012345".
  value: string;
  onChangeText: (codigo: string) => void;
  deshabilitado?: boolean;
};

// La cantidad de casillas coincide con el código de 6 dígitos del backend.
const CANTIDAD_DIGITOS = 6;

// Separa el código en el arreglo de dígitos que va en cada casilla.
function construirDigitos(value: string): string[] {
  // Una casilla por dígito; si value es "123" solo las tres primeras
  // casillas tienen número y las demás quedan vacías.
  return Array.from(
    { length: CANTIDAD_DIGITOS },
    (_, indice) => value[indice] ?? "",
  );
}

// Seis casillas para escribir el código numérico. Cada casilla avanza el
// foco a la siguiente al escribir, retrocede al borrar y acepta pegar
// el código completo en la casilla que tenga el foco.
function CampoCodigo({ value, onChangeText, deshabilitado = false }: Props) {
  // Una referencia (ref) por cada casilla para poder mover el foco.
  // TextInputInstance es el tipo de la casilla real enfocable.
  const referencias = useRef<(TextInputInstance | null)[]>([]);
  // Guardamos qué casilla está activa para resaltarla con borde naranja.
  const [enfoque, setEnfoque] = useState<number | null>(null);

  const digitos = construirDigitos(value);

  // Al limpiar el código (p. ej. tras reenviar) el foco vuelve al inicio.
  // El efecto solo actúa cuando value queda vacío.
  useEffect(() => {
    if (value === "") {
      referencias.current[0]?.focus();
    }
  }, [value]);

  function manejarCambio(indice: number, texto: string) {
    // Conservamos solo números: el código no admite letras ni espacios.
    const textoLimpio = texto.replace(/\D/g, "");
    if (!textoLimpio) return;

    const nuevos = construirDigitos(value);
    const digitosLlegados = textoLimpio.split("");
    // Si la persona pega varios dígitos en una casilla, se reparten
    // desde esa casilla hacia la derecha.
    for (let i = 0; i < digitosLlegados.length; i += 1) {
      if (indice + i >= CANTIDAD_DIGITOS) break;
      nuevos[indice + i] = digitosLlegados[i];
    }

    onChangeText(nuevos.join(""));

    // Movemos el foco a la casilla siguiente a la última escrita.
    const ultimaEscrita = Math.min(
      indice + digitosLlegados.length,
      CANTIDAD_DIGITOS,
    );
    const destino = Math.max(0, Math.min(ultimaEscrita, CANTIDAD_DIGITOS - 1));
    referencias.current[destino]?.focus();
  }

  function manejarTecla(indice: number, tecla: string) {
    if (tecla !== "Backspace") return;
    // Con la casilla vacía, el borrado regresa y limpia la anterior.
    // Solo ocurre en el último dígito escrito, así que el resto no se
    // desplaza de posición.
    if ((value[indice] ?? "") !== "" || indice === 0) return;

    referencias.current[indice - 1]?.focus();
    const nuevos = construirDigitos(value);
    nuevos[indice - 1] = "";
    onChangeText(nuevos.join(""));
  }

  return (
    <View
      style={[styles.fila, deshabilitado && styles.filaDeshabilitada]}
      accessibilityLabel="Código de 6 dígitos"
    >
      {digitos.map((digito, indice) => (
        <TextInput
          key={indice}
          ref={(ref) => {
            referencias.current[indice] = ref;
          }}
          style={[styles.caja, enfoque === indice && styles.cajaEnfocada]}
          value={digito}
          onChangeText={(texto) => manejarCambio(indice, texto)}
          onKeyPress={({ nativeEvent }) => manejarTecla(indice, nativeEvent.key)}
          onFocus={() => setEnfoque(indice)}
          onBlur={() => setEnfoque(null)}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          editable={!deshabilitado}
          accessibilityLabel={`Dígito ${indice + 1} del código`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  filaDeshabilitada: { opacity: 0.6 },
  caja: {
    width: 46,
    height: 58,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E8E2D9",
    borderRadius: 14,
    paddingHorizontal: 0,
    paddingVertical: 6,
    textAlign: "center",
    color: "#512013",
    fontFamily: "Inter_800ExtraBold",
    fontSize: 24,
  },
  cajaEnfocada: { borderColor: "#FF5008" },
});

export { CampoCodigo };
