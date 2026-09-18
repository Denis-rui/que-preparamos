import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
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

const accounts = [
  {
    name: "Liliana Bustamante Tauma",
    email: "lili@gmail.com",
    avatar: require("../assets/SVG/iconos/avatar_naranja.svg"),
  },
  {
    name: "Usuario 02",
    email: "usuario02@gmail.com",
    avatar: require("../assets/SVG/iconos/avatar_verde.svg"),
  },
];

export default function Login() {
  const [notice, setNotice] = useState("");
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getLoginStyles(height - insets.top - insets.bottom);

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

          <View style={styles.accounts}>
            {accounts.map((account) => (
              <Pressable
                key={account.email}
                style={({ pressed }) => [
                  styles.accountCard,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Continuar con ${account.name}, ${account.email}`}
              >
                <Image
                  source={account.avatar}
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
            accessibilityRole="button"
          >
            <Image
              source={require("../assets/SVG/iconos/otra_cuenta_mas.svg")}
              style={styles.plusIcon}
              contentFit="contain"
            />
            <Text style={styles.otherAccountText}>Usar otra cuenta</Text>
          </Pressable>

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

          {notice ? (
            <Text accessibilityLiveRegion="polite" style={styles.notice}>
              {notice}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
