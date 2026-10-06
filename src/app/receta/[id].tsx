import { styles } from "@/styles/receta.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, Path, Text as SvgText, TextPath } from "react-native-svg";

import ModalValoracion from "@/components/recetas/ModalValoracion";
import { useReceta } from "@/hooks/useReceta";
import { useEffect, useState } from "react";

export default function DetalleReceta() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { receta, loading, error } = useReceta(id);
  const [modalVisible, setModalVisible] = useState(false);
  const [leyendo, setLeyendo]= useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const alternarLectura = ()=>{
    if(leyendo){
      Speech.stop();
      setLeyendo(false);
      return;
    }

    const texto = receta.pasos
      .map((paso:any)=> `Paso ${paso.orden}. ${paso.instruccion}`)
      .join(".");

    
    Speech.speak(texto, {
      language: "es-ES",
      onDone: ()=> setLeyendo(false),
      onStopped: ()=> setLeyendo(false),
      onError: ()=> setLeyendo(false),
    });

    setLeyendo(true);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.estadoContenedor}>
        <ActivityIndicator size="large" color="#FF4F0A" />
      </SafeAreaView>
    );
  }

  if (error || !receta) {
    return (
      <SafeAreaView style={styles.estadoContenedorError}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#9C8B7A" />
        <Text style={styles.estadoTexto}>No se pudo cargar la receta.</Text>
        <Pressable onPress={() => router.back()} style={styles.estadoBotonVolver}>
          <Text style={styles.estadoBotonVolverTexto}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={["top", "left", "right", "bottom"]}>
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.botonCircular}>
          <MaterialCommunityIcons name="arrow-left-thick" size={30} color="#552414" />
        </Pressable>

        <View style={styles.logoContenedor}>
          <Image 
            source={require("../../assets/imagenes/icono_sombrero_chef.png")} 
            style={styles.logoSombrero}
            contentFit="contain"
          />

          <Image
            source={require("../../assets/imagenes/titulo.png")}
            style={styles.logoTitulo}
            contentFit="contain"
          />
        </View>

        <Pressable onPress={()=> {}} style={styles.botonCircular}>
          <MaterialCommunityIcons name="heart-outline" size={24} color="#552414"/>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {receta.imagen_url ? (
          <Image
            source={{ uri: receta.imagen_url }}
            style={styles.imagen}
            contentFit="cover"
          />
        ) : null}

        <View style={styles.encabezadoFila}>
          <View style={styles.encabezadoTextos}>
            <Text style={styles.titulo}>{receta.nombre}</Text>
            <Text style={styles.descripcion}>{receta.descripcion}</Text>
          </View>

          <View style={styles.lineaVertical} />

          <Pressable
            onPress={()=>setModalVisible(true)}
            style={({pressed}) => [
              styles.valoracionBloque,
              pressed && styles.valoracionPresionado,
            ]}
          >
            <Svg width={84} height={30} viewBox="0 0 96 34" style={{marginLeft: -4, marginTop: -35}}>
              <Defs>
                <Path id="curva" d="M4 26 Q48 6 92 26" />
              </Defs>
              <SvgText fill="#552714" fontSize="12" fontFamily="Kavoon_400Regular">
                <TextPath href="#curva">
                  ¡Califícanos!
                </TextPath>
              </SvgText>
           </Svg>

           <View>
            
           </View>
          </Pressable>
        </View>

        <View style={styles.metaFila}>
            <View style={styles.metaPill}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#552414" />
                <Text style={styles.metaTexto}>{receta.tiempo_preparacion} min</Text>
            </View>
            <View style={styles.metaPill}>
                <MaterialCommunityIcons name="account-group-outline" size={16} color="#552414" />
                <Text style={styles.metaTexto}>{receta.porciones} porciones</Text>
            </View>
        </View>

        {/* Ingredientes */}
        <View style={styles.ingredientesCard}>
            <Text style={styles.ingredientesTitulo}>Ingredientes</Text>
            <View style={styles.ingredientesGrid}>
                {receta.ingredientes?.map((ing: any) => (
                <View key={ing.ingrediente_id} style={styles.ingredienteItem}>
                    <View style={styles.ingredienteBullet} />
                    <Text style={styles.ingredienteTexto}>
                        {ing.cantidad ? `${ing.cantidad} ${ing.unidad ?? ""} ` : ""}{ing.nombre}
                        {ing.notas ? ` (${ing.notas})` : ""}
                    </Text>
                </View>
                ))}
            </View>
        </View>

        {/* Pasos */}
        <View style={styles.preparacionCard}>
          <View style={styles.preparacionHeader}>
            <Text style={styles.preparacionTitulo}>Preparación</Text>
            <Pressable onPress={alternarLectura} style={styles.botonAudio}>
              <MaterialCommunityIcons
                name={leyendo ? "pause" : "play"}
                size={20}
                color="#FF4F0A"
              />
            </Pressable>
          </View>
          {receta.pasos?.map((paso: any) => (
            <View key={paso.orden} style={styles.pasoFila}>
              <View style={styles.pasoNumero}>
                <Text style={styles.pasoNumeroTexto}>{paso.orden}</Text>
              </View>
              <Text style={styles.pasoTexto}>{paso.instruccion}</Text>
            </View>
          ))}
        </View>

        {/* Tips (opcional) */}
        {receta.tips ? (
          <View style={styles.tipsCard}>
            <View style={styles.tipsEncabezado}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color="#FF4F0A" />
              <Text style={styles.tipsTitulo}>Tips del chef</Text>
            </View>
            <Text style={styles.tipsTexto}>{receta.tips}</Text>
          </View>
        ) : null}

      </ScrollView>

      <ModalValoracion
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCalificar={(puntaje) => {
          // TODO: guardar `puntaje` para la receta `id`
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}