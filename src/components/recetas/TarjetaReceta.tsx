import { styles as s, estiloAltoTarjeta } from "@/styles/tarjeta-receta.styles";
import type { RecetaResumen } from "@/types/receta";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { FotoReceta } from "./FotoReceta";
import { CorazonFavorito } from "./CorazonFavorito";
import { useFavoritoLocal } from "@/hooks/useFavoritoLocal";

// Tarjeta compartida entre Inicio y Explorar.
export function TarjetaReceta({
  receta,
  variante = "horizontal",
  alto,
}: {
  receta: RecetaResumen;
  variante?: "horizontal" | "cuadricula";
  // Altura mínima; crece si el contenido lo necesita.
  alto?: number;
}) {
  const horizontal = variante === "horizontal";
  const favorito = useFavoritoLocal(String(receta.id));
  return (
    <Pressable 
      onPress={()=> router.push(`/receta/${receta.id}`)}
      style={({pressed}) =>[
        s.tarjeta,
        horizontal ? s.horizontal : s.cuadricula,
        horizontal && alto !== undefined && estiloAltoTarjeta(alto),
        pressed && s.presionado,
      ]}
    >
      <View style={horizontal ? s.fotoHorizontal : s.fotoCuadricula}>
        <FotoReceta uri={receta.imagen_url} style={s.foto} />
        <Pressable
          style={[s.corazon, favorito.ocupado && s.guardando]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${favorito.esFavorito ? "Quitar de favoritos" : "Guardar en favoritos y descargar"}: ${receta.nombre}`}
          accessibilityState={{ selected: favorito.esFavorito, disabled: favorito.ocupado || !favorito.preparado, busy: favorito.ocupado }}
          disabled={favorito.ocupado || !favorito.preparado}
          onPress={(event) => {
            event.stopPropagation();
            void favorito.alternar();
          }}
        >
          <CorazonFavorito seleccionado={favorito.esFavorito} size={horizontal ? 17 : 24} />
        </Pressable>
        {!horizontal && (
          <View style={s.tiempoFlotante}>
            <Text style={s.tiempo}>⏱ {receta.tiempo_preparacion} min</Text>
          </View>
        )}
      </View>
      <View style={horizontal ? s.contenido : s.contenidoCuadricula}>
        {favorito.error ? <Text accessibilityRole="alert" style={s.error}>{favorito.error}</Text> : null}
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
              {/* Valoración de muestra; falta conectar el dato real. */}
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
