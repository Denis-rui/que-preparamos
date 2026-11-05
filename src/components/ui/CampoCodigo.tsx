import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
} from "react-native";

type Props = {
  // Un elemento por casilla: "" cuando la casilla está vacía.
  value: string[];
  onChangeText: (digitos: string[]) => void;
  deshabilitado?: boolean;
};

// La cantidad de casillas coincide con el código de 6 dígitos del backend.
const CANTIDAD_DIGITOS = 6;

// Crea el arreglo inicial: seis casillas vacías.
function crearCodigoVacio(): string[] {
  return Array.from({ length: CANTIDAD_DIGITOS }, () => "");
}

// Normaliza el valor a una casilla por dígito, por si llega incompleto.
function construirDigitos(value: string[]): string[] {
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
  // El efecto solo actúa cuando todas las casillas están vacías.
  useEffect(() => {
    if (value.every((digito) => digito === "")) {
      referencias.current[0]?.focus();
    }
  }, [value]);

  function manejarCambio(indice: number, texto: string) {
    // Conservamos solo números: el código no admite letras ni espacios.
    const textoLimpio = texto.replace(/\D/g, "");
    const nuevos = construirDigitos(value);

    // Borrar: la casilla quedó vacía. Solo se limpia esa casilla; los
    // demás dígitos se quedan donde están.
    if (textoLimpio === "") {
      // Si la casilla ya estaba vacía no hay nada que borrar.
      if ((nuevos[indice] ?? "") === "") return;
      nuevos[indice] = "";
      onChangeText(nuevos);
      return;
    }

    const digitoActual = nuevos[indice];
    const digitosLlegados = textoLimpio.split("");
    let cantidadEscrita = digitosLlegados.length;

    // Si la casilla ya tenía un dígito y se escribe encima sin seleccionarlo,
    // el teclado entrega el dígito anterior junto con el nuevo. En ese caso
    // reemplazamos el contenido en vez de mover el dígito a la casilla
    // siguiente, y avanzamos solo una posición.
    if (digitoActual !== "" && digitosLlegados.length === 2) {
      nuevos[indice] =
        digitosLlegados[0] === digitoActual
          ? digitosLlegados[1]
          : digitosLlegados[0];
      cantidadEscrita = 1;
    } else {
      // Si la persona pega varios dígitos en una casilla, se reparten
      // desde esa casilla hacia la derecha.
      for (let i = 0; i < digitosLlegados.length; i += 1) {
        if (indice + i >= CANTIDAD_DIGITOS) break;
        nuevos[indice + i] = digitosLlegados[i];
      }
    }

    onChangeText(nuevos);

    // Movemos el foco a la casilla siguiente a la última escrita.
    const destino = Math.min(indice + cantidadEscrita, CANTIDAD_DIGITOS - 1);
    referencias.current[destino]?.focus();
  }

  function manejarTecla(indice: number, tecla: string) {
    if (tecla !== "Backspace") return;
    // Con la casilla vacía, el borrado regresa a la casilla anterior y
    // limpia ese dígito.
    if ((value[indice] ?? "") !== "" || indice === 0) return;

    referencias.current[indice - 1]?.focus();
    const nuevos = construirDigitos(value);
    nuevos[indice - 1] = "";
    onChangeText(nuevos);
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
          selectTextOnFocus
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

export { CampoCodigo, crearCodigoVacio };
