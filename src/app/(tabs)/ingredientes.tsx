import { styles } from '@/styles/mis_ingredientes.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ingredientesEjemplo = ['Pollo', 'Arroz', 'Tomate', 'Cebolla'];

export default function Ingredientes() {
  return (
    <SafeAreaView style={styles.contenedor} edges={["top", "left", "right"]}>
      <View style={styles.seccionSuperior}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
            style={[styles.hoja, styles.hoja_izquierda]}
            contentFit="contain"
          />
          <Text style={styles.titulo}>Mis ingredientes</Text>
          <Image
            source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
            style={[styles.hoja, styles.hoja_derecha]}
            contentFit="contain"
          />
        </View>

        <Image
          source={require('../../assets/imagenes/imagen_de_mis_ing.png')}
          style={styles.mascota}
          contentFit="contain"
        />

        <View style={styles.busquedaContenedor}>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="magnify" size={18} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Escribe un ingrediente"
              placeholderTextColor="#999"
            />
          </View>

          <Pressable style={styles.botonAgregar}>
            <Text style={styles.botonAgregarTexto}>Agregar</Text>
          </Pressable>

          <Pressable style={styles.botonCategorias}>
            <Text style={styles.botonCategoriasTexto}>Categorías</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#333" />
          </Pressable>
        </View>

        <View style={styles.ingredientesHeader}>
          <View style={styles.ingredientesHeaderIzq}>
            <Image
              source={require('../../assets/SVG/iconos/icono ingredientes añadidos.svg')}
              contentFit="contain"
              style={styles.taza}
            />
            <Text style={styles.ingredientesTitulo}>Ingredientes añadidos</Text>
          </View>
          <Pressable style={styles.limpiarBoton}>
            <MaterialCommunityIcons name="trash-can-outline" size={16} color="#4CAF50" />
            <Text style={styles.limpiarTexto}>Limpiar todo</Text>
          </Pressable>
        </View>

        <View style={styles.chipsContenedor}>
          <ScrollView nestedScrollEnabled showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsFila}>
              {ingredientesEjemplo.map((nombre) => (
                <View key={nombre} style={styles.chip}>
                  <Text style={styles.chipTexto}>{nombre}</Text>
                  <MaterialCommunityIcons name="close" size={16} color="#552414" />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.seccionInferior}>
        <View style={styles.filaBotonBuscar}>
            <Image
                source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                style={styles.adornoBoton}
                contentFit="contain"
            />
            <Pressable style={styles.botonBuscar}>
                <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
                <Text style={styles.botonBuscarTexto}>Buscar recomendaciones</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </Pressable>
            <Image
                source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                style={styles.adornoBoton}
                contentFit="contain"
            />
        </View>

        <View style={styles.tipContenedor}>
          <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#552414" />
          <Text style={styles.tipTexto}>
            Te mostraremos recetas que puedes preparar y lo que te falta
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}