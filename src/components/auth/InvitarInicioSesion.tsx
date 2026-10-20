import { styles } from "@/styles/invitarInicioSesion.styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { Modal, Pressable, Text, View } from 'react-native';
import { AppButton } from '../ui/appButton';

interface Props {
    visible: boolean;
    onClose: ()=> void;
    titulo?: string;
    mensaje?: string;
    volverA?: string;
}

export const InvitarInicioSesion = ({
    visible,
    onClose,
    titulo= "¡Inicia sesión para calificar!",
    mensaje = "Tu opinión ayuda a otros a elegir qué preparar. Ingresa a tu cuenta para calificar esta receta.",
    volverA,
}:Props) => {

    const irALogin = ()=>{
        onClose();
        router.push({
            pathname: "/login",
            params: volverA ? {volverA} : {},
        });
    }

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
            <View style={styles.card} accessibilityViewIsModal>
                <Pressable
                    onPress={onClose}
                    style={styles.cerrar}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar"
                >
                    <MaterialCommunityIcons name="close" size={28} color="#756B64"/>
                </Pressable>

                <View style={styles.iconoCirculo}>
                    <MaterialCommunityIcons name="chef-hat" size={34} color="#FF4F0A" />
                </View>

                <Text style={styles.titulo} accessibilityRole="header">
                    {titulo}
                </Text>
                <Text style={styles.mensaje}>{mensaje}</Text>

                <View style={styles.acciones}>
                    <AppButton label="Iniciar sesión" onPress={irALogin}/>
                    <AppButton label="Ahora no" variant="secundario" onPress={onClose}/>
                </View>
            </View>
        </View>
    </Modal>
  )
}
