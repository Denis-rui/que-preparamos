import {
  solicitarCodigoRecuperacion,
  verificarCodigoRecuperacion,
} from "@/api/recuperacion";
import { EncabezadoRecuperacion } from "@/components/auth/EncabezadoRecuperacion";
import {
  CampoCodigo,
  crearCodigoVacio,
} from "@/components/ui/CampoCodigo";
import { AppButton } from "@/components/ui/appButton";
import { BotonVolver } from "@/components/ui/botonVolver";
import { getRecuperacionStyles } from "@/styles/recuperacion.styles";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

// Ilustración del chef con su libro de recetas abiertas.
const ILUSTRACION = require("../../assets/SVG/ilustraciones/chef_favoritos_con_adornos.svg");

// Reglas del backend: el código dura 10 minutos y hay que esperar
// 60 segundos entre un envío y el siguiente.
const VIGENCIA_CODIGO_SEGUNDOS = 600;
const ESPERA_REENVIO_SEGUNDOS = 60;

// Convierte segundos a "mm:ss".
function formatearTiempo(segundosTotales: number) {
  const minutos = Math.floor(segundosTotales / 60);
  const segundos = segundosTotales % 60;
  const conCeros = `${minutos}:${segundos.toString().padStart(2, "0")}`;
  return conCeros.padStart(5, "0");
}

// Paso 2: la persona escribe el código que llegó a su correo. Al
// comprobarlo recibimos la autorización temporal para el paso 3.
export default function VerificarCodigo() {
  // El correo llega de la pantalla anterior (olvide-contrasenia).
  const { email } = useLocalSearchParams<{ email?: string }>();
  const correo = typeof email === "string" ? email : "";

  // Un elemento por casilla: "" cuando la casilla está vacía.
  const [codigo, setCodigo] = useState<string[]>(crearCodigoVacio);
  const [serverError, setServerError] = useState<string | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(
    VIGENCIA_CODIGO_SEGUNDOS,
  );
  const [segundosReenvio, setSegundosReenvio] = useState(
    ESPERA_REENVIO_SEGUNDOS,
  );

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getRecuperacionStyles(height - insets.top - insets.bottom);

  const solicitud = useMutation({
    mutationFn: solicitarCodigoRecuperacion,
    retry: false,
    networkMode: "always",
    gcTime: 0,
  });
  const verificacion = useMutation({
    mutationFn: verificarCodigoRecuperacion,
    retry: false,
    networkMode: "always",
    gcTime: 0,
  });

  // Cuenta regresiva de la vigencia del código: cada segundo resta uno
  // y el intervalo deja de existir cuando ya no hace falta.
  useEffect(() => {
    if (segundosRestantes === 0) return;
    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [segundosRestantes]);

  // Cuenta regresiva para poder reenviar el código.
  useEffect(() => {
    if (segundosReenvio === 0) return;
    const intervalo = setInterval(() => {
      setSegundosReenvio((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [segundosReenvio]);

  const esperandoReenvio = segundosReenvio > 0;

  // Volver a pedir el código. El anterior queda invalidado en el servidor.
  async function manejarReenvio() {
    if (esperandoReenvio || solicitud.isPending || !correo) {
      if (!correo) {
        setServerError(
          "No tenemos el correo de la recuperación. Vuelve a solicitar el código.",
        );
      }
      return;
    }
    setServerError(null);
    try {
      await solicitud.mutateAsync({ email: correo });
      // Un envío nuevo apaga el reloj anterior y empieza de cero.
      setSegundosRestantes(VIGENCIA_CODIGO_SEGUNDOS);
      setSegundosReenvio(ESPERA_REENVIO_SEGUNDOS);
      setCodigo(crearCodigoVacio());
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "No pudimos reenviar el código.",
      );
    }
  }

  // Comprueba el código escrito y envía a la pantalla de la nueva contraseña.
  async function manejarVerificar() {
    Keyboard.dismiss();

    if (!correo) {
      setServerError(
        "No tenemos el correo de la recuperación. Vuelve a solicitar el código.",
      );
      return;
    }
    if (segundosRestantes === 0) {
      setServerError("El código venció. Solicita uno nuevo con «Reenviar».");
      return;
    }
    if (codigo.some((digito) => digito === "")) {
      setServerError("Escribe los 6 dígitos del código.");
      return;
    }

    setServerError(null);
    try {
      const respuesta = await verificacion.mutateAsync({
        email: correo,
        codigo: codigo.join(""),
      });

      // El backend devuelve la autorización temporal de un solo uso.
      if (
        typeof respuesta.token_recuperacion !== "string" ||
        !respuesta.token_recuperacion.trim()
      ) {
        throw new Error(
          "No recibimos la autorización para cambiar la contraseña.",
        );
      }

      router.push({
        pathname: "/nueva-contrasenia",
        params: { token: respuesta.token_recuperacion },
      });
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "No pudimos comprobar el código.",
      );
    }
  }

  // Vuelve a la pantalla anterior (nuestro correo) o al inicio de sesión.
  function manejarVolver() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.page}>
              <BotonVolver
                rutaAlternativa="/olvide-contrasenia"
                deshabilitado={verificacion.isPending}
                etiqueta="Volver a la pantalla anterior"
              />

              <EncabezadoRecuperacion
                ilustracion={ILUSTRACION}
                titulo="Ingresa el código"
                mensaje={
                  correo
                    ? `Te enviamos un código de 6 dígitos a ${correo}`
                    : "Te enviamos un código de 6 dígitos"
                }
              />

              <View style={styles.form}>
                <CampoCodigo
                  value={codigo}
                  onChangeText={setCodigo}
                  deshabilitado={verificacion.isPending}
                />

                {/* Los mensajes (errores del servidor o avisos) aparecen aquí. */}
                {serverError ? (
                  <Text
                    style={[styles.errorText, { textAlign: "center" }]}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                  >
                    {serverError}
                  </Text>
                ) : null}

                <View style={styles.temporizadorRow}>
                  <Text style={styles.temporizadorTexto}>
                    El código vence en:
                  </Text>
                  <Text style={styles.temporizadorTiempo}>
                    {formatearTiempo(segundosRestantes)}
                  </Text>
                </View>

                <View style={styles.reenvioRow}>
                  <Text style={styles.reenvioTexto}>
                    ¿No recibiste el código?
                  </Text>
                  <Pressable
                    onPress={manejarReenvio}
                    disabled={esperandoReenvio || solicitud.isPending}
                    accessibilityRole="button"
                    accessibilityLabel="Reenviar código al correo"
                    hitSlop={6}
                  >
                    <Text
                      style={
                        esperandoReenvio ? styles.reenvioEsperando : styles.reenvioEnlace
                      }
                    >
                      {solicitud.isPending
                        ? "Reenviando..."
                        : esperandoReenvio
                          ? `Reenviar en ${segundosReenvio}s`
                          : "Reenviar código"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={[styles.acciones, { marginTop: 18 }]}>
                <AppButton
                  label="Verificar código"
                  onPress={manejarVerificar}
                  loading={verificacion.isPending}
                  loadingLabel="Verificando..."
                  icon={
                    <Image
                      source={require("../../assets/SVG/iconos/flecha_ingresar.svg")}
                      style={styles.buttonArrow}
                      contentFit="contain"
                    />
                  }
                />
                <View style={styles.botonVolverMarco}>
                  <Image
                    source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                    style={styles.hojaIzquierda}
                    contentFit="contain"
                    pointerEvents="none"
                  />
                  <Image
                    source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                    style={styles.hojaDerecha}
                    contentFit="contain"
                    pointerEvents="none"
                  />
                  <AppButton
                    label="Volver"
                    variant="secundario"
                    onPress={manejarVolver}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
