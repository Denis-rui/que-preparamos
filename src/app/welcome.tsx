import { styles } from '@/styles/welcome.styles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.contentWrapper}>
            <View style={styles.brandLockup}>
              <View style={styles.brandHeader}>
                <Image
                  source={require('../assets/imagenes/icono_sombrero_chef.png')}
                  style={styles.chefHat}
                  contentFit="contain"
                />
                <Image
                  source={require('../assets/imagenes/titulo.png')}
                  style={styles.titleLogo}
                  contentFit="contain"
                />
              </View>
              <View style={styles.taglineRow}>
                <View style={styles.taglineSkew}>
                  <View style={styles.taglineText}>
                    <View style={styles.taglineFirstLine}>
                      <Text style={styles.brandTagline}>Buenas comidas</Text>
                      <Text style={styles.taglineComma}>,</Text>
                    </View>
                    <Text style={styles.taglineSecondLine}>mejores momentos</Text>
                  </View>
                </View>
                <Svg height={54} viewBox="0 0 64 58" width={54} style={styles.taglineHeart}>
                  <Path
                    d="M32 54C28 50 8 36 8 19C8 9 20 5 27 13L32 19L37 13C44 5 56 9 56 19C56 36 36 50 32 54Z"
                    fill="none"
                    stroke="#FF4F0A"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                  />
                </Svg>
              </View>
            </View>

            <Image
              source={require('../assets/imagenes/icono_mascota.png')}
              style={styles.mascota}
              contentFit="contain"
            />

            <View style={styles.copyBlock}>
              <Text style={styles.title}>Tu cocina, tus ideas</Text>
              <Text style={styles.description}>
                Descubre, guarda y prepara recetas{"\n"}de comidas, postres y cócteles.
              </Text>
            </View>
        </View>

        <View style={styles.buttonsWrapper}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/login')}>
             <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
             <Text style={styles.secondaryButtonText}>Continuar sin cuenta</Text>
            </Pressable>
        </View>

        <Image
          source={require('../assets/imagenes/icono_1.png')}
          style={styles.footerIcon}
          contentFit="contain"
        />
      </SafeAreaView>
    </View>
  );
}