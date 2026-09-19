import { Image, type ImageSource } from 'expo-image';
import { TabList, Tabs, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/styles/app-tabs.styles';

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: ImageSource;
  wide?: boolean;
};

function TabButton({ label, icon, wide, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(isFocused) }}
      style={({ pressed }) => [styles.button, wide && styles.wideButton, pressed && styles.pressed]}
    >
      <Image
        source={label === 'Mi perfil' && !isFocused ? require('../assets/SVG/iconos/avatar_perfil.svg') : icon}
        style={styles.icon}
        contentFit="contain"
        tintColor={label === 'Mi perfil' && isFocused ? undefined : isFocused ? '#FF5008' : '#747985'}
      />
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.label, isFocused && styles.activeLabel]}>{label}</Text>
      <View style={[styles.dot, !isFocused && styles.hiddenDot]} />
    </Pressable>
  );
}

export default function RoundedAppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.container} options={{ backBehavior: 'history' }}>
      <TabSlot style={styles.screen} />
      <TabList style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 7), paddingLeft: Math.max(insets.left, 12), paddingRight: Math.max(insets.right, 12) }]}>
        <TabTrigger name="index" href="/(tabs)" asChild>
          <TabButton label="Inicio" icon={require('../assets/SVG/iconos/inicio.svg')} />
        </TabTrigger>
        <TabTrigger name="explorar" href="/(tabs)/explorar" asChild>
          <TabButton label="Explorar" icon={require('../assets/SVG/iconos/buscar.svg')} />
        </TabTrigger>
        <TabTrigger name="crear" href="/(tabs)/crear" asChild>
          <TabButton label="Crear" icon={require('../assets/SVG/iconos/agregar.svg')} />
        </TabTrigger>
        <TabTrigger name="ingredientes" href="/(tabs)/ingredientes" asChild>
          <TabButton label="Mis ingredientes" icon={require('../assets/SVG/iconos/ingredientes.svg')} wide />
        </TabTrigger>
        <TabTrigger name="mi-perfil" href="/(tabs)/mi-perfil" asChild>
          <TabButton label="Mi perfil" icon={require('../assets/SVG/iconos/mi_perfil.svg')} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
