import { styles } from '@/styles/mis_ingredientes.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BuscadorIngredientes } from '@/components/ingredientes/BuscadorIngredientes';
import { IconoCanastaVacia } from "@/components/ingredientes/IconoCanastaVacia";
import type { Categoria } from "@/components/ingredientes/ListaCategorias";
import { useIngredientes } from '@/hooks/useIngredientes';

function agruparEnFilas <T>(array: T[], tamano:number): T[][]{
  const resultado: T[][] = [];
  for (let i = 0; i < array.length; i += tamano) {
    resultado.push(array.slice(i, i + tamano));
  }
  return resultado;
}

export default function Ingredientes() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const {ingredientes, agregarIngrediente, quitarIngrediente, limpiarTodo} = useIngredientes();

  const buscarRecomendaciones = () => {
    router.push({
      pathname: "/recomendaciones",
      params: {
        ingredientes: ingredientes.map((i) => i.nombre).join(","),
        categoriaId: categoriaSeleccionada ? categoriaSeleccionada.id.toString() : "comidas",
      },
    });
  };
  
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

        <BuscadorIngredientes
          onAgregarIngrediente={agregarIngrediente}
          onSeleccionarCategoria={setCategoriaSeleccionada}
        />

        <View style={styles.ingredientesHeader}>
          <View style={styles.ingredientesHeaderIzq}>
            <Image
              source={require('../../assets/SVG/iconos/icono ingredientes añadidos.svg')}
              contentFit="contain"
              style={styles.taza}
            />
            <Text style={styles.ingredientesTitulo}>Ingredientes añadidos</Text>
          </View>
          <Pressable style={styles.limpiarBoton} onPress={limpiarTodo}>
            <MaterialCommunityIcons name="trash-can-outline" size={16} color="#4CAF50" />
            <Text style={styles.limpiarTexto}>Limpiar todo</Text>
          </Pressable>
        </View>

        <View style={styles.chipsContenedor}>
          {ingredientes.length === 0 ? (
            <View style={styles.mensajeVacioContenedor}>
              <IconoCanastaVacia size={64}/>
              <Text style={styles.mensajeVacioTitulo}>Aún no tienes ingredientes</Text>
              <Text style={styles.mensajeVacioTexto}>
                ¡Agrega algunos y descubre que puedes preparar!
              </Text>
            </View>
          ) : (
            <ScrollView nestedScrollEnabled showsHorizontalScrollIndicator={false}>
              {agruparEnFilas(ingredientes, 3).map((fila, index) => (
                <View key={index} style={styles.chipsFila}>
                  {fila.map((ingrediente) => (
                    <View key={ingrediente.id} style={styles.chip}>
                      <Text style={styles.chipTexto} numberOfLines={1} ellipsizeMode="tail">
                        {ingrediente.nombre}
                      </Text>
                      <Pressable onPress={() => quitarIngrediente(ingrediente.id)}>
                        <MaterialCommunityIcons name="close" size={16} color="#552414" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <View style={styles.seccionInferior}>
        <View style={styles.filaBotonBuscar}>
            <Image
                source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                style={styles.adornoBoton}
                contentFit="contain"
            />
            <Pressable 
              style={styles.botonBuscar}
              onPress={buscarRecomendaciones}
              disabled={ingredientes.length ===0}
            >
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