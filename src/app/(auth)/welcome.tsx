import { AppButton } from '@/components/ui/appButton';
import { styles } from '@/styles/welcome.styles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { obtenerToken } from '@/storage/token';
import { obtenerPerfil, PerfilError } from '@/api/perfil';
import { cerrarSesion } from '@/api/sesion';

export default function Welcome() {
  const [ocupado, setOcupado] = useState(true);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let activo = true;
    async function restaurarSesion() {
      try {
        if (!await obtenerToken() || !activo) return;
        // Tener un token guardado no demuestra que siga siendo válido.
        await obtenerPerfil();
        if (activo) router.replace('/(tabs)');
      } catch (error) {
        // El cliente compartido ya redirige los 401. Los demás errores
        // conservan el token, porque no demuestran que haya vencido.
        if (activo && !(error instanceof PerfilError && error.status === 401)) {
          setAviso('No pudimos comprobar tu sesión. Revisa tu conexión o inicia sesión nuevamente.');
        }
      } finally {
        if (activo) setOcupado(false);
      }
    }
    void restaurarSesion();
    return () => { activo = false; };
  }, []);

  async function continuarComoInvitado() {
    if (ocupado) return;
    setOcupado(true);
    setAviso('');
    try {
      // Reutilizamos el cierre: el invitado no debe heredar otra sesión.
      await cerrarSesion();
      router.replace('/(tabs)');
    } catch {
      setAviso('No pudimos cerrar la sesión anterior. Revisa tu conexión e inténtalo nuevamente.');
    } finally {
      setOcupado(false);
    }
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.contentWrapper}>
            <View style={styles.brandLockup}>
              <View style={styles.brandHeader}>
                <Image
                  source={require('../../assets/imagenes/icono_sombrero_chef.png')}
                  style={styles.chefHat}
                  contentFit="contain"
                />
                <Image
                  source={require('../../assets/imagenes/titulo.png')}
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
              source={require('../../assets/imagenes/icono_mascota.png')}
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
            {aviso ? <Text accessibilityRole="alert">{aviso}</Text> : null}
            <AppButton
              label = 'Iniciar sesión'
              loading={ocupado}
              onPress={()=> router.push('/login')}
            />

            <AppButton
              label= 'Continuar sin cuenta'
              onPress={continuarComoInvitado}
              loading={ocupado}
              variant='secundario'
            />
        </View>

        <Image
          source={require('../../assets/imagenes/icono_1.png')}
          style={styles.footerIcon}
          contentFit="contain"
        />
      </SafeAreaView>
    </View>
  );
}
