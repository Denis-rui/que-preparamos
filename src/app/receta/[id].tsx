import { styles } from "@/styles/receta.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, Path, Text as SvgText, TextPath } from "react-native-svg";

import { InvitarInicioSesion } from "@/components/auth/InvitarInicioSesion";
import { IconoGorroChef } from "@/components/recetas/IconoGorroChef";
import ModalValoracion from "@/components/recetas/ModalValoracion";
import { BotonVolver } from "@/components/ui/botonVolver";
import { useConexion } from "@/hooks/useConexion";
import { useFavoritoLocal } from "@/hooks/useFavoritoLocal";
import { useMiValoracion } from "@/hooks/useMiValoracion";
import { useRecetaDetalle } from "@/hooks/useRecetaDetalle";
import { useValorarReceta } from "@/hooks/useValorarReceta";
import { obtenerToken } from "@/storage/token";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export default function DetalleReceta() {
  const { id, local } = useLocalSearchParams<{ id: string; local?: string }>();
  const { receta, loading, error } = useRecetaDetalle(id, local === "1");
  const favorito = useFavoritoLocal(id);
  const { sinConexion } = useConexion();

  const { valorar, guardando, error: errorValoracion, reiniciar, exito } =useValorarReceta(id);

  const [modalVisible, setModalVisible] = useState(false);
  const [leyendo, setLeyendo] = useState(false);
  const [invitacionVisible, setInvitacionVisible] = useState(false);
  const [conSesion, setConSesion] = useState(false);
  const [editando, setEditando] = useState(false);
  const { miPuntuacion } = useMiValoracion(id, conSesion && !sinConexion && local !== "1");

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      obtenerToken().then((t) => setConSesion(!!t));
    }, []),
  );

  const alternarLectura = () => {
    if (!receta?.pasos?.length) return;

    if (leyendo) {
      Speech.stop();
      setLeyendo(false);
      return;
    }

    const texto = receta.pasos
      .map((paso: any) => `Paso ${paso.orden}. ${paso.instruccion}`)
      .join(".");

    Speech.speak(texto, {
      language: "es-ES",
      onDone: () => setLeyendo(false),
      onStopped: () => setLeyendo(false),
      onError: () => setLeyendo(false),
    });

    setLeyendo(true);
  };

  const alPresionarCalificar = async () => {
    const token = await obtenerToken();
    if (token) {
      reiniciar(); // limpia el resultado de una calificación anterior
      setEditando(miPuntuacion != null);
      setModalVisible(true); // con sesión: abre la calificación
    } else {
      setInvitacionVisible(true); // invitado: lo invita a iniciar sesión
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
    const mensaje = error ?? (
      sinConexion
        ? "No pudimos comunicarnos con el servidor. Revisa tu conexión."
        : "No se pudo cargar la receta."
    );

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

  const total = receta.cantidad_valoraciones;
  const tieneValoraciones = total>0;

  const textoValoraciones = total === 0 ? "Sin valoraciones" : `(${total} ${total === 1 ? "valoración" : "valoraciones"})`;

  const promedio = tieneValoraciones && receta.valoracion_promedio != null ? `${Number(receta.valoracion_promedio).toFixed(1)}/5` : null;

  const proporcion = tieneValoraciones && receta.valoracion_promedio != null ? Math.min(Math.max(receta.valoracion_promedio / 5, 0), 1) : 0;

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
          accessibilityLabel={favorito.esFavorito ? "Quitar de favoritos" : "Guardar en favoritos y descargar"}
          accessibilityState={{ disabled: favorito.ocupado || !favorito.preparado, selected: favorito.esFavorito }}
          style={[styles.botonCircular, favorito.ocupado && { opacity: 0.5 }]}
        >
          <MaterialCommunityIcons
            name={favorito.esFavorito ? "heart" : "heart-outline"}
            size={24}
            color="#552414"
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {local === "1" ? <Text style={styles.estadoTexto}>Copia guardada en este dispositivo.</Text> : null}
        {favorito.ocupado ? <Text style={styles.estadoTexto}>Guardando cambios...</Text> : null}
        {favorito.error ? <Text accessibilityRole="alert" style={styles.estadoTexto}>{favorito.error}</Text> : null}
        {sinConexion ? <Text style={styles.estadoTexto}>Sin conexión. Las valoraciones requieren internet.</Text> : null}
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

          <View style={styles.encabezadoValoracion}>
            <View style={styles.lineaVertical} />

            <Pressable
              onPress={alPresionarCalificar}
              disabled={sinConexion}
              style={({ pressed }) => [
                styles.valoracionBloque,
                pressed && styles.valoracionPresionado,
              ]}
            >
              <Svg
                width={84}
                height={30}
                viewBox="0 0 96 34"
                style={{ marginLeft: -4 }}
              >
                <Defs>
                  <Path id="curva" d="M4 26 Q48 6 92 26" />
                </Defs>
                <SvgText
                  fill="#552714"
                  fontSize="12"
                  fontFamily="Kavoon_400Regular"
                  textAnchor="middle"
                >
                  <TextPath href="#curva" startOffset="50%">
                    ¡Califícanos!
                  </TextPath>
                </SvgText>
              </Svg>

              <View style={styles.valoracionFila}>
                <View>
                  <IconoGorroChef  proporcion={proporcion} size={38} />
                </View>

                {promedio ? (
                  <Text style={styles.valoracionPromedio}>{promedio}</Text>
                ) : null}

              </View>

              <Text style={styles.valoracionCantidad} numberOfLines={1}>
                {textoValoraciones}
              </Text>
            </Pressable>
          </View>

        </View>

        <View style={styles.metaFila}>

          {receta.categoria ? (
            <>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={18}
                  color="#552414"
                />
                <View style={styles.metaCategoria}>
                  <Text style={styles.metaTexto}>{receta.categoria.nombre}</Text>
                  {receta.subcategoria ? (
                    <>
                      <MaterialCommunityIcons name="chevron-right" size={16} color="#F26A1B" />
                      <Text style={styles.metaTexto}>{receta.subcategoria.nombre}</Text>
                    </>
                  ): null}
                </View>
              </View>
              <View style={styles.metaSeparador}/>
            </>
          ) : null}

          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={22}
              color="#552414"
            />
            <Text style={styles.metaTexto}>
              {receta.tiempo_preparacion} min
            </Text>
          </View>

          <View style={styles.metaSeparador}/>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={22}
              color="#552414"
            />
            <Text style={styles.metaTexto}>{receta.porciones} porciones</Text>
          </View>
        </View>

        {/* Ingredientes */}
        <View style={styles.ingredientesCard}>
          <Text style={styles.ingredientesTitulo}>Ingredientes</Text>
          <View style={styles.ingredientesGrid}>
            {receta.ingredientes?.map((ing) => (
              <View key={ing.ingrediente_id} style={styles.ingredienteItem}>
                <View style={styles.ingredienteBullet} />
                <Text style={styles.ingredienteTexto}>
                  {ing.cantidad ? `${ing.cantidad} ${ing.unidad ?? ""} ` : ""}
                  {ing.nombre}
                  {ing.notas ? ` (${ing.notas})` : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pasos */}
        <View style={styles.preparacionCard}>
          <View style={styles.preparacionHeader}>
            <Text style={styles.preparacionTitulo}>Preparación</Text>
            <Pressable onPress={alternarLectura} style={styles.botonAudio}>
              <MaterialCommunityIcons
                name={leyendo ? "pause" : "play"}
                size={20}
                color="#FF4F0A"
              />
            </Pressable>
          </View>
          {receta.pasos?.map((paso) => (
            <View key={paso.orden} style={styles.pasoFila}>
              <View style={styles.pasoNumero}>
                <Text style={styles.pasoNumeroTexto}>{paso.orden}</Text>
              </View>
              <Text style={styles.pasoTexto}>{paso.instruccion}</Text>
            </View>
          ))}
        </View>

        {/* Tips (opcional) */}
        {receta.tips ? (
          <View style={styles.tipsCard}>
            <View style={styles.tipsEncabezado}>
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={22}
                color="#FF4F0A"
              />
              <Text style={styles.tipsTitulo}>Tips del chef</Text>
            </View>
            <Text style={styles.tipsTexto}>{receta.tips}</Text>
          </View>
        ) : null}
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
        onCalificar={(puntaje) =>
          valorar(puntaje)
        }
      />

      <InvitarInicioSesion
        visible={invitacionVisible}
        onClose={() => setInvitacionVisible(false)}
        volverA={`/receta/${id}`}
      />
    </SafeAreaView>
  );
}
