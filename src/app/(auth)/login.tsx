import { CLAVE_CUENTAS } from "@/config/cliente-query";
import {
  leerCuentasGuardadas,
  leerUltimaCuenta,
  olvidarCuenta,
} from "@/storage/cuentas";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { BotonVolver } from "@/components/ui/botonVolver";
import { getLoginStyles } from "@/styles/login.styles";
import { reiniciarNavegacion } from "@/utils/navegacion";

//Agregué aqui para abrir el modal
import {
  CuentaGuardada,
  CuentaGuardadaData,
} from "@/components/auth/CuentaGuardada";
import LoginModal from "@/components/auth/LoginModal";

type ModalActivo = "guardada" | "otra" | null;

export default function Login() {
  const { sesionVencida, volverA, restablecida } = useLocalSearchParams<{
    sesionVencida?: string;
    volverA?: string;
    restablecida?: string;
  }>();
  const [notice, setNotice] = useState("");

  // const [showOterAccounts, setShowOtherAccounts] = useState(false);
  const [cuentaAOlvidar, setCuentaAOlvidar] =
    useState<CuentaGuardadaData | null>(null);
  const olvidar = useMutation({
    mutationFn: olvidarCuenta,
    retry: false,
    networkMode: "always",
    gcTime: 0,
    onSuccess: () => setCuentaAOlvidar(null),
  });
  const isLoading = olvidar.isPending;
  const cuentas = useQuery({
    queryKey: CLAVE_CUENTAS,
    queryFn: leerCuentasGuardadas,
    networkMode: "always",
    retry: false,
  });
  const cuentasGuardadas = cuentas.data ?? [];

  //Agregue para la cuenta seleccionada
  const [modalActivo, setModalActivo] = useState<ModalActivo>(null);
  const [alturaFondoModal, setAlturaFondoModal] = useState<number | null>(null);
  const [cuentaSeleccionada, setCuentaSeleccionada] =
    useState<CuentaGuardadaData | null>(null);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const alturaDisponible = height - insets.top - insets.bottom;
  // El teclado del modal no debe redimensionar la ilustración y el pie del fondo.
  const styles = getLoginStyles(
    modalActivo && alturaFondoModal !== null
      ? alturaFondoModal
      : alturaDisponible,
  );

  // Tras restablecer la contraseña volvemos aquí con restablecida
  // mostramos el aviso y consumimos la señal para no repetirlo.
  useEffect(() => {
    if (restablecida !== "1") return;
    setNotice(
      "Tu contraseña se actualizó. Inicia sesión con tu nueva contraseña.",
    );
    router.setParams({ restablecida: undefined });
  }, [restablecida]);

  // Si la sesión venció, pedimos la contraseña de la última cuenta utilizada.
  useEffect(() => {
    if (sesionVencida !== "1") return;
    let activo = true;

    async function abrirIngreso() {
      let cuenta: CuentaGuardadaData | null = null;
      try {
        cuenta = await leerUltimaCuenta();
      } catch {
        // Sin una cuenta válida, el modal pedirá correo y contraseña.
      }

      if (!activo) return;
      setNotice("Tu sesión ya no es válida. Inicia sesión nuevamente.");
      setAlturaFondoModal(alturaDisponible);
      setCuentaSeleccionada(cuenta);
      setModalActivo(cuenta ? "guardada" : "otra");
      // Consumimos la señal para que cancelar no vuelva a abrir el modal.
      router.setParams({ sesionVencida: undefined });
    }

    void abrirIngreso();
    return () => {
      activo = false;
    };
  }, [sesionVencida, alturaDisponible]);

  function abrirModalCuenta(cuenta: CuentaGuardadaData) {
    setAlturaFondoModal(alturaDisponible);
    setCuentaSeleccionada(cuenta);
    setModalActivo("guardada");
  }

  function abrirModalOtraCuenta() {
    setAlturaFondoModal(alturaDisponible);
    setCuentaSeleccionada(null);
    setModalActivo("otra");
  }

  function cerrarModal() {
    setModalActivo(null);
    setCuentaSeleccionada(null);
  }

  function cancelarOlvido() {
    if (olvidar.isPending) return;
    setCuentaAOlvidar(null);
    olvidar.reset();
  }

  // Se ejecuta cuando LoginModal logra iniciar sesión (cuenta guardada u otra cuenta)
  async function handleLoginExitoso() {
    // useLogin ya guardó la cuenta; aquí solo cerramos el modal y navegamos.
    const destino =
      typeof volverA === "string" &&
      (volverA === "/(tabs)/crear" ||
        volverA === "/mis-recetas" ||
        volverA.startsWith("/receta/"))
        ? volverA
        : undefined;

    setNotice("");
    cerrarModal();
    if (destino && router.canGoBack()) {
      router.back();
      return;
    }
    reiniciarNavegacion("/(tabs)", destino as Href | undefined);
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.page}>
            <BotonVolver
              rutaAlternativa="/welcome"
              deshabilitado={isLoading}
              etiqueta="Volver a la bienvenida"
            />

            <View style={styles.brand}>
              <View
                style={styles.logoRow}
                accessible
                accessibilityLabel="¿Qué preparamos?"
              >
                <Image
                  source={require("../../assets/imagenes/icono_sombrero_chef.png")}
                  style={styles.chefHat}
                  contentFit="contain"
                />
                <Image
                  source={require("../../assets/imagenes/titulo.png")}
                  style={styles.titleLogo}
                  contentFit="contain"
                />
              </View>
              <View style={styles.taglineRow}>
                <View style={styles.taglineText}>
                  <Text
                    style={styles.taglineFirstLine}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Buenas comidas,
                  </Text>
                  <Text
                    style={styles.taglineSecondLine}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    mejores momentos
                  </Text>
                </View>
                <Image
                  source={require("../../assets/SVG/iconos/corazon_contorno.svg")}
                  style={styles.taglineHeart}
                  contentFit="contain"
                />
              </View>
              <Image
                source={require("../../assets/SVG/ilustraciones/chef_elegir_cuenta_con_adornos.svg")}
                style={styles.chef}
                contentFit="contain"
              />
              <View style={styles.headingRow}>
                <Image
                  source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                  style={styles.headingLeaves}
                  contentFit="contain"
                />
                <Text accessibilityRole="header" style={styles.heading}>
                  Elegir cuenta
                </Text>
                <Image
                  source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                  style={styles.headingLeaves}
                  contentFit="contain"
                />
              </View>
            </View>

            <View style={styles.accounts}>
              {cuentasGuardadas.length > 0 ? (
                cuentasGuardadas.map((cuenta) => (
                  <View
                    key={cuenta.id ?? cuenta.email}
                    style={styles.accountContainer}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.accountCard,
                        pressed && styles.pressed,
                        isLoading && { opacity: 0.6 },
                      ]}
                      accessibilityRole="button"
                      disabled={isLoading}
                      onPress={() => abrirModalCuenta(cuenta)}
                    >
                      <CuentaGuardada
                        name={cuenta.name}
                        email={cuenta.email}
                        photoUri={cuenta.photoUri}
                        size="lista"
                      />

                      <Image
                        source={require("../../assets/SVG/iconos/chevron.svg")}
                        style={styles.chevron}
                        contentFit="contain"
                      />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Olvidar la cuenta ${cuenta.email}`}
                      disabled={isLoading}
                      onPress={() => {
                        olvidar.reset();
                        setCuentaAOlvidar(cuenta);
                      }}
                      style={({ pressed }) => [
                        styles.forgetAccount,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={19}
                        color="#705D52"
                      />
                      <Text style={styles.forgetAccountText}>
                        Olvidar cuenta
                      </Text>
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#828282",
                    marginVertical: 10,
                  }}
                >
                  {cuentas.isPending
                    ? "Cargando cuentas..."
                    : cuentas.isError
                      ? "No pudimos leer las cuentas guardadas. Puedes usar otra cuenta."
                      : "No hay cuentas guardadas. Por favor, inicia sesión con una cuenta nueva."}
                </Text>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.otherAccount,
                pressed && styles.pressed,
              ]}
              // onPress={}
              onPress={abrirModalOtraCuenta}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityState={{
                disabled: isLoading,
              }}
            >
              <Image
                source={require("../../assets/SVG/iconos/otra_cuenta_mas.svg")}
                style={styles.plusIcon}
                contentFit="contain"
              />
              <Text style={styles.otherAccountText}>Usar otra cuenta</Text>
            </Pressable>
            {isLoading || notice ? (
              <Text accessibilityLiveRegion="polite" style={styles.notice}>
                {isLoading ? "Iniciando sesión..." : notice}
              </Text>
            ) : null}

            <View style={styles.signupCard}>
              <Image
                source={require("../../assets/SVG/adornos/hojas_verticales.svg")}
                style={styles.leftLeaves}
                contentFit="contain"
              />
              <Text style={styles.signupTitle}>¿Eres nuevo?</Text>
              <View style={styles.signupRow}>
                <Text style={styles.signupDescription}>
                  Crea tu cuenta y empieza a preparar recetas increíbles
                </Text>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.signupButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => router.push("/register")}
                  disabled={isLoading}
                >
                  <Text style={styles.signupButtonText}>Crear cuenta →</Text>
                </Pressable>
              </View>
              <Image
                source={require("../../assets/SVG/adornos/hojas_inferiores.svg")}
                style={styles.rightLeaves}
                contentFit="contain"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        transparent
        animationType="fade"
        visible={cuentaAOlvidar !== null}
        onRequestClose={cancelarOlvido}
      >
        <SafeAreaView style={styles.confirmOverlay}>
          <ScrollView contentContainerStyle={styles.confirmContent}>
            <View style={styles.confirmCard} accessibilityViewIsModal>
              <Ionicons name="trash-outline" size={44} color="#FF5008" />
              <Text style={styles.confirmTitle} accessibilityRole="header">
                ¿Olvidar esta cuenta?
              </Text>
              <Text style={styles.confirmEmail}>{cuentaAOlvidar?.email}</Text>
              <Text style={styles.confirmMessage}>
                Se quitarán de este teléfono sus datos recordados y su foto. Tu
                cuenta y tus favoritos se conservarán.
              </Text>
              {olvidar.isError && (
                <Text style={styles.confirmError} accessibilityRole="alert">
                  No pudimos olvidar la cuenta. Inténtalo nuevamente.
                </Text>
              )}
              <Pressable
                accessibilityRole="button"
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.confirmButton,
                  (pressed || isLoading) && styles.pressed,
                ]}
                onPress={() => {
                  if (cuentaAOlvidar && !isLoading)
                    olvidar.mutate(cuentaAOlvidar);
                }}
              >
                <Text style={styles.confirmButtonText}>
                  {isLoading ? "Olvidando cuenta..." : "Olvidar cuenta"}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={isLoading}
                onPress={cancelarOlvido}
                style={({ pressed }) => [
                  styles.cancelButton,
                  (pressed || isLoading) && styles.pressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {modalActivo ? (
        <LoginModal
          cuenta={modalActivo === "guardada" ? cuentaSeleccionada : null}
          aviso={notice}
          onClose={cerrarModal}
          onSuccess={handleLoginExitoso}
        />
      ) : null}
    </>
  );
}
