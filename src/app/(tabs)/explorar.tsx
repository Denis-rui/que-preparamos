import { FotoReceta } from "@/components/recetas/FotoReceta";
import { TarjetaReceta } from "@/components/recetas/TarjetaReceta";
import { useRecetas } from "@/hooks/useRecetas";
import { styles } from "@/styles/explorar.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, Path, Text as SvgText, TextPath } from "react-native-svg";

// Etiquetas del diseño: todavía no corresponden a filtros del backend.
const filtros = ["Todas", "Rápidas", "Peruanas", "Saludables"];

export default function Explorar() {
  const { recetas, loading, error } = useRecetas();
  const [altoLista, setAltoLista] = useState(0);
  // Tres tarjetas y dos separaciones; conservamos un m?nimo legible en pantallas peque?as.
  const altoTarjeta = Math.max(130, (altoLista - 28) / 3);
  return (
    <SafeAreaView style={styles.contenedor} edges={["top", "left", "right"]}>
      {/* Esta secci?n queda fuera de la lista para permanecer fija. */}
      <View style={styles.cabeceraFija}>
        <View style={styles.cabecera}>
          {/* Conservamos la frase de Explorar y el sombrero de Inicio. */}
          <View style={styles.marca}>
            <Image
              source={require("../../assets/imagenes/icono_sombrero_chef.png")}
              style={styles.sombrero}
              contentFit="contain"
            />
            <View
              style={styles.tituloCurvo}
              accessible
              accessibilityRole="header"
              accessibilityLabel="Exploremos"
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 230 64"
                accessible={false}
              >
                <Defs>
                  <Path id="arcoExplorar" d="M 6 52 Q 115 24 224 52" />
                </Defs>
                <SvgText
                  fill="#512013"
                  fontFamily="Lobster_400Regular"
                  fontSize={38}
                  letterSpacing={-1.2}
                  textAnchor="middle"
                >
                  <TextPath href="#arcoExplorar" startOffset="50%" spacing="exact">
                    Exploremos
                  </TextPath>
                </SvgText>
              </Svg>
            </View>
            {/* El subtítulo sigue su propio arco para mantener la palabra centrada. */}
            <View
              style={styles.subtituloCurvo}
              accessible
              accessibilityLabel="Juntos"
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 180 48"
                accessible={false}
              >
                <Defs>
                  <Path id="arcoJuntos" d="M 12 38 Q 90 16 168 38" />
                </Defs>
                <SvgText
                  fill="#FF5008"
                  fontFamily="Lobster_400Regular"
                  fontSize={30}
                  letterSpacing={-0.9}
                  textAnchor="middle"
                >
                  <TextPath href="#arcoJuntos" startOffset="50%" spacing="exact">
                    Juntos
                  </TextPath>
                </SvgText>
              </Svg>
            </View>
            <Image
              source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
              style={styles.hojas}
              contentFit="contain"
            />
          </View>
          {/* Usamos la primera foto del catálogo sin realizar otra consulta. */}
          {/* La sombra va fuera del recorte circular para que no se corte. */}
          <View style={styles.sombraPlato}>
            <FotoReceta uri={recetas[0]?.imagen_url} style={styles.plato} />
            {/* Adorno fuera del recorte circular de la fotografía. */}
            <Image
              source={require("../../assets/SVG/adornos/hojas_avatar_izquierda.svg")}
              style={styles.hojasPlato}
              contentFit="contain"
              accessible={false}
              pointerEvents="none"
            />
          </View>
        </View>
        {/* Controles visuales: no abren el teclado ni modifican las recetas. */}
        <View style={styles.buscador}>
          <Ionicons name="search-outline" size={21} color="#454545" />
          <Text style={styles.placeholder}>
            Ingrese el título de la receta ...
          </Text>
        </View>
        <View style={styles.filtros}>
          {filtros.map((filtro, indice) => (
            <View
              key={filtro}
              style={[styles.filtro, indice === 0 && styles.filtroActivo]}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  indice === 0 && styles.textoFiltroActivo,
                ]}
              >
                {filtro}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View
        style={styles.areaLista}
        onLayout={(event) => setAltoLista(event.nativeEvent.layout.height)}
      >
        <FlatList
          style={styles.scroll}
          data={recetas}
          keyExtractor={(receta) => String(receta.id)}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          renderItem={({ item }) => (
            <TarjetaReceta
              receta={item}
              variante="horizontal"
              alto={altoTarjeta}
            />
          )}
          ListEmptyComponent={
            <View style={styles.estado}>
              {loading && <ActivityIndicator color="#FF5008" size="large" />}
              <Text
                style={[styles.mensaje, error && styles.error]}
                accessibilityLiveRegion="polite"
              >
                {loading
                  ? "Cargando recetas..."
                  : (error ?? "Todavía no hay recetas para explorar.")}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
