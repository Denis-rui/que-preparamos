import { styles } from "@/styles/receta.styles";
import type { RecetaDetalle } from "@/types/receta";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function ContenidoReceta({
  receta,
  accionPreparacion,
}: {
  receta: Pick<RecetaDetalle, "ingredientes" | "pasos" | "tips">;
  accionPreparacion?: ReactNode;
}) {
  // Ambos detalles presentan estos tres campos con los mismos estilos.
  return (
    <>
      <View style={styles.ingredientesCard}>
        <Text style={styles.ingredientesTitulo}>Ingredientes</Text>
        <View style={styles.ingredientesGrid}>
          {receta.ingredientes?.map((ing) => (
            <View key={ing.ingrediente_id} style={styles.ingredienteItem}>
              <View style={styles.ingredienteBullet} />
              <Text style={styles.ingredienteTexto}>
                {ing.cantidad ? `${ing.cantidad} ${ing.unidad ?? ""} ` : ""}
                {ing.nombre}
                {ing.notas ? ` (${ing.notas})` : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.preparacionCard}>
        <View style={styles.preparacionHeader}>
          <Text style={styles.preparacionTitulo}>Preparación</Text>
          {accionPreparacion}
        </View>
        {receta.pasos?.map((paso) => (
          <View key={paso.orden} style={styles.pasoFila}>
            <View style={styles.pasoNumero}>
              <Text style={styles.pasoNumeroTexto}>{paso.orden}</Text>
            </View>
            <Text style={styles.pasoTexto}>{paso.instruccion}</Text>
          </View>
        ))}
      </View>

      {/* La sección aparece cuando Laravel devuelve un consejo. */}
      {receta.tips ? (
        <View style={styles.tipsCard}>
          <View style={styles.tipsEncabezado}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={22}
              color="#FF4F0A"
            />
            <Text style={styles.tipsTitulo}>Tips del chef</Text>
          </View>
          <Text style={styles.tipsTexto}>{receta.tips}</Text>
        </View>
      ) : null}
    </>
  );
}
