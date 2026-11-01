import { Spacing, TemaFormulario } from "@/constants/theme";
import { IngredienteFormulario } from "@/types/formularioRecetas";
import { Ingredientes } from "@/types/ingredientes";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BuscadorIngredientes } from "../ingredientes/BuscadorIngredientes";
import { AppButton } from "../ui/appButton";
import { FormInput } from "./FormInput";

interface Props {
  ingredientes: IngredienteFormulario[];
  agregarIngrediente: (ingrediente: IngredienteFormulario) => void;
  quitarIngrediente: (id: number) => void;
}

export const FormIngredientes = ({
  ingredientes,
  agregarIngrediente,
  quitarIngrediente,
}: Props) => {
  const [seleccionado, setSeleccionado] = useState<Ingredientes | null>(null);
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [notas, setNotas] = useState("");
  const [error, setError] = useState<string | null>(null);

  const limpiarCampos = () => {
    setCantidad("");
    setUnidad("");
    setNotas("");
    setError(null);
  };

  const seleccionarIngrediente = (ingrediente: Ingredientes) => {
    setSeleccionado(ingrediente);
    limpiarCampos();
  };

  const agregar = () => {
    if (!seleccionado) {
      setError("Debe seleccionar un ingrediente");
      return;
    }
    if (ingredientes.some((item) => item.id === seleccionado.id)) {
      setError("El ingrediente ya ha sido agregado");
      return;
    }
    const textoCantidad = cantidad.trim().replace(",", ".");
    const formatoCantidad = /^(?:\d+(?:\.\d{0,3})?|\.\d{1,3})$/.test(
      textoCantidad,
    );

    const numeroCantidad = Number(textoCantidad);
    if (
      textoCantidad !== "" &&
      (!formatoCantidad || numeroCantidad <= 0 || numeroCantidad > 99999.999)
    ) {
      setError("Cantidad inválida");
      return;
    }

    agregarIngrediente({
      id: seleccionado.id,
      nombre: seleccionado.nombre,
      cantidad: textoCantidad,
      unidad: unidad,
      notas: notas,
    });
    setSeleccionado(null);
    limpiarCampos();
  };

  return (
    <View style={styles.seccion}>
      <Text style={styles.titulo}>Ingredientes</Text>

      {ingredientes.length === 0 && (
        <Text style={styles.detalle}>Aún no has agregado ingredientes.</Text>
      )}

      {ingredientes.map((ingrediente, indice) => (
        <View key={ingrediente.id} style={styles.fila}>
          <View style={styles.datos}>
            <Text style={styles.nombre}>
              {indice + 1}. {ingrediente.nombre}
            </Text>

            <Text style={styles.detalle}>
              {[ingrediente.cantidad, ingrediente.unidad]
                .filter(Boolean)
                .join(" ") || "Sin cantidad especificada"}
            </Text>

            {ingrediente.notas !== "" && (
              <Text style={styles.detalle}>{ingrediente.notas}</Text>
            )}
          </View>

          <Pressable
            onPress={() => quitarIngrediente(ingrediente.id)}
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${ingrediente.nombre}`}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle-outline"
              size={26}
              color={TemaFormulario.colores.error}
            />
          </Pressable>
        </View>
      ))}

      {/* Reutilizamos la búsqueda existente. */}
      <View style={styles.busqueda}>
        <BuscadorIngredientes
          mostrarCategorias={false}
          onAgregarIngrediente={seleccionarIngrediente}
        />
      </View>

      {seleccionado && (
        <Text style={styles.nombre}>Seleccionado: {seleccionado.nombre}</Text>
      )}

      <FormInput
        etiqueta="Cantidad (opcional)"
        placeholder="Ejemplo: 1,5"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="decimal-pad"
      />

      {/* La API acepta una unidad escrita como texto. */}
      <FormInput
        etiqueta="Unidad (opcional)"
        placeholder="Ejemplo: gramos, tazas o unidades"
        value={unidad}
        onChangeText={setUnidad}
        maxLength={50}
      />

      <FormInput
        etiqueta="Notas (opcional)"
        placeholder="Ejemplo: picado fino o al gusto"
        value={notas}
        onChangeText={setNotas}
        maxLength={16000}
      />

      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      <AppButton label="Agregar ingrediente" onPress={agregar} />
    </View>
  );
};
const styles = StyleSheet.create({
  seccion: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
    zIndex: 1,
  },
  titulo: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: 18,
    color: TemaFormulario.colores.texto,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: TemaFormulario.colores.borde,
  },
  datos: {
    flex: 1,
  },
  nombre: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoCampo,
    color: TemaFormulario.colores.texto,
  },
  detalle: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
  },
  busqueda: {
    zIndex: 20,
    marginBottom: Spacing.two,
  },
  error: {
    fontFamily: TemaFormulario.fuente,
    color: TemaFormulario.colores.error,
  },
});
