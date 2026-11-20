import useFormularioCrear from "@/hooks/useFormularioCrear";
import { stylesCrear } from "@/styles/formulariocrear.styles";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../ui/appButton";
import { BotonVolver } from "../ui/botonVolver";
import Botones from "./Botones";
import ClasificacionReceta from "./clasificacionReceta";
import { FormIngredientes } from "./FormIngredientes";
import { FormInput } from "./FormInput";
import { FotoReceta } from "./FotoReceta";
import { PasosPreparacion } from "./PasosPreparacion";
interface Props {
  usuarioId: number;
  avisoAcceso?: string | null;
  borradorId?: string;
  alVolver?: () => void;
}
const FormularioCrear = ({
  usuarioId,
  avisoAcceso,
  borradorId,
  alVolver,
}: Props) => {
  const {
    datos,
    actualizarTexto,
    cambiarCategoria,
    cambiarSubcategoria,
    agregarIngrediente,
    quitarIngrediente,
    agregarPaso,
    actualizarPaso,
    quitarPaso,
    seleccionarImagen,
    quitarImagen,
    imagenSeleccionada,
    errorImagen,
    guardarRecetaPriv,
    guardando,
    errorGuardando,
    claveFormulario,
    publicacionSinConfirmar,
    publicar,
    publicando,
    ingredienteEnEdicion,
    actualizarIngredienteEdicion,
    bloqueadoBorrador,
    cargaBorrador,
    reintentarCargaBorrador,
  } = useFormularioCrear(usuarioId, borradorId, alVolver);

  return (
    <SafeAreaView style={stylesCrear.pantalla} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={stylesCrear.pantalla}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={stylesCrear.contenido}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {alVolver && <BotonVolver variante="blanco" onPress={alVolver} />}
          {avisoAcceso && (
            <Text
              style={stylesCrear.avisoAcceso}
              accessibilityLiveRegion="polite"
            >
              {avisoAcceso}
            </Text>
          )}

          {cargaBorrador.estado === "cargando" ? (
            <ActivityIndicator accessibilityLabel="Cargando borrador" />
          ) : cargaBorrador.estado === "error" ? (
            <>
              <Text accessibilityRole="alert" style={stylesCrear.avisoAcceso}>
                {cargaBorrador.mensaje}
              </Text>
              <AppButton label="Reintentar" onPress={reintentarCargaBorrador} />
            </>
          ) : (
            <>
              <View
                key={claveFormulario}
                pointerEvents={
                  guardando || publicacionSinConfirmar || bloqueadoBorrador
                    ? "none"
                    : "auto"
                }
              >
                <Text style={stylesCrear.titulo}>
                  {borradorId ? "Editar borrador" : "Crear Receta"}
                </Text>
                <FotoReceta
                  imagen={datos.imagen}
                  seleccionando={imagenSeleccionada}
                  error={errorImagen}
                  seleccionarImagen={seleccionarImagen}
                  quitarImagen={quitarImagen}
                />
                <FormInput
                  etiqueta="Nombre de la receta"
                  placeholder="Ejemplo: Arroz con pollo"
                  value={datos.nombre}
                  onChangeText={(texto) => actualizarTexto("nombre", texto)}
                  maxLength={150}
                />

                <FormInput
                  etiqueta="Descripcion"
                  placeholder="Describre tu prepacion"
                  value={datos.descripcion}
                  onChangeText={(texto) =>
                    actualizarTexto("descripcion", texto)
                  }
                  multiline
                  maxLength={16000}
                />
                <ClasificacionReceta
                  categoriaId={datos.categoriaId}
                  subcategoriaId={datos.subcategoriaId}
                  onCambiarCategoria={cambiarCategoria}
                  onCambiarSubcategoria={cambiarSubcategoria}
                />

                <FormInput
                  etiqueta="Porciones"
                  placeholder="Ejemplo: 4"
                  value={datos.porciones}
                  onChangeText={(texto) => actualizarTexto("porciones", texto)}
                  keyboardType="number-pad"
                  maxLength={5}
                />

                <FormInput
                  etiqueta="Tiempo de preparacion"
                  placeholder="Ejemplo: 30"
                  sufijo="minutos"
                  value={datos.tiempoPreparacion}
                  onChangeText={(texto) =>
                    actualizarTexto("tiempoPreparacion", texto)
                  }
                  keyboardType="number-pad"
                  maxLength={50}
                />

                <FormIngredientes
                  ingredientes={datos.ingredientes}
                  agregarIngrediente={agregarIngrediente}
                  quitarIngrediente={quitarIngrediente}
                  edicion={ingredienteEnEdicion}
                  actualizarEdicion={actualizarIngredienteEdicion}
                />
                <PasosPreparacion
                  pasos={datos.pasos}
                  actualizarPaso={actualizarPaso}
                  agregarPaso={agregarPaso}
                  quitarPaso={quitarPaso}
                />
                <FormInput
                  etiqueta="Tips o consejos (opcional)"
                  placeholder="Comparte alguna recomendación para esta receta"
                  value={datos.tips}
                  onChangeText={(texto) => actualizarTexto("tips", texto)}
                  multiline
                  maxLength={16000}
                />
              </View>
              <Botones
                guardarRecetaPri={guardarRecetaPriv}
                guardando={guardando}
                bloqueado={imagenSeleccionada || bloqueadoBorrador}
                error={errorGuardando}
                publicacionSinConfirmar={publicacionSinConfirmar}
                publicar={publicar}
                publicando={publicando}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FormularioCrear;
