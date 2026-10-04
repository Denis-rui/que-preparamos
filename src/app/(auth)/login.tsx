import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
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

import { getLoginStyles } from "@/styles/login.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Agregué aqui para abrir el modal
import {
  CuentaGuardada,
  CuentaGuardadaData,
} from "@/components/auth/CuentaGuardada";
import LoginModal from "@/components/auth/LoginModal";

type ModalActivo = "guardada" | "otra" | null;

export default function Login() {
  const [notice, setNotice] = useState("");
  // const [showOterAccounts, setShowOtherAccounts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const [cuentasGuardadas, setCuentasGuardadas] = useState<any[]>([]);

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

  useFocusEffect(
    useCallback(() => {
      const cargarCuentas = async () => {
        try {
          const data = await AsyncStorage.getItem("cuentasGuardadas");
          if (data) {
            setCuentasGuardadas(JSON.parse(data));
          }
        } catch (error) {
          console.error("Error al cargar las cuentas guardadas:", error);
        }
      };
      cargarCuentas();
    }, []),
  );

  // Agregue
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

  // Se ejecuta cuando LoginModal logra iniciar sesión (cuenta guardada u otra cuenta)
  async function handleLoginExitoso(respuesta: any, email: string) {
    if (modalActivo === "otra") {
      // Guardamos la cuenta en el dispositivo para que aparezca en "Elegir cuenta"
      const memoriaActual = await AsyncStorage.getItem("cuentasGuardadas");
      const cuentasExistentes = memoriaActual ? JSON.parse(memoriaActual) : [];
      const yaExiste = cuentasExistentes.some(
        (cuenta: any) => cuenta.email === email,
      );
      if (!yaExiste) {
        // La API devuelve los datos de la cuenta en "usuario".
        const nuevaCuenta = { name: respuesta?.usuario?.name ?? email, email };
        await AsyncStorage.setItem(
          "cuentasGuardadas",
          JSON.stringify([...cuentasExistentes, nuevaCuenta]),
        );
      }
    }

    cerrarModal();
    router.replace("/(tabs)");
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.page}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/welcome")
              }
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Volver a la bienvenida"
            >
              <Image
                source={require("../../assets/SVG/iconos/volver.svg")}
                style={styles.backIcon}
                contentFit="contain"
              />
            </Pressable>

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
                cuentasGuardadas.map((cuenta, index) => (
                  <Pressable
                    key={index}
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
                      size="lista"
                    />

                    <Image
                      source={require("../../assets/SVG/iconos/chevron.svg")}
                      style={styles.chevron}
                      contentFit="contain"
                    />
                  </Pressable>
                ))
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#828282",
                    marginVertical: 10,
                  }}
                >
                  No hay cuentas guardadas. Por favor, inicia sesión con una
                  cuenta nueva.
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

      {modalActivo ? (
        <LoginModal
          cuenta={modalActivo === "guardada" ? cuentaSeleccionada : null}
          onClose={cerrarModal}
          onSuccess={handleLoginExitoso}
        />
      ) : null}
    </>
  );
}
