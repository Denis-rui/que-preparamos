import type { RecetaResumen } from "@/types/receta";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FotoReceta } from "./FotoReceta";

// La tarjeta comparte datos y presentación; cada pantalla decide qué API consultar.
export function TarjetaReceta({
  receta,
  variante = "horizontal",
  alto,
}: {
  receta: RecetaResumen;
  variante?: "horizontal" | "cuadricula";
  // Alto mínimo sugerido por Explorar; el contenido puede aumentar la tarjeta.
  alto?: number;
}) {
  const horizontal = variante === "horizontal";
  return (
    <Pressable 
      onPress={()=> router.push(`/receta/${receta.id}`)}
      style={({pressed}) =>[
        s.tarjeta,
        horizontal ? s.horizontal : s.cuadricula,
        horizontal && alto !== undefined && { minHeight: alto, marginBottom: 0 },
        pressed && {opacity: 0.85},
      ]}
    >
      <View style={horizontal ? s.fotoHorizontal : s.fotoCuadricula}>
        <FotoReceta uri={receta.imagen_url} style={s.foto} />
        {/* Favorito y flecha son adornos por ahora, sin eventos ni estado local. */}
        <View style={s.corazon} accessible={false}>
          <Ionicons
            name="heart-outline"
            size={horizontal ? 17 : 24}
            color="#633A2D"
          />
        </View>
        {!horizontal && (
          <View style={s.tiempoFlotante}>
            <Text style={s.tiempo}>⏱ {receta.tiempo_preparacion} min</Text>
          </View>
        )}
      </View>
      <View style={horizontal ? s.contenido : s.contenidoCuadricula}>
        <Text style={s.nombre} numberOfLines={2}>
          {receta.nombre}
        </Text>
        <Text style={s.descripcion} numberOfLines={2}>
          {receta.descripcion}
        </Text>
        {horizontal && (
          <>
            <View style={s.ingredientes}>
              {receta.ingredientes_resumen.slice(0, 3).map((ingrediente) => (
                <Text
                  key={ingrediente.ingrediente_id}
                  style={s.etiqueta}
                  numberOfLines={1}
                >
                  {ingrediente.nombre}
                </Text>
              ))}
            </View>
            <View style={s.fila}>
              <Ionicons name="time-outline" size={13} color="#99918C" />
              <Text style={s.tiempo}>{receta.tiempo_preparacion} min</Text>
            </View>
            <View style={s.pie}>
              {/* Muestra visual de 4/5: no es una puntuación real de esta receta.
                  La conexión con las valoraciones se implementará después. */}
              <View
                style={s.valoracion}
                accessible
                accessibilityLabel="Valoración, diseño de muestra"
              >
                {[1, 2, 3, 4, 5].map((numero) => (
                  <Image
                    key={numero}
                    source={numero <= 4
                      ? require("../../assets/SVG/iconos/sombrerito_chef.svg")
                      : require("../../assets/SVG/iconos/sombrerito_chef_blanco.svg")}
                    style={s.sombrerito}
                    contentFit="contain"
                    accessible={false}
                  />
                ))}
              </View>
              <View style={s.flecha} accessible={false}>
                <Ionicons name="chevron-forward" size={13} color="white" />
              </View>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}
const s = StyleSheet.create({
  // Tamaño de cada SVG de valoración; conserva los colores originales del archivo.
  sombrerito: { width: 18, height: 18 },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 14,
    boxShadow: "0px 5px 14px rgba(64,38,16,0.06)",
  },
  horizontal: { flexDirection: "row", padding: 10, gap: 12 },
  cuadricula: { width: "48%", borderRadius: 15, paddingBottom: 15 },
  fotoHorizontal: {
    // Tamaño de la fotografía en Explorar. Cambia estos dos valores para ajustarla.
    width: "32%",
    maxWidth: 110,
    aspectRatio: 1,
    flexShrink: 0,
    alignSelf: "center",
    borderRadius: 13,
    overflow: "hidden",
  },
  fotoCuadricula: {
    // Altura de la fotografía en Inicio; el ancho lo define la tarjeta.
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  // Rellena el contenedor sin intervenir en el cálculo de altura de la tarjeta.
  foto: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  corazon: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
  },
  tiempoFlotante: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  contenido: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 4,
    paddingVertical: 3,
  },
  contenidoCuadricula: { paddingHorizontal: 10, paddingTop: 10, gap: 5 },
  nombre: { fontFamily: "Inter_800ExtraBold", fontSize: 14, color: "#512013" },
  descripcion: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 15,
    color: "#918983",
  },
  ingredientes: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  etiqueta: {
    maxWidth: "100%",
    fontSize: 10,
    color: "#7C736C",
    backgroundColor: "#E9E5E1",
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  fila: { flexDirection: "row", alignItems: "center", gap: 2 },
  tiempo: { fontSize: 10, color: "#918983" },
  pie: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    marginTop: 3,
  },
  valoracion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  flecha: {
    backgroundColor: "#FF5008",
    borderRadius: 12,
    width: 21,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
