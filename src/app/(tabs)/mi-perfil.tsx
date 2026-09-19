import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "@/styles/perfil.styles";

const demoProfile = {
  name: "Liliana Bustamante Tauma",
  email: "lili@gmail.com",
  savedRecipes: 12,
};

export default function MiPerfil() {
  const [notice, setNotice] = useState("");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.brandRow}>
            <View
              style={styles.logo}
              accessible
              accessibilityLabel="¿Qué preparamos?"
            >
              <Image
                source={require("../../assets/imagenes/icono_sombrero_chef.png")}
                style={styles.hat}
                contentFit="contain"
              />
              <Image
                source={require("../../assets/imagenes/titulo.png")}
                style={styles.brandTitle}
                contentFit="contain"
                allowDownscaling={false}
              />
            </View>
            <View
              style={styles.tagline}
              accessible
              accessibilityLabel="Buenas comidas, mejores momentos"
            >
              <Image
                source={require("../../assets/SVG/adornos/hojas_derecha.svg")}
                style={styles.taglineTopLeaves}
                contentFit="contain"
              />
              <Text style={styles.taglineText}>
                Buenas{"\n"}comidas,{"\n"}mejores{"\n"}momentos
              </Text>
              <Image
                source={require("../../assets/SVG/iconos/corazon_contorno.svg")}
                style={styles.taglineHeart}
                contentFit="contain"
              />
              <Image
                source={require("../../assets/SVG/adornos/hojas_izquierda.svg")}
                style={styles.taglineBottomLeaves}
                contentFit="contain"
              />
            </View>
          </View>

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

          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Image
                  source={require("../../assets/SVG/iconos/avatar_perfil.svg")}
                  style={styles.avatar}
                  contentFit="contain"
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Editar mi perfil"
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
              <Text style={styles.profileTitle}>Mi espacio</Text>
              <Text style={styles.profileDetail}>{demoProfile.name}</Text>
              <Text style={styles.profileDetail}>{demoProfile.email}</Text>
              <Text style={styles.profileDetail}>
                {demoProfile.savedRecipes} recetas guardadas
              </Text>
            </View>
          </View>

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
              onPress={() => router.replace("/login")}
            >
              <View style={[styles.optionCircle, styles.logoutCircle]}>
                <Image
                  source={require("../../assets/SVG/iconos/cerrar_sesion.svg")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>Cerrar sesión</Text>
                <Text style={styles.optionDescription}>
                  Salir de tu cuenta actual
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
    </SafeAreaView>
  );
}
