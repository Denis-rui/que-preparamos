import { Spacing, TemaFormulario } from "@/constants/theme";
import { useCategorias } from "@/hooks/useCategorias";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/appButton";
import SelectorCatalogo from "./selectorCatalogo";

interface Props {
  categoriaId: number | null;
  subcategoriaId: number | null;
  onCambiarCategoria: (id: number | null) => void;
  onCambiarSubcategoria: (id: number | null) => void;
}
const ClasificacionReceta = ({
  categoriaId,
  subcategoriaId,
  onCambiarCategoria,
  onCambiarSubcategoria,
}: Props) => {
  const {
    categorias,
    loading,
    enEspera,
    vacio,
    error,
    errorActualizacion,
    actualizando,
    actualizar,
  } = useCategorias();

  const categoria = categorias.find((item) => item.id === categoriaId);
  const subcategorias = categoria?.subcategorias ?? [];

  const aviso = error ?? errorActualizacion;
  return (
    <View>
      {loading && <ActivityIndicator color={TemaFormulario.colores.acento} />}

      {enEspera && (
        <Text style={styles.aviso}>
          La consulta está en espera de conexión.
        </Text>
      )}

      {aviso && (
        <View style={styles.reintento}>
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {aviso}
          </Text>

          <AppButton
            label="Reintentar categorías"
            loading={loading || actualizando}
            onPress={() => {
              void actualizar();
            }}
          />
        </View>
      )}

      {vacio && (
        <Text style={styles.aviso}>No hay categorías disponibles.</Text>
      )}

      <SelectorCatalogo
        etiqueta="Categoría"
        placeholder="Selecciona una categoría"
        opciones={categorias}
        valorId={categoriaId}
        onSeleccionar={onCambiarCategoria}
        disabled={categorias.length === 0}
      />

      {categoriaId !== null && categorias.length > 0 && !categoria && (
        <Text style={styles.error}>
          La categoría seleccionada ya no está disponible. Elige otra.
        </Text>
      )}

      <SelectorCatalogo
        etiqueta="Subcategoría"
        placeholder="Selecciona una subcategoría"
        opciones={subcategorias}
        valorId={subcategoriaId}
        onSeleccionar={onCambiarSubcategoria}
        disabled={!categoria || subcategorias.length === 0}
      />

      {!categoria && (
        <Text style={styles.aviso}>Primero selecciona una categoría.</Text>
      )}

      {categoria && subcategorias.length === 0 && (
        <Text style={styles.aviso}>
          Esta categoría no tiene subcategorías disponibles.
        </Text>
      )}

      {categoria &&
        subcategoriaId !== null &&
        !subcategorias.some((item) => item.id === subcategoriaId) && (
          <Text style={styles.error}>
            La subcategoría seleccionada ya no está disponible. Elige otra.
          </Text>
        )}
    </View>
  );
};

export default ClasificacionReceta;
const styles = StyleSheet.create({
  aviso: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.secundario,
    marginBottom: Spacing.three,
  },
  error: {
    fontFamily: TemaFormulario.fuente,
    fontSize: TemaFormulario.tamanoAyuda,
    color: TemaFormulario.colores.error,
    marginBottom: Spacing.three,
  },
  reintento: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
});
