import { styles } from "@/styles/receta.styles";
import type { RecetaDetalle } from "@/types/receta";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useId } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Defs, Path, Text as SvgText, TextPath } from "react-native-svg";
import { IconoGorroChef } from "./IconoGorroChef";

type Datos = Pick<
  RecetaDetalle,
  "categoria" | "subcategoria" | "tiempo_preparacion" | "porciones"
>;

export function DatosReceta({ receta }: { receta: Datos }) {
  return (
    <View style={styles.metaFila}>
      {receta.categoria && (
        <>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={18}
              color="#552414"
            />
            <View style={styles.metaCategoria}>
              <Text style={styles.metaTexto}>{receta.categoria.nombre}</Text>
              {receta.subcategoria && (
                <>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={16}
                    color="#F26A1B"
                  />
                  <Text style={styles.metaTexto}>
                    {receta.subcategoria.nombre}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.metaSeparador} />
        </>
      )}

      <View style={styles.metaItem}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={22}
          color="#552414"
        />
        <Text style={styles.metaTexto}>{receta.tiempo_preparacion} min</Text>
      </View>

      <View style={styles.metaSeparador} />

      <View style={styles.metaItem}>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={22}
          color="#552414"
        />
        <Text style={styles.metaTexto}>{receta.porciones} porciones</Text>
      </View>
    </View>
  );
}

export function BloqueValoracionReceta({
  total,
  promedio,
  alPulsar,
  deshabilitado = false,
  etiqueta = "¡Califícanos!",
}: {
  total: number;
  promedio: number | null;
  alPulsar: () => void;
  deshabilitado?: boolean;
  etiqueta?: string;
}) {
  // Cada bloque tiene su propia curva si ambas pantallas están montadas.
  const curva = "curva-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const promedioVisible = total > 0 && promedio !== null ? promedio : null;
  const proporcion = Math.min(Math.max((promedioVisible ?? 0) / 5, 0), 1);

  const cantidad =
    total === 0
      ? "Sin valoraciones"
      : "(" + total + (total === 1 ? " valoración)" : " valoraciones)");

  return (
    <View style={styles.encabezadoValoracion}>
      <View style={styles.lineaVertical} />
      <Pressable
        onPress={alPulsar}
        disabled={deshabilitado}
        accessibilityRole="button"
        accessibilityState={{ disabled: deshabilitado }}
        accessibilityLabel={[etiqueta, promedioVisible?.toFixed(1), cantidad]
          .filter(Boolean)
          .join(", ")}
        style={({ pressed }) => [
          styles.valoracionBloque,
          pressed && styles.valoracionPresionado,
        ]}
      >
        <Svg
          width={84}
          height={30}
          viewBox="0 0 96 34"
          style={{ marginLeft: -4 }}
        >
          <Defs>
            <Path id={curva} d="M4 26 Q48 6 92 26" />
          </Defs>
          <SvgText
            fill="#552714"
            fontSize="12"
            fontFamily="Kavoon_400Regular"
            textAnchor="middle"
          >
            <TextPath href={"#" + curva} startOffset="50%">
              {etiqueta}
            </TextPath>
          </SvgText>
        </Svg>

        <View style={styles.valoracionFila}>
          <IconoGorroChef proporcion={proporcion} size={38} />
          {promedioVisible !== null && (
            <Text style={styles.valoracionPromedio}>
              {promedioVisible.toFixed(1)}/5
            </Text>
          )}
        </View>

        <Text style={styles.valoracionCantidad} numberOfLines={1}>
          {cantidad}
        </Text>
      </Pressable>
    </View>
  );
}
