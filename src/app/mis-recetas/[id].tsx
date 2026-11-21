import BotonesMisRecetas from "@/components/mis-recetas/BotonesMisRecetas";
import { ContenidoReceta } from "@/components/recetas/ContenidoReceta";
import { FotoReceta } from "@/components/recetas/FotoReceta";
import { AppButton } from "@/components/ui/appButton";
import { BotonVolver } from "@/components/ui/botonVolver";
import useAccesoCrear from "@/hooks/useAccesoCrear";
import useCabecerasImagenReceta from "@/hooks/useCabecerasImagenReceta";
import { useConexion } from "@/hooks/useConexion";
import useDetalleMiReceta from "@/hooks/useDetalleMiReceta";
import { styles } from "@/styles/receta.styles";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const DetalleMiReceta = () => {
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id =
    typeof parametro === "string" && /^[1-9][0-9]*$/.test(parametro)
      ? Number(parametro)
      : NaN;

  const acceso = useAccesoCrear();
  const idValido = Number.isSafeInteger(id);
  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.header}>
        <BotonVolver variante="blanco" rutaAlternativa="/mis-recetas" />
        <Text accessibilityRole="header" style={styles.titulo}>
          Mi receta
        </Text>
        <View style={styles.encabezadoDerecha} />
      </View>

      {/* La consulta se monta con un ID válido y una cuenta con acceso. */}
      {!idValido ? (
        <Mensaje texto="La receta indicada no es válida." />
      ) : acceso.estadoAcceso === "comprobado" ? (
        <Mensaje texto="Comprobando tu sesión…" cargando />
      ) : acceso.estadoAcceso === "invitado" ? (
        <Mensaje
          texto="Inicia sesión para consultar esta receta."
          accion={{
            etiqueta: "Iniciar sesión",
            ejecutar: () =>
              router.push({
                pathname: "/login",
                params: { volverA: "/mis-recetas" },
              }),
          }}
        />
      ) : acceso.estadoAcceso === "error" ? (
        <Mensaje
          texto={acceso.mensajeError ?? "No pudimos comprobar tu sesión."}
          accion={{
            etiqueta: "Reintentar",
            ejecutar: () => {
              void acceso.comprobarAcceso();
            },
          }}
        />
      ) : acceso.usuarioId !== null ? (
        // Reinicia los datos y la foto si cambia la cuenta o la receta.
        <DetalleConSesion
          key={acceso.usuarioId + ":" + id}
          usuarioId={acceso.usuarioId}
          id={id}
        />
      ) : null}
    </SafeAreaView>
  );
};
function DetalleConSesion({
  usuarioId,
  id,
}: {
  usuarioId: number;
  id: number;
}) {
  const consulta = useDetalleMiReceta(usuarioId, id);
  const { cabecerasImagen, errorCabeceraImagen } =
    useCabecerasImagenReceta(usuarioId);
  const { sinConexion } = useConexion();
  const { receta } = consulta;
  const actualizar = () => {
    void consulta.refetch({ cancelRefetch: false });
  };

  if (!receta) {
    if (sinConexion || consulta.isPaused) {
      return <Mensaje texto="Conéctate a internet para cargar tu receta." />;
    }
    if (consulta.isPending) {
      return <Mensaje texto="Cargando tu receta…" cargando />;
    }
    return (
      <Mensaje
        texto={
          obtenerMensajeError(consulta.error) ?? "No pudimos cargar tu receta."
        }
        accion={{ etiqueta: "Reintentar", ejecutar: actualizar }}
      />
    );
  }

  const aviso =
    errorCabeceraImagen ??
    (sinConexion || consulta.isPaused
      ? "Sin conexión."
      : consulta.isRefetchError
        ? "No pudimos actualizar la receta."
        : null);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 16 }}
      refreshControl={
        sinConexion ? undefined : (
          <RefreshControl
            refreshing={consulta.isRefetching && !consulta.isPaused}
            onRefresh={actualizar}
          />
        )
      }
    >
      {aviso && <Text style={styles.estadoTexto}>{aviso}</Text>}

      {/* La foto espera a que estén listas las cabeceras de la cuenta. */}
      <FotoReceta
        key={consulta.dataUpdatedAt}
        uri={cabecerasImagen ? receta.imagen_url : null}
        cabeceras={cabecerasImagen ?? undefined}
        style={styles.imagen}
      />

      <View style={{ marginHorizontal: 16, marginTop: 12, gap: 6 }}>
        <Text accessibilityRole="header" style={styles.titulo}>
          {receta.nombre}
        </Text>
        <Text selectable style={styles.descripcion}>
          {receta.descripcion}
        </Text>
        <Text style={styles.metaTexto}>
          {receta.visibilidad === "privada" ? "Privada" : "Publicada"}
          {" · "}
          {receta.tiempo_preparacion} min{" · "}
          {receta.porciones} porciones
        </Text>
        {receta.categoria && (
          <Text style={styles.metaTexto}>
            {receta.categoria.nombre}
            {receta.subcategoria ? " › " + receta.subcategoria.nombre : ""}
          </Text>
        )}
        {receta.solicitud_pendiente && (
          <Text style={styles.metaTexto}>
            {receta.visibilidad === "privada"
              ? "Publicación en revisión"
              : "Corrección en revisión. La versión aprobada sigue visible."}
          </Text>
        )}
      </View>

      {/* Usa la misma regla que la tarjeta y el estado recién consultado. */}
      <BotonesMisRecetas receta={receta} />
      <ContenidoReceta receta={receta} />
    </ScrollView>
  );
}

function Mensaje({
  texto,
  cargando,
  accion,
}: {
  texto: string;
  cargando?: boolean;
  accion?: { etiqueta: string; ejecutar: () => void };
}) {
  return (
    <View style={[styles.estadoContenedorError, { gap: 12 }]}>
      {cargando && <ActivityIndicator size="large" color="#FF4F0A" />}
      <Text style={styles.estadoTexto}>{texto}</Text>
      {accion && (
        <AppButton label={accion.etiqueta} onPress={accion.ejecutar} />
      )}
    </View>
  );
}

export default DetalleMiReceta;
