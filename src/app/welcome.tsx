import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: -24,
    transform: [{ translateY: -18 }],
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandLockup: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: -8,
  },
  chefHat: {
    height: 141,
    marginRight: -30,
    transform: [{ translateY: 3 }],
    width: 143,
  },
  titleLogo: {
    height: 106,
    width: 250,
  },
  mascota: {
    height: 262,
    marginBottom: 10,
    transform: [{ translateY: 10 }],
    width: 390,
  },
  brandName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 35,
    lineHeight: 40,
    textAlign: 'center',
  },
  brandDark: {
    color: '#5B1D12',
  },
  brandOrange: {
    color: '#FF4F0A',
  },
  brandTagline: {
    color: '#5B1D12',
    fontFamily: 'Lobster_400Regular',
    fontSize: 29,
    lineHeight: 33,
  },
  taglineComma: {
    color: '#5B1D12',
    fontFamily: 'Lobster_400Regular',
    fontSize: 29,
    lineHeight: 33,
    transform: [{ translateY: 5 }],
  },
  taglineFirstLine: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  taglineText: {
    width: 260,
  },
  taglineSecondLine: {
    color: '#5B1D12',
    fontFamily: 'Lobster_400Regular',
    fontSize: 29,
    lineHeight: 33,
    marginLeft: 34,
  },
  taglineSkew: {
    transform: [{ rotate: '-8deg' }],
  },
  taglineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6,
  },
  taglineHeart: {
    marginLeft: -10,
    transform: [{ rotate: '8deg' }],
  },
  copyBlock: {
    alignItems: 'center',
    transform: [{ translateY: 12 }],
  },
  title: {
    color: '#5B1D12',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 25,
    lineHeight: 31,
    textAlign: 'center',
  },
  description: {
    color: '#6D6D6D',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  buttonsWrapper: {
    gap: 12,
  },
  footerIcon: {
    width: 72,
    height: 60,
    alignSelf: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#FF4F0A',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1A1A1A',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});