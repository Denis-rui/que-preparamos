import { StyleSheet, Text, View } from "react-native";

export default function Crear(){
    
    return(
        <View style={styles.contenedor}>
            <Text>Aquí va pantalla de crear</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#FFFCF2',
        justifyContent: 'center',
    },
});