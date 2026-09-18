import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor= "#FFFFFF"
      indicatorColor="#F0F0F3"
      disableIndicator
      rippleColor="#F0F0F3"
      iconColor="#6B707A"
      tintColor="#FF5008"
      labelVisibilityMode="labeled"
      labelStyle={{
        selected: {
          color: '#FF5008',
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
        },
        default: {
          color: '#6B707A',
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
        },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explorar">
        <NativeTabs.Trigger.Label>Explorar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
          md={{ default: 'search', selected: 'search' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="crear">
        <NativeTabs.Trigger.Label>Crear</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'plus', selected: 'plus' }}
          md={{ default: 'add', selected: 'add' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ingredientes">
        <NativeTabs.Trigger.Label>Mis ingred.</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/icono_mis_ingredientes.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="perfil">
        <NativeTabs.Trigger.Label>Mi perfil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md={{ default: 'account_circle', selected: 'account_circle' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
