import useFormularioCrear from "@/hooks/useFormularioCrear";
import { stylesCrear } from "@/styles/formulariocrear.styles";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Botones from "./Botones";
import { FormIngredientes } from "./FormIngredientes";
import { FormInput } from "./FormInput";
import { PasosPreparacion } from "./PasosPreparacion";
import ClasificacionReceta from "./clasificacionReceta";

const FormularioCrear = () => {
  const { datos, actualizarTexto, cambiarCategoria, cambiarSubcategoria } =
    useFormularioCrear();

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
          <Text style={stylesCrear.titulo}>Nueva Receta</Text>
          <View style={stylesCrear.imagen}>
            <Text style={stylesCrear.textoImagen}>Foto de la receta</Text>
          </View>
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
            onChangeText={(texto) => actualizarTexto("descripcion", texto)}
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
            placeholder="Ejemplo: 30 minutos"
            value={datos.tiempoPreparacion}
            onChangeText={(texto) =>
              actualizarTexto("tiempoPreparacion", texto)
            }
            keyboardType="number-pad"
            maxLength={50}
          />

          <FormIngredientes />
          <PasosPreparacion />
          <FormInput
            etiqueta="Tips o consejos (opcional)"
            placeholder="Comparte alguna recomendación para esta receta"
            value={datos.tips}
            onChangeText={(texto) => actualizarTexto("tips", texto)}
            multiline
            maxLength={16000}
          />

          <Botones />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FormularioCrear;
