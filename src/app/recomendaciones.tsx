import { styles } from "@/styles/recomendaciones.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// MOCK solo diseño — sin API, sin funcionalidad.
// Al estar en src/app/recomendaciones.tsx (fuera de (tabs)) no muestra la barra inferior.
type RecomendacionMock = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  tienes: string[];
  tiempo: string;
  porciones: string;
};

const MOCK_RECOMENDACIONES: RecomendacionMock[] = [
  {
    id: "1",
    nombre: "Ají de Gallina",
    descripcion: "Cremoso, tradicional y siempre una buena idea.",
    imagen: '',
    tienes: ["pollo", "cebolla", "ajo"],
    tiempo: "35 min",
    porciones: "4 porciones",
  },
  {
    id: "2",
    nombre: "Arroz con Pollo",
    descripcion: "Un clásico peruano lleno de sabor",
    imagen:"",
    tienes: ["pollo", "cebolla", "arroz"],
    tiempo: "50 min",
    porciones: "4 porciones",
  },
  {
    id: "3",
    nombre: "Lomo Saltado",
    descripcion: "Sabor peruano en cada bocado",
    imagen:"",
    tienes: ["carne", "cebolla", "tomate"],
    tiempo: "30 min",
    porciones: "4 porciones",
  },
];

function TarjetaRecomendacion({ item }: { item: RecomendacionMock }) {
  return (
    <View style={styles.tarjeta}>
      <Image
        source={{ uri: item.imagen }}
        style={styles.imagen}
        contentFit="cover"
      />
      <View style={styles.tarjetaContenido}>
        <View style={styles.tarjetaHeader}>
          <Text style={styles.tarjetaTitulo} numberOfLines={1}>
            {item.nombre}
          </Text>
          <Pressable style={styles.corazon} accessibilityRole="button">
            <MaterialCommunityIcons
              name="heart-outline"
              size={18}
              color="#552414"
            />
          </Pressable>
        </View>

        <Text style={styles.descripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>

        <View style={styles.tienesBox}>
          <Text style={styles.tienesLabel}>Tienes:</Text>
          <View style={styles.chipsFila}>
            {item.tienes.map((ing) => (
              <View key={ing} style={styles.chip}>
                <Text style={styles.chipTexto}>{ing}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.metaFila}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#9C8B7A"
            />
            <Text style={styles.metaTexto}>{item.tiempo}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={14}
              color="#9C8B7A"
            />
            <Text style={styles.metaTexto}>{item.porciones}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function Recomendaciones() {
  return (
    <SafeAreaView
      style={styles.contenedor}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.topBar}>
        <Pressable
          style={styles.botonAtras}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#552414"
          />
        </Pressable>
        <View style={styles.logoFila}>
          <Image
            source={require("../assets/imagenes/icono_sombrero_chef.png")}
            style={styles.logoSombrero}
            contentFit="contain"
          />
          <Image
            source={require("../assets/imagenes/titulo.png")}
            style={styles.logoTitulo}
            contentFit="contain"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tituloFila}>
          <Image
            source={require("../assets/SVG/adornos/hojas_izquierda.svg")}
            style={styles.hojaTitulo}
            contentFit="contain"
          />
          <Text style={styles.titulo}>Recomendaciones</Text>
          <Image
            source={require("../assets/SVG/adornos/hojas_derecha.svg")}
            style={styles.hojaTitulo}
            contentFit="contain"
          />
        </View>
        <Text style={styles.subtitulo}>
          Basadas en los ingredientes que seleccionaste
        </Text>

        {MOCK_RECOMENDACIONES.map((item) => (
          <TarjetaRecomendacion key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
