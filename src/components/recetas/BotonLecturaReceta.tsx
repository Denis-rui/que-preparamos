import { styles } from "@/styles/receta.styles";
import type { PasoReceta } from "@/types/receta";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useCallback, useRef, useState } from "react";
import { Pressable } from "react-native";

function dividirTexto(texto: string) {
  const partes: string[] = [];
  let inicio = 0;

  while (inicio < texto.length) {
    const limite = Math.min(inicio + Speech.maxSpeechInputLength, texto.length);
    const espacio = limite < texto.length ? texto.lastIndexOf(" ", limite) : -1;
    const fin = espacio > inicio ? espacio : limite;

    partes.push(texto.slice(inicio, fin).trim());
    inicio = fin;
  }

  return partes.filter(Boolean);
}

export function BotonLecturaReceta({ pasos }: { pasos: PasoReceta[] }) {
  const [leyendo, setLeyendo] = useState(false);
  const secuencia = useRef(0);
  const activa = useRef(false);

  const detener = useCallback(() => {
    if (!activa.current) return;

    activa.current = false;
    secuencia.current += 1; // Ignora los avisos tardíos de la lectura detenida.
    setLeyendo(false);
    void Speech.stop().catch(() => {});
  }, []);

  // Detiene la lectura incluso si la pantalla sigue montada en el historial.
  useFocusEffect(useCallback(() => detener, [detener]));

  function alternar() {
    if (activa.current) {
      detener();
      return;
    }

    // Divide los pasos largos para respetar el límite de Expo Speech.
    const partes = pasos.flatMap(({ orden, instruccion }) =>
      dividirTexto("Paso " + orden + ". " + instruccion),
    );
    if (partes.length === 0) return;

    const turno = ++secuencia.current;
    activa.current = true;
    setLeyendo(true);

    function finalizar() {
      if (turno !== secuencia.current) return;
      activa.current = false;
      setLeyendo(false);
    }

    function leer(indice: number) {
      if (turno !== secuencia.current) return;
      if (indice === partes.length) {
        finalizar();
        return;
      }

      Speech.speak(partes[indice], {
        language: "es-ES",
        onDone: () => leer(indice + 1),
        onStopped: finalizar,
        onError: finalizar,
      });
    }

    leer(0);
  }

  return (
    <Pressable
      onPress={alternar}
      disabled={pasos.length === 0}
      accessibilityRole="button"
      accessibilityLabel={leyendo ? "Detener lectura" : "Escuchar preparación"}
      accessibilityState={{ disabled: pasos.length === 0 }}
      style={styles.botonAudio}
      hitSlop={6}
    >
      <MaterialCommunityIcons
        name={leyendo ? "stop" : "play"}
        size={20}
        color="#FF4F0A"
      />
    </Pressable>
  );
}
