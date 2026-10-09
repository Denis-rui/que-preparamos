import { ApiError } from "@/api/clienteAutenticado";
import { obtenerCantidadFavoritos } from "@/api/favoritos";
import { obtenerPerfil } from "@/api/perfil";
import { cerrarSesion } from "@/api/sesion";
import { LogoQuePreparamos } from "@/components/LogoQuePreparamos";
import { obtenerToken } from "@/storage/token";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditarPerfilModal, {
  type EditableProfile,
} from "@/components/editar-perfil-modal";
import { styles } from "@/styles/perfil.styles";

export default function MiPerfil() {
  const [notice, setNotice] = useState("");
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
        setCantidadGuardadas(null);
        setCargandoGuardadas(false);
        setEditing(false);
        setNotice("");
        try {
          // Un invitado no tiene token; no lo tratamos como sesión vencida.
          const token = await obtenerToken();
          if (activo) setHaySesion(Boolean(token));
          if (!token) return;
          if (!activo) return;
          const usuario = await obtenerPerfil();
          if (activo)
            setProfile({
              name: usuario.name,
              email: usuario.email,
              photoUri: usuario.foto_perfil_url ?? undefined,
            });
          if (!activo) return;
          setCargandoGuardadas(true);
          try {
            const cantidad = await obtenerCantidadFavoritos();
            if (activo) setCantidadGuardadas(cantidad);
          } catch {
            // Un fallo del contador no debe ocultar el perfil ni mostrar un cero falso.
            // El cliente compartido sigue gestionando los 401 de esta consulta.
          } finally {
            if (activo) setCargandoGuardadas(false);
          }
        } catch (error) {
          // El 401 se maneja en clienteAutenticado, sin repetir navegación aquí.
          if (activo && !(error instanceof ApiError && error.status === 401)) {
            setNotice(
              error instanceof ApiError
                ? error.message
                : "No pudimos cargar tu perfil. Revisa tu conexión e inténtalo nuevamente.",
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
      router.replace("/welcome");
      return;
    }
    setSaliendo(true);
    setNotice("");
    try {
      await cerrarSesion();
      setProfile(null);
      setEditing(false);
      router.replace("/login");
    } catch {
      setNotice(
        "No pudimos cerrar sesión. Revisa tu conexión e inténtalo nuevamente.",
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
                      profile.photoUri
                        ? { uri: profile.photoUri }
                        : require("../../assets/SVG/iconos/avatar_perfil.svg")
                    }
                    style={
                      profile.photoUri ? styles.profilePhoto : styles.avatar
                    }
                    contentFit={profile.photoUri ? "cover" : "contain"}
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
          onClose={() => setEditing(false)}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setEditing(false);
            // La edición existente aún es local; no afirmamos guardado remoto.
            setNotice(
              "Cambios solo en esta pantalla; todavía no se guardan en tu cuenta.",
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
