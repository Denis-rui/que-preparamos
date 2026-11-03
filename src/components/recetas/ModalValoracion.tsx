import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { styles } from "../../styles/modalValoracion.styles";
import { IconoGorroChef } from "./IconoGorroChef";

type Props = {
  visible: boolean;
  editando?: boolean;
  puntuacionActual?: number | null;
  guardando?: boolean;
  exito?: boolean;
  error?: string | null;
  onClose: () => void;
  onCalificar: (puntaje: number) => void;
};

export default function ModalValoracion({
  visible,
  editando = false,
  puntuacionActual = null,
  guardando = false,
  exito = false,
  error = null,
  onClose,
  onCalificar,
}: Props) {
  const [seleccion, setSeleccion] = useState(0);

  useEffect(() => {
    setSeleccion(visible ? (puntuacionActual ?? 0): 0);
  }, [visible, puntuacionActual]);

  const sinCambios = editando && seleccion === puntuacionActual;
  const deshabilitado = seleccion === 0 || guardando || sinCambios;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.fondo}>
        <View style={styles.card}>
          {exito ? (
            <>
              <View style={styles.iconoGracias}>
                <IconoGorroChef lleno size={72} />
              </View>

              <Text style={[styles.titulo, styles.tituloGracias]}>
                {editando ? "¡Calificación actualizada!" : "¡Gracias por tu calificación!"}
              </Text>

              <Text style={styles.mensajeGracias}>
                Tu opinión ayuda a que esta receta tenga más posibilidades de
                aparecer a otras personas.
              </Text>

              <Pressable onPress={onClose} style={styles.boton}>
                <Text style={styles.botonTexto}>Aceptar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={onClose} style={styles.cerrar} hitSlop={10}>
                <MaterialCommunityIcons name="close" size={28} color="#756B64" />
              </Pressable>

              <Text style={styles.titulo}>{editando ? "Edita tu calificación" : "Califica esta receta"}</Text>

              <View style={styles.gorros}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Pressable
                    key={i}
                    onPress={() => setSeleccion(i)}
                    disabled={guardando}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={`Calificar con ${i} de 5 gorros`}
                  >
                    <IconoGorroChef lleno={i <= seleccion} size={44} />
                  </Pressable>
                ))}
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                onPress={() => onCalificar(seleccion)}
                disabled={deshabilitado}
                style={[styles.boton, deshabilitado && styles.botonDeshabilitado]}
              >
                <Text style={styles.botonTexto}>
                  {guardando ? "Guardando..." : editando ? "Actualizar" : "Calificar"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}