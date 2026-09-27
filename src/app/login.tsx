import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

import { obtenerCuentasRecordadas, validarSesion } from "@/api/auth";

import { getLoginStyles } from "@/styles/login.styles";

type Account = {
  id: string;
  name: string;
  email: string;
};

export default function Login() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [notice, setNotice] = useState("");
  const [showOterAccounts, setShowOtherAccounts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    let active = true;

    const loadAccounts = async () => {
      try {
        const data = await obtenerCuentasRecordadas();
        if (active) setAccounts(data);
      } catch {
        if (active) setNotice("No se pudieron cargar las cuentas.");
      } finally {
        if (active) setIsLoadingAccounts(false);
      }
    };

    void loadAccounts();
    return () => {
      active = false;
    };
  }, []);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getLoginStyles(height - insets.top - insets.bottom);

  const visibleAccounts = showOterAccounts ? accounts : accounts.slice(0, 1);

  const handleSelectAccount = async (account: (typeof accounts)[number]) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setNotice(`Ingresando con ${account.name}...`);

    try {
      // Simulación temporal definida en src/api/auth.js.
      await validarSesion(account);
      router.replace("/(tabs)");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesion. Intentalo nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtherAccount = () => {
    if (isLoading) {
      return;
    }
    setShowOtherAccounts((previous) => !previous);
    setNotice("");
  };

  return (
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
              source={require("../assets/SVG/iconos/volver.svg")}
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
                source={require("../assets/imagenes/icono_sombrero_chef.png")}
                style={styles.chefHat}
                contentFit="contain"
              />
              <Image
                source={require("../assets/imagenes/titulo.png")}
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
                source={require("../assets/SVG/iconos/corazon_contorno.svg")}
                style={styles.taglineHeart}
                contentFit="contain"
              />
            </View>
            <Image
              source={require("../assets/SVG/ilustraciones/chef_elegir_cuenta_con_adornos.svg")}
              style={styles.chef}
              contentFit="contain"
            />
            <View style={styles.headingRow}>
              <Image
                source={require("../assets/SVG/adornos/hojas_izquierda.svg")}
                style={styles.headingLeaves}
                contentFit="contain"
              />
              <Text accessibilityRole="header" style={styles.heading}>
                Elegir cuenta
              </Text>
              <Image
                source={require("../assets/SVG/adornos/hojas_derecha.svg")}
                style={styles.headingLeaves}
                contentFit="contain"
              />
            </View>
          </View>

          {isLoadingAccounts && (
            <Text style={styles.notice}>Cargando cuentas...</Text>
          )}
          {!isLoadingAccounts && accounts.length === 0 && !notice && (
            <Text style={styles.notice}>
              No hay cuentas recordadas en este dispositivo.
            </Text>
          )}

          <View style={styles.accounts}>
            {visibleAccounts.map((account) => (
              <Pressable
                key={account.id}
                style={({ pressed }) => [
                  styles.accountCard,
                  pressed && styles.pressed,
                  isLoading && { opacity: 0.6 },
                ]}
                onPress={() => handleSelectAccount(account)}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading, busy: isLoading }}
                accessibilityLabel={`Continuar con ${account.name}, ${account.email}`}
              >
                <Image
                  source={require("../assets/SVG/iconos/avatar_naranja.svg")}
                  style={styles.avatar}
                  contentFit="contain"
                />
                <View style={styles.accountCopy}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountEmail}>{account.email}</Text>
                </View>
                <Image
                  source={require("../assets/SVG/iconos/chevron.svg")}
                  style={styles.chevron}
                  contentFit="contain"
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.otherAccount,
              pressed && styles.pressed,
            ]}
            onPress={handleOtherAccount}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityState={{
              disabled: isLoading,
              expanded: showOterAccounts,
            }}
          >
            <Image
              source={require("../assets/SVG/iconos/otra_cuenta_mas.svg")}
              style={styles.plusIcon}
              contentFit="contain"
            />
            <Text style={styles.otherAccountText}>
              {showOterAccounts ? "Volver a mi cuenta" : "Usar otra cuenta"}
            </Text>
          </Pressable>
          {isLoading || notice ? (
            <Text accessibilityLiveRegion="polite" style={styles.notice}>
              {isLoading ? "Iniciando sesión..." : notice}
            </Text>
          ) : null}

          <View style={styles.signupCard}>
            <Image
              source={require("../assets/SVG/adornos/hojas_verticales.svg")}
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
              source={require("../assets/SVG/adornos/hojas_inferiores.svg")}
              style={styles.rightLeaves}
              contentFit="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
