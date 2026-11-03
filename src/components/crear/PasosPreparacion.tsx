import { Spacing, TemaFormulario } from "@/constants/theme";
import { stylesCrear } from "@/styles/formulariocrear.styles";
import { PasoFormulario } from "@/types/formularioRecetas";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/appButton";
import { FormInput } from "./FormInput";

interface Props {
  // Los datos pertenecen al formulario, no a este componente.
  pasos: PasoFormulario[];

  // Recibimos las acciones del hook para modificar esos datos.
  actualizarPaso: (id: number, instruccion: string) => void;
  agregarPaso: () => void;
  quitarPaso: (id: number) => void;
}

export const PasosPreparacion = ({
  pasos,
  actualizarPaso,
  agregarPaso,
  quitarPaso,
}: Props) => {
  return (
    <View style={stylesCrear.seccion}>
      <Text style={stylesCrear.tituloSeccion}>Preparación</Text>

      {pasos.map((paso, indice) => (
        // Usamos un identificador estable para conservar la identidad
        // de cada campo cuando se elimina otro paso.
        <View key={paso.id}>
          <View style={styles.encabezado}>
            {/* La numeración se calcula según la posición actual. */}
            <Text style={styles.etiqueta}>Paso {indice + 1}</Text>

            {/* Podemos quitar pasos mientras quede al menos uno. */}
            {pasos.length > 1 && (
              <Pressable
                onPress={() => quitarPaso(paso.id)}
                accessibilityRole="button"
                accessibilityLabel={`Quitar paso ${indice + 1}`}
                hitSlop={8}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={26}
                  color={TemaFormulario.colores.error}
                />
              </Pressable>
            )}
          </View>

          <FormInput
            estiloContenedor={styles.campoPaso}
            placeholder="Explica qué se debe hacer..."
            accessibilityLabel={`Instrucción del paso ${indice + 1}`}
            value={paso.instruccion}
            onChangeText={(texto) => actualizarPaso(paso.id, texto)}
            multiline
            maxLength={16000}
          />
        </View>
      ))}

      {pasos.length < 500 ? (
        <AppButton
          label="Agregar otro paso"
          variant="secundario"
          onPress={agregarPaso}
        />
      ) : (
        <Text style={styles.ayuda}>Has alcanzado el límite de 500 pasos.</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
  },
  campoPaso: {
    marginBottom: Spacing.two,
  },
  etiqueta: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoEtiqueta,
    color: TemaFormulario.colores.texto,
  },
  ayuda: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
  },
});
