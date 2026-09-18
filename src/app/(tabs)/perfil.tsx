import { StyleSheet, Text, View } from "react-native";

export default function Perfil(){

    return(

        <View style= {styles.contenedor}>
            <Text>Aquí va la pantalla de {"\n"}Mi perfil</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#FFFCF2',
        justifyContent: 'center',
    }
});