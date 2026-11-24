import { styles } from "@/styles/receta.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InvitarInicioSesion } from "@/components/auth/InvitarInicioSesion";
import { BotonLecturaReceta } from "@/components/recetas/BotonLecturaReceta";
import { ContenidoReceta } from "@/components/recetas/ContenidoReceta";
import { CorazonFavorito } from "@/components/recetas/CorazonFavorito";
import {
  BloqueValoracionReceta,
  DatosReceta,
} from "@/components/recetas/InformacionReceta";
import ModalValoracion from "@/components/recetas/ModalValoracion";
import { BotonVolver } from "@/components/ui/botonVolver";
import { useConexion } from "@/hooks/useConexion";
import { useFavoritoLocal } from "@/hooks/useFavoritoLocal";
import { useMiValoracion } from "@/hooks/useMiValoracion";
import { useRecetaDetalle } from "@/hooks/useRecetaDetalle";
import { useValorarReceta } from "@/hooks/useValorarReceta";
import { obtenerToken } from "@/storage/token";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export default function DetalleReceta() {
  const { id, local } = useLocalSearchParams<{ id: string; local?: string }>();
  const { receta, loading, error } = useRecetaDetalle(id, local === "1");
  const favorito = useFavoritoLocal(id);
  const { sinConexion } = useConexion();

  const {
    valorar,
    guardando,
    error: errorValoracion,
    reiniciar,
    exito,
  } = useValorarReceta(id);

  const [modalVisible, setModalVisible] = useState(false);
  const [invitacionVisible, setInvitacionVisible] = useState(false);
  const [conSesion, setConSesion] = useState(false);
  const [editando, setEditando] = useState(false);
  const { miPuntuacion } = useMiValoracion(
    id,
    conSesion && !sinConexion && local !== "1",
  );

  useFocusEffect(
    useCallback(() => {
      obtenerToken().then((t) => setConSesion(!!t));
    }, []),
  );

  const alPresionarCalificar = async () => {
    const token = await obtenerToken();
    if (token) {
      reiniciar(); // Limpiamos la valoración anterior.
      setEditando(miPuntuacion != null);
      setModalVisible(true); // Abrimos la valoración.
    } else {
      setInvitacionVisible(true); // Pedimos iniciar sesión.
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.estadoContenedor}>
        <ActivityIndicator size="large" color="#FF4F0A" />
      </SafeAreaView>
    );
  }

  if (error || !receta) {
    const mensaje =
      error ??
      (sinConexion
        ? "No pudimos comunicarnos con el servidor. Revisa tu conexión."
        : "No se pudo cargar la receta.");

    return (
      <SafeAreaView style={styles.estadoContenedorError}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={40}
          color="#9C8B7A"
        />
        <Text style={styles.estadoTexto}>{mensaje}</Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.estadoBotonVolver}
        >
          <Text style={styles.estadoBotonVolverTexto}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.contenedor}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.header}>
        <BotonVolver variante="blanco" />

        <View style={styles.logoContenedor}>
          <Image
            source={require("../../assets/imagenes/icono_sombrero_chef.png")}
            style={styles.logoSombrero}
            contentFit="contain"
          />

          <Image
            source={require("../../assets/imagenes/titulo.png")}
            style={styles.logoTitulo}
            contentFit="contain"
          />
        </View>

        <Pressable
          onPress={async () => {
            const quitandoCopia = local === "1" && favorito.esFavorito;
            const guardado = await favorito.alternar(receta);
            if (guardado && quitandoCopia) router.back();
          }}
          disabled={favorito.ocupado || !favorito.preparado}
          accessibilityRole="button"
          accessibilityLabel={
            favorito.esFavorito
              ? "Quitar de favoritos"
              : "Guardar en favoritos y descargar"
          }
          accessibilityState={{
            disabled: favorito.ocupado || !favorito.preparado,
            selected: favorito.esFavorito,
          }}
          style={[
            styles.botonCircular,
            favorito.ocupado && styles.guardandoFavorito,
          ]}
        >
          <CorazonFavorito seleccionado={favorito.esFavorito} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {local === "1" ? (
          <Text style={styles.estadoTexto}>
            Copia guardada en este dispositivo.
          </Text>
        ) : null}
        {favorito.ocupado ? (
          <Text style={styles.estadoTexto}>Guardando cambios...</Text>
        ) : null}
        {favorito.error ? (
          <Text accessibilityRole="alert" style={styles.estadoTexto}>
            {favorito.error}
          </Text>
        ) : null}
        {sinConexion ? (
          <Text style={styles.estadoTexto}>
            Sin conexión. Las valoraciones requieren internet.
          </Text>
        ) : null}
        {receta.imagen_url ? (
          <Image
            source={{ uri: receta.imagen_url }}
            style={styles.imagen}
            contentFit="cover"
          />
        ) : null}

        <View style={styles.encabezadoFila}>
          <View style={styles.encabezadoTextos}>
            <Text style={styles.titulo}>{receta.nombre}</Text>
            <Text style={styles.descripcion}>{receta.descripcion}</Text>
          </View>

          {/* Valoración junto al nombre. */}
          <BloqueValoracionReceta
            total={receta.cantidad_valoraciones}
            promedio={receta.valoracion_promedio}
            deshabilitado={sinConexion}
            alPulsar={alPresionarCalificar}
          />
        </View>

        <DatosReceta receta={receta} />

        {/* Ingredientes, pasos y consejos. */}
        <ContenidoReceta
          receta={receta}
          accionPreparacion={<BotonLecturaReceta pasos={receta.pasos} />}
        />
      </ScrollView>

      <ModalValoracion
        visible={modalVisible}
        editando={editando}
        puntuacionActual={miPuntuacion}
        guardando={guardando}
        exito={exito}
        error={errorValoracion}
        onClose={() => {
          setModalVisible(false);
        }}
        onCalificar={(puntaje) => valorar(puntaje)}
      />

      <InvitarInicioSesion
        visible={invitacionVisible}
        onClose={() => setInvitacionVisible(false)}
        volverA={`/receta/${id}`}
      />
    </SafeAreaView>
  );
}
