import { usePerfilConsulta } from "@/hooks/usePerfilConsulta";
import { obtenerMensajeError } from "@/utils/mensajeError";

import { esFalloDeConexion, useConexion } from "@/hooks/useConexion";

import { cerrarSesion } from "@/api/sesion";
import { LogoQuePreparamos } from "@/components/LogoQuePreparamos";
import {
  PerfilGuardadoParcialError,
  useActualizarPerfil,
} from "@/hooks/useActualizarPerfil";

import { reiniciarNavegacion } from "@/utils/navegacion";
import { aPerfilEditable } from "@/utils/perfil";

import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useIsFocused } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditarPerfilModal from "@/components/editar-perfil-modal";
import { styles } from "@/styles/perfil.styles";

export default function MiPerfil() {
  const enfocado = useIsFocused();
  const { sinConexion } = useConexion();
  const {
    consulta,
    dispositivo,
    token: tokenFoto,
    actualizar,
  } = usePerfilConsulta();
  const { guardarPerfil, guardando, limpiarEstado } = useActualizarPerfil();
  const [notice, setNotice] = useState("");
  const [perfilActualizado, setPerfilActualizado] = useState(false);
  const [versionFoto, setVersionFoto] = useState(0);
  const [fotoNoDisponible, setFotoNoDisponible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [avisoDesconexion, setAvisoDesconexion] = useState(false);
  const [avisoReconexion, setAvisoReconexion] = useState(false);
  const estabaSinConexion = useRef(sinConexion);
  const haySesion = Boolean(tokenFoto);
  const datos = consulta.data;
  const profile = datos
    ? { ...aPerfilEditable(datos.usuario), photoUri: datos.photoUri }
    : null;
  const modoLocal =
    sinConexion || consulta.isPaused || esFalloDeConexion(consulta.error);
  // Si la consulta está esperando internet, no la mostramos como si estuviera cargando.
  const loading =
    dispositivo.isPending ||
    (haySesion && consulta.isPending && consulta.isFetching);
  const cantidadGuardadas = dispositivo.data?.cantidad ?? null;
  const cargandoGuardadas = dispositivo.isFetching;
  const errorInicial = !datos && (consulta.isError || dispositivo.isError);
  const esperandoConexion = haySesion && !datos && consulta.isPaused;
  const actualizandoPerfil =
    !sinConexion && (avisoReconexion || (Boolean(datos) && consulta.isFetching));

  useFocusEffect(
    useCallback(() => {
      setEditing(false);
      setNotice("");
      setPerfilActualizado(false);
      if (!sinConexion) {
        if (!estabaSinConexion.current || !haySesion) return;
        estabaSinConexion.current = false;
        // Damos tiempo para leer el mensaje aunque el perfil se actualice rápido.
        setAvisoReconexion(true);
        const timer = setTimeout(() => setAvisoReconexion(false), 2000);
        return () => {
          clearTimeout(timer);
          setAvisoReconexion(false);
        };
      }
      estabaSinConexion.current = true;
      setAvisoDesconexion(true);
      const timer = setTimeout(() => setAvisoDesconexion(false), 2000);
      return () => {
        clearTimeout(timer);
        setAvisoDesconexion(false);
      };
    }, [sinConexion, haySesion]),
  );

  useEffect(() => {
    setFotoNoDisponible(false);
  }, [datos?.photoUri]);
  useEffect(() => {
    if (!perfilActualizado) return;
    const timer = setTimeout(() => setPerfilActualizado(false), 2000);
    return () => clearTimeout(timer);
  }, [perfilActualizado]);
  useEffect(() => {
    if (datos?.avisoFoto) setNotice(datos.avisoFoto);
  }, [datos?.avisoFoto, consulta.dataUpdatedAt]);

  async function salir() {
    if (loading || saliendo) return;
    if (haySesion && sinConexion) return;
    // Si entró como invitado, solo lo llevamos de vuelta a la bienvenida.
    if (!haySesion) {
      reiniciarNavegacion("/welcome");
      return;
    }
    setSaliendo(true);
    setNotice("");
    try {
      await cerrarSesion();

      setEditing(false);
      reiniciarNavegacion("/welcome");
    } catch (error) {
      setNotice(
        obtenerMensajeError(error) ??
          "No pudimos cerrar sesión. Inténtalo nuevamente.",
      );
    } finally {
      setSaliendo(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LogoQuePreparamos />
        <View style={styles.page}>
          <View style={styles.headingRow}>
            <Image
              source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
              style={styles.headingLeaves}
              contentFit="contain"
            />
            <Text accessibilityRole="header" style={styles.heading}>
              Mi perfil
            </Text>
            <Image
              source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
              style={styles.headingLeaves}
              contentFit="contain"
            />
          </View>
          <Text style={styles.subtitle}>Tu espacio personal</Text>
          {modoLocal ? (
            <Text style={styles.notice}>
              Sin conexión. Puedes consultar tus favoritos descargados.
            </Text>
          ) : null}

          {loading ? (
            <Text style={styles.notice}>Cargando perfil...</Text>
          ) : null}
          {!dispositivo.isPending && !dispositivo.isError && !haySesion ? (
            <View style={styles.guestCard}>
              <View style={styles.guestHeader}>
                <Image
                  source={require("../../assets/SVG/iconos/avatar_perfil.svg")}
                  style={styles.avatar}
                  contentFit="contain"
                />
                <View style={styles.profileCopy}>
                  <Text style={styles.guestTitle}>Estás como invitado</Text>
                  <Text style={styles.profileDetail}>
                    Inicia sesión o crea una cuenta para tener tu perfil.
                  </Text>
                </View>
              </View>
              {/* Dejamos los botones en otra fila para que no queden apretados junto a la foto. */}
              <View style={styles.guestActions}>
                <Pressable
                  onPress={() => router.push("/login")}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.guestButton,
                    styles.guestButtonPrimary,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.guestButtonPrimaryText}>
                    Iniciar sesión
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push("/register")}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.guestButton,
                    styles.guestButtonSecondary,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.guestButtonSecondaryText}>
                    Crear cuenta
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
          {esperandoConexion ? (
            <Text style={styles.notice}>
              Sin conexión. La consulta está en espera; conéctate una vez para
              descargar tu perfil.
            </Text>
          ) : null}
          {datos && consulta.isPaused && !sinConexion ? (
            <Text style={styles.notice}>
              Actualización en espera de conexión.
            </Text>
          ) : null}
          {datos && consulta.isError ? (
            <Text style={styles.notice}>
              No se pudo actualizar el perfil. Conservamos tus datos
              disponibles.
            </Text>
          ) : null}
          {errorInicial ? (
            <View>
              <Text style={styles.notice}>
                {obtenerMensajeError(consulta.error ?? dispositivo.error) ??
                  "No pudimos cargar tu perfil."}
              </Text>
              <Pressable
                accessibilityRole="button"
                style={styles.modalButton}
                onPress={() => {
                  if (dispositivo.isError) void dispositivo.refetch();
                  else void consulta.refetch();
                }}
              >
                <Text style={styles.guestButtonPrimaryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : null}
          {profile ? (
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Image
                    source={
                      profile.photoUri && !fotoNoDisponible
                        ? {
                            uri: profile.photoUri,
                            headers: tokenFoto
                              ? { Authorization: `Bearer ${tokenFoto}` }
                              : undefined,
                          }
                        : require("../../assets/SVG/iconos/avatar_perfil.svg")
                    }
                    style={
                      profile.photoUri && !fotoNoDisponible
                        ? styles.profilePhoto
                        : styles.avatar
                    }
                    contentFit={
                      profile.photoUri && !fotoNoDisponible
                        ? "cover"
                        : "contain"
                    }
                    // La foto puede cambiar aunque el servidor siga usando la misma dirección.
                    key={`${profile.photoUri ?? "avatar"}-${versionFoto}`}
                    cachePolicy="none"
                    onError={() => {
                      if (!profile.photoUri || fotoNoDisponible) return;
                      setFotoNoDisponible(true);
                      setNotice(
                        "No pudimos descargar la foto del servidor. La edición puede haberse guardado; vuelve a entrar para reintentar.",
                      );
                    }}
                  />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Editar mi perfil"
                  onPress={() => setEditing(true)}
                  disabled={modoLocal}
                  accessibilityState={{ disabled: modoLocal }}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image
                    source={require("../../assets/SVG/iconos/editar_lapiz.svg")}
                    style={styles.editIcon}
                    contentFit="contain"
                  />
                </Pressable>
              </View>
              <View style={styles.profileCopy}>
                <Text style={styles.profileTitle}>{profile.name}</Text>
                <Text style={styles.profileDetail}>{profile.email}</Text>
                <Text style={styles.profileDetail}>
                  {cargandoGuardadas
                    ? "Cargando recetas guardadas..."
                    : cantidadGuardadas === null
                      ? "Cantidad de recetas no disponible"
                      : `${cantidadGuardadas} ${cantidadGuardadas === 1 ? "receta guardada" : "recetas guardadas"}`}
                </Text>
              </View>
            </View>
          ) : null}

          <Text accessibilityRole="header" style={styles.optionsTitle}>
            Opciones
          </Text>
          <View style={styles.options}>
            <Pressable
              onPress={() => router.push("/favoritos")}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require("../../assets/SVG/iconos/favoritos_circulo.svg")}
                style={styles.optionCircle}
                contentFit="contain"
              />
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>Favoritos</Text>
                <Text style={styles.optionDescription}>
                  Consulta las recetas que guardaste
                </Text>
              </View>
              <Image
                source={require("../../assets/SVG/iconos/chevron.svg")}
                style={styles.chevron}
                contentFit="contain"
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.optionCircle, styles.recipesCircle]}>
                <Image
                  source={require("../../assets/SVG/iconos/ingredientes.svg")}
                  style={styles.optionIcon}
                  tintColor="#FF5008"
                  contentFit="contain"
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>Mis recetas</Text>
                <Text style={styles.optionDescription}>
                  Coleccionando las que más me gusta
                </Text>
              </View>
              <Image
                source={require("../../assets/SVG/iconos/chevron.svg")}
                style={styles.chevron}
                contentFit="contain"
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.pressed,
                haySesion &&
                  sinConexion && { backgroundColor: "#E3E3E3", opacity: 0.65 },
              ]}
              onPress={salir}
              disabled={loading || saliendo || (haySesion && sinConexion)}
              accessibilityState={{
                disabled: loading || saliendo || (haySesion && sinConexion),
              }}
            >
              <View style={[styles.optionCircle, styles.logoutCircle]}>
                <Image
                  source={require("../../assets/SVG/iconos/cerrar_sesion.svg")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>
                  {saliendo
                    ? "Cerrando sesión..."
                    : haySesion
                      ? "Cerrar sesión"
                      : "Volver a la bienvenida"}
                </Text>
                <Text style={styles.optionDescription}>
                  {haySesion
                    ? sinConexion
                      ? "No hay conexión a internet"
                      : "Salir de tu cuenta actual"
                    : "Elegir cómo quieres ingresar"}
                </Text>
              </View>
              <Image
                source={require("../../assets/SVG/iconos/chevron.svg")}
                style={styles.chevron}
                contentFit="contain"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {enfocado && perfilActualizado && (
        <View pointerEvents="none" style={styles.successOverlay}>
          <View style={styles.successCard} accessibilityLiveRegion="polite" accessibilityRole="alert">
            <Ionicons name="checkmark-circle" size={32} color="#27833E" />
            <Text style={styles.successMessage}>Perfil actualizado correctamente</Text>
          </View>
        </View>
      )}
      <Modal
        transparent
        animationType="fade"
        visible={enfocado && !editing && (loading || actualizandoPerfil || avisoDesconexion || Boolean(notice))}
        onRequestClose={() => {
          if (!loading && !actualizandoPerfil && !avisoDesconexion) setNotice("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.noticeModal} accessibilityViewIsModal>
            {(loading || actualizandoPerfil || avisoDesconexion) && (
              <ActivityIndicator size="large" color="#FF5008" />
            )}
            <Text style={styles.modalMessage} accessibilityLiveRegion="polite">
              {avisoDesconexion
                ? "Sin conexión. Puedes consultar tus favoritos descargados."
                : loading
                  ? "Cargando perfil..."
                  : actualizandoPerfil
                    ? "Actualizando perfil..."
                    : notice}
            </Text>
            {!loading && !actualizandoPerfil && !avisoDesconexion && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setNotice("")}
                style={styles.modalButton}
              >
                <Text style={styles.guestButtonPrimaryText}>Entendido</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
      {enfocado && editing && profile && (
        <EditarPerfilModal
          profile={profile}
          guardando={guardando}
          fotoHeaders={
            tokenFoto ? { Authorization: `Bearer ${tokenFoto}` } : undefined
          }
          onClose={() => {
            if (guardando) return;
            limpiarEstado();
            setEditing(false);
          }}
          onSave={async (updatedProfile, currentPassword, foto) => {
            setNotice("");
            setPerfilActualizado(false);
            try {
              const usuario = await guardarPerfil({
                ...(updatedProfile.name !== profile.name
                  ? { name: updatedProfile.name }
                  : {}),
                ...(updatedProfile.email !== profile.email
                  ? {
                      email: updatedProfile.email,
                      current_password: currentPassword,
                    }
                  : {}),
                foto,
              });
              // Mostramos los datos que el servidor acaba de guardar.
              const aviso = await actualizar(usuario);
              setEditing(false);
              setFotoNoDisponible(false);
              if (foto) setVersionFoto((version) => version + 1);
              if (aviso) setNotice(aviso);
              else setPerfilActualizado(true);
            } catch (error) {
              // Si solo falló la foto, mostramos el nombre y el correo que sí se guardaron.
              if (error instanceof PerfilGuardadoParcialError) {
                await actualizar(error.usuario, false);
              }
              throw error;
            } finally {
              // Si algo falla al guardar, dejamos el formulario abierto con el mensaje de error.
              limpiarEstado();
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
