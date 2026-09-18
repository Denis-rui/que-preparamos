import { StyleSheet, Text, View } from "react-native";

export default function Explorar(){

  return (

    <View style={styles.contenedor}>
      <Text>Aqui va la pantalla de explorar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#FFFCF2',
    justifyContent: 'center',
  },
  texto: {
    flex: 1,
  }
});