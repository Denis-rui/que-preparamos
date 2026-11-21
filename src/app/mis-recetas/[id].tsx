import BotonesMisRecetas from "@/components/mis-recetas/BotonesMisRecetas";
import { ValoracionMiReceta } from "@/components/mis-recetas/ValoracionMiReceta";
import { BotonLecturaReceta } from "@/components/recetas/BotonLecturaReceta";
import { ContenidoReceta } from "@/components/recetas/ContenidoReceta";
import { FotoReceta } from "@/components/recetas/FotoReceta";
import { DatosReceta } from "@/components/recetas/InformacionReceta";
import { AppButton } from "@/components/ui/appButton";
import { BotonVolver } from "@/components/ui/botonVolver";
import useAccesoCrear from "@/hooks/useAccesoCrear";
import useCabecerasImagenReceta from "@/hooks/useCabecerasImagenReceta";
import { useConexion } from "@/hooks/useConexion";
import useDetalleMiReceta from "@/hooks/useDetalleMiReceta";
import { styles } from "@/styles/receta.styles";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
  const [gestionAbierta, setGestionAbierta] = useState(false);

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
  const publicada = receta.visibilidad === "publicada";
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

      <View style={[styles.encabezadoFila, propia.encabezado]}>
        <View style={styles.encabezadoTextos}>
          <Text accessibilityRole="header" style={styles.titulo}>
            {receta.nombre}
          </Text>
          <Text selectable style={styles.descripcion}>
            {receta.descripcion}
          </Text>
        </View>

        {/* El autor puede valorar su receta cuando está publicada. */}
        {publicada && (
          <ValoracionMiReceta
            id={id}
            usuarioId={usuarioId}
            sinConexion={sinConexion}
          />
        )}
      </View>

      <View style={propia.estados}>
        <View
          style={[
            propia.etiqueta,
            { backgroundColor: publicada ? "#DDF3D0" : "#EEE3D7" },
          ]}
        >
          <MaterialCommunityIcons
            name={publicada ? "check-circle" : "lock"}
            size={16}
            color={publicada ? "#226423" : "#552414"}
          />
          <Text
            style={[propia.etiquetaTexto, publicada && propia.textoPublicada]}
          >
            {publicada ? "Publicada" : "Privada"}
          </Text>
        </View>

        {receta.solicitud_pendiente && (
          <View style={[propia.etiqueta, propia.enRevision]}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="#744900"
            />
            <Text style={[propia.etiquetaTexto, propia.textoRevision]}>
              {publicada ? "Corrección en revisión" : "Publicación en revisión"}
            </Text>
          </View>
        )}
      </View>

      {publicada && receta.solicitud_pendiente && (
        <Text style={[styles.descripcion, propia.avisoRevision]}>
          La versión aprobada sigue visible.
        </Text>
      )}

      <DatosReceta receta={receta} />

      {/* El desplegable oculta los botones y deja a la vista el estado y la receta. */}
      <View style={propia.gestion}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: gestionAbierta }}
          onPress={() => setGestionAbierta((abierta) => !abierta)}
          style={propia.encabezadoGestion}
        >
          <Text style={propia.etiquetaTexto}>Gestionar receta</Text>
          <MaterialCommunityIcons
            name={gestionAbierta ? "chevron-up" : "chevron-down"}
            size={22}
            color="#552414"
          />
        </Pressable>

        {gestionAbierta && <BotonesMisRecetas receta={receta} />}
      </View>

      <ContenidoReceta
        receta={receta}
        accionPreparacion={<BotonLecturaReceta pasos={receta.pasos} />}
      />
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
const propia = StyleSheet.create({
  encabezado: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  estados: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  etiqueta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  etiquetaTexto: {
    color: "#552414",
    fontFamily: "Inter_600SemiBold",
    flexShrink: 1,
  },
  textoPublicada: { color: "#226423" },
  enRevision: { backgroundColor: "#FFE8A3" },
  textoRevision: { color: "#744900" },
  avisoRevision: { marginHorizontal: 16, marginTop: 4 },
  gestion: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3D9CE",
    backgroundColor: "#FFFFFF",
  },
  encabezadoGestion: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});
