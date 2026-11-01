import { Spacing, TemaFormulario } from "@/constants/theme";
import { Host, Picker } from "@expo/ui";
import { StyleSheet, Text, View } from "react-native";
interface OpcionCatalogo {
  id: number;
  nombre: string;
}
interface Props {
  etiqueta: string;
  placeholder: string;
  opciones: OpcionCatalogo[];
  valorId: number | null;
  onSeleccionar: (id: number | null) => void;
  disabled?: boolean;
}
const SelectorCatalogo = ({
  etiqueta,
  placeholder,
  opciones,
  valorId,
  onSeleccionar,
  disabled,
}: Props) => {
  const valorVisible =
    valorId !== null && opciones.some((opcion) => opcion.id === valorId)
      ? valorId
      : 0;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>

      <View style={styles.campo}>
        {/* Host integra los controles nativos de Expo UI. */}
        <Host
          matchContents
          style={styles.host}
          colorScheme="light"
          seedColor={TemaFormulario.colores.acento}
        >
          <Picker
            selectedValue={valorVisible}
            enabled={!disabled && opciones.length > 0}
            onValueChange={(id) => {
              // En nuestros datos, sin selección se representa con null.
              onSeleccionar(id === 0 ? null : id);
            }}
          >
            <Picker.Item label={placeholder} value={0} />

            {opciones.map((opcion) => (
              <Picker.Item
                key={opcion.id}
                label={opcion.nombre}
                value={opcion.id}
              />
            ))}
          </Picker>
        </Host>
      </View>
    </View>
  );
};

export default SelectorCatalogo;
const styles = StyleSheet.create({
  contenedor: {
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  etiqueta: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    fontSize: TemaFormulario.tamanoEtiqueta,
    color: TemaFormulario.colores.texto,
  },
  campo: {
    minHeight: TemaFormulario.altoCampo,
    justifyContent: "center",
    backgroundColor: TemaFormulario.colores.campo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    borderRadius: TemaFormulario.radioCampo,
    paddingHorizontal: Spacing.two,
  },
  host: {
    width: "100%",
  },
});
