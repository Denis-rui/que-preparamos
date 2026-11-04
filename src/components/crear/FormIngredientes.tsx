import { Spacing, TemaFormulario } from "@/constants/theme";
import { stylesCrear } from "@/styles/formulariocrear.styles";
import { IngredienteEnEdicion } from "@/types/borradorReceta";
import { IngredienteFormulario } from "@/types/formularioRecetas";
import { Ingredientes } from "@/types/ingredientes";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BuscadorIngredientes } from "../ingredientes/BuscadorIngredientes";
import { AppButton } from "../ui/appButton";
import { FormInput } from "./FormInput";

interface Props {
  ingredientes: IngredienteFormulario[];
  agregarIngrediente: (ingrediente: IngredienteFormulario) => void;
  quitarIngrediente: (id: number) => void;
  edicion: IngredienteEnEdicion;
  actualizarEdicion: (cambios: Partial<IngredienteEnEdicion>) => void;
}

const INGREDIENTES_VISIBLES = 3;
const ALTO_MINIMO_INGREDIENTE = Spacing.six;

export const FormIngredientes = ({
  ingredientes,
  agregarIngrediente,
  quitarIngrediente,
  edicion,
  actualizarEdicion,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [alturasIngredientes, setAlturasIngredientes] = useState<
    Record<number, number>
  >({});
  const { seleccionado, cantidad, unidad, notas } = edicion;
  const setSeleccionado = (seleccionado: Ingredientes | null) =>
    actualizarEdicion({ seleccionado });

  const setCantidad = (cantidad: string) => actualizarEdicion({ cantidad });

  const setUnidad = (unidad: string) => actualizarEdicion({ unidad });

  const setNotas = (notas: string) => actualizarEdicion({ notas });
  // Conservar las alturas permite mostrar completas las tres primeras filas,
  // incluso cuando una fila larga cambia de posición al quitar ingredientes.
  const visibles = ingredientes.slice(0, INGREDIENTES_VISIBLES);
  const alturaLista =
    visibles.reduce(
      (altura, ingrediente) =>
        altura +
        (alturasIngredientes[ingrediente.id] ?? ALTO_MINIMO_INGREDIENTE),
      0,
    ) +
    Math.max(0, visibles.length - 1) * Spacing.two +
    Spacing.two * 2;

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
    if (textoCantidad.trim() === "" && notas.trim() === "") {
      setError("Debe ingresar una cantidad o una nota");
      return;
    }

    const numeroCantidad = Number(textoCantidad);
    if (
      textoCantidad !== "" &&
      (!formatoCantidad || numeroCantidad <= 0 || numeroCantidad > 9999999.999)
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
    <View style={[stylesCrear.seccion, styles.seccion]}>
      <Text style={stylesCrear.tituloSeccion}>Ingredientes</Text>

      <View style={styles.marcoLista}>
        {ingredientes.length === 0 ? (
          <Text style={[styles.detalle, styles.listaVacia]}>
            Aún no has agregado ingredientes.
          </Text>
        ) : (
          <ScrollView
            style={{ maxHeight: alturaLista }}
            contentContainerStyle={styles.contenidoLista}
            nestedScrollEnabled
            scrollEnabled={ingredientes.length > INGREDIENTES_VISIBLES}
            showsVerticalScrollIndicator={
              ingredientes.length > INGREDIENTES_VISIBLES
            }
            keyboardShouldPersistTaps="handled"
          >
            {ingredientes.map((ingrediente, indice) => (
              <View
                key={ingrediente.id}
                style={styles.fila}
                onLayout={({ nativeEvent }) => {
                  const altura = nativeEvent.layout.height;
                  setAlturasIngredientes((actuales) =>
                    actuales[ingrediente.id] === altura
                      ? actuales
                      : { ...actuales, [ingrediente.id]: altura },
                  );
                }}
              >
                <View style={styles.datos}>
                  <Text style={styles.nombre}>
                    {indice + 1}. {ingrediente.nombre}
                  </Text>

                  {ingrediente.cantidad !== "" && (
                    <Text style={styles.detalle}>
                      Cantidad: {ingrediente.cantidad} {ingrediente.unidad}
                    </Text>
                  )}

                  {ingrediente.notas !== "" && (
                    <Text style={styles.detalle}>
                      Nota: {ingrediente.notas}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={() => quitarIngrediente(ingrediente.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar ${ingrediente.nombre}`}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.quitar,
                    pressed && styles.pulsado,
                  ]}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={26}
                    color={TemaFormulario.colores.error}
                  />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Reutilizamos la búsqueda existente. */}
      <View style={styles.busqueda}>
        <BuscadorIngredientes
          mostrarCategorias={false}
          onAgregarIngrediente={seleccionarIngrediente}
        />
      </View>

      {seleccionado && (
        <View
          style={styles.ingredienteSeleccionado}
          accessibilityLiveRegion="polite"
        >
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={TemaFormulario.colores.acento}
          />
          <View style={styles.datos}>
            <Text style={styles.etiquetaSeleccion}>
              Ingrediente seleccionado
            </Text>
            <Text style={styles.nombre}>{seleccionado.nombre}</Text>
          </View>
        </View>
      )}

      <FormInput
        estiloContenedor={styles.campoIngrediente}
        etiqueta="Cantidad (opcional)"
        placeholder="Ejemplo: 1,5"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="decimal-pad"
      />

      {/* La API acepta una unidad escrita como texto. */}
      <FormInput
        estiloContenedor={styles.campoIngrediente}
        etiqueta="Unidad (opcional)"
        placeholder="Ejemplo: gramos, tazas o unidades"
        value={unidad}
        onChangeText={setUnidad}
        maxLength={50}
      />

      <FormInput
        estiloContenedor={styles.campoIngrediente}
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
    zIndex: 1,
  },
  marcoLista: {
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    overflow: "hidden",
  },
  contenidoLista: {
    padding: Spacing.two,
    gap: Spacing.two,
  },
  listaVacia: {
    padding: Spacing.three,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: ALTO_MINIMO_INGREDIENTE,
    padding: Spacing.two,
    backgroundColor: TemaFormulario.colores.fondo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo - Spacing.one,
  },
  datos: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  quitar: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  pulsado: {
    opacity: 0.6,
  },
  campoIngrediente: {
    marginBottom: Spacing.one,
  },
  ingredienteSeleccionado: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: TemaFormulario.colores.fondo,
    borderWidth: 1,
    borderLeftWidth: Spacing.one,
    borderColor: TemaFormulario.colores.acento,
    borderRadius: TemaFormulario.radioCampo,
    marginBottom: Spacing.two,
  },
  etiquetaSeleccion: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
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
