import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { styles } from "../../styles/modalValoracion.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCalificar: (puntaje: number) => void;
};

export default function ModalValoracion({ visible, onClose, onCalificar }: Props) {
  const [seleccion, setSeleccion] = useState(0);

  const cerrar = () => {
    setSeleccion(0);
    onClose();
  };

  const calificar = () => {
    onCalificar(seleccion);
    setSeleccion(0);
  };

  return (
    <Modal 
        visible={visible} 
        transparent 
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={cerrar}
    >
      <View style={styles.fondo}>
        <View style={styles.card}>
          <Pressable onPress={cerrar} style={styles.cerrar} hitSlop={10}>
            <MaterialCommunityIcons name="close" size={28} color="#756B64" />
          </Pressable>

          <Text style={styles.titulo}>Califica esta receta</Text>

          <View style={styles.gorros}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} onPress={() => setSeleccion(i)} hitSlop={6}>
                <MaterialCommunityIcons
                  name="chef-hat"
                  size={44}
                  color={i <= seleccion ? "#FF4F0A" : "#C9C1B8"}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={calificar}
            disabled={seleccion === 0}
            style={[styles.boton, seleccion === 0 && styles.botonDeshabilitado]}
          >
            <Text style={styles.botonTexto}>Calificar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}