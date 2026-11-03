import { obtenerMensajeError } from "@/utils/mensajeError";
import { isAxiosError } from "axios";

import { obtenerCantidadFavoritos } from "@/api/favoritos";
import { obtenerPerfil } from "@/api/perfil";
import { cerrarSesion } from "@/api/sesion";
import { LogoQuePreparamos } from "@/components/LogoQuePreparamos";
import {
  PerfilGuardadoParcialError,
  useActualizarPerfil,
} from "@/hooks/useActualizarPerfil";
import { obtenerToken } from "@/storage/token";
import { reiniciarNavegacion } from "@/utils/navegacion";
import { aPerfilEditable } from "@/utils/perfil";
import type { EditableProfile } from "@/types/perfil";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditarPerfilModal from "@/components/editar-perfil-modal";
import { styles } from "@/styles/perfil.styles";

export default function MiPerfil() {
  const { guardarPerfil, guardando, limpiarEstado } = useActualizarPerfil();
  const [notice, setNotice] = useState("");
  const [tokenFoto, setTokenFoto] = useState<string | null>(null);
  const [versionFoto, setVersionFoto] = useState(0);
  const [fotoNoDisponible, setFotoNoDisponible] = useState(false);
  const [profile, setProfile] = useState<EditableProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saliendo, setSaliendo] = useState(false);
  const [haySesion, setHaySesion] = useState(false);
  const [cantidadGuardadas, setCantidadGuardadas] = useState<number | null>(
    null,
  );
  const [cargandoGuardadas, setCargandoGuardadas] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      async function cargarPerfil() {
        setLoading(true);
        setProfile(null);
        setTokenFoto(null);
        setFotoNoDisponible(false);
        setCantidadGuardadas(null);
        setCargandoGuardadas(false);
        setEditing(false);
        setNotice("");
        try {
          // Un invitado no tiene token; no lo tratamos como sesión vencida.
          const token = await obtenerToken();
          if (activo) {
            setHaySesion(Boolean(token));
            setTokenFoto(token);
          }
          if (!token) return;
          if (!activo) return;
          const usuario = await obtenerPerfil();
          if (activo)
            setProfile(aPerfilEditable(usuario));
          if (!activo) return;
          setCargandoGuardadas(true);
          try {
            const cantidad = await obtenerCantidadFavoritos();
            if (activo) setCantidadGuardadas(cantidad);
          } catch {
            // Si falla el contador de favoritos, mantenemos visible el perfil    e  indicamos que la cantidad no está disponible.
            // Si la sesión venció (401), Axios solicita iniciar sesión nuevamente
          } finally {
            if (activo) setCargandoGuardadas(false);
          }
        } catch (error) {
          // El 401 se maneja en clienteAutenticado, sin repetir navegación aquí.
          if (
            activo &&
            !(isAxiosError(error) && error.response?.status === 401)
          ) {
            setNotice(
              obtenerMensajeError(error) ??
                "No pudimos cargar tu perfil. Inténtalo nuevamente.",
            );
          }
        } finally {
          if (activo) setLoading(false);
        }
      }
      void cargarPerfil();
      return () => {
        activo = false;
      };
    }, []),
  );

  async function salir() {
    if (loading || saliendo) return;
    // El invitado no tiene sesión que revocar: vuelve a la bienvenida.
    if (!haySesion) {
      reiniciarNavegacion("/welcome");
      return;
    }
    setSaliendo(true);
    setNotice("");
    try {
      await cerrarSesion();
      setProfile(null);
      setEditing(false);
      reiniciarNavegacion("/welcome");
    } catch {
      setNotice("No pudimos cerrar sesión. Inténtalo nuevamente.");
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

          {loading ? (
            <Text style={styles.notice}>Cargando perfil...</Text>
          ) : null}
          {!loading && !profile && !notice ? (
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
              {/* La fila ocupa todo el ancho, sin comprimir botones junto al avatar. */}
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
                    // La ruta puede conservar la misma URL después de reemplazar la foto.
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
              ]}
              onPress={salir}
              disabled={loading || saliendo}
              accessibilityState={{ disabled: loading || saliendo }}
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
                    ? "Salir de tu cuenta actual"
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
          {notice ? (
            <Text style={styles.notice} accessibilityLiveRegion="polite">
              {notice}
            </Text>
          ) : null}
        </View>
      </ScrollView>
      {editing && profile && (
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
              // Mostramos los datos confirmados por Laravel.
              setProfile(aPerfilEditable(usuario));
              setEditing(false);
              setFotoNoDisponible(false);
              if (foto) setVersionFoto((version) => version + 1);
              setNotice("Perfil actualizado correctamente.");
            } catch (error) {
              // Si falló solo la foto, reflejamos el nombre/correo que sí se guardaron.
              if (error instanceof PerfilGuardadoParcialError) {
                setProfile(aPerfilEditable(error.usuario));
              }
              throw error;
            } finally {
              // El modal muestra los errores y permanece abierto si falla el envío.
              limpiarEstado();
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
