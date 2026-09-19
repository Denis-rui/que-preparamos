import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCF2' },
  screen: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 7,
    boxShadow: '0px -3px 14px rgba(64, 38, 16, 0.10)',
  },
  button: { flex: 1, minWidth: 0, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: 5 },
  wideButton: { flex: 1.5 },
  icon: { width: 27, height: 27 },
  label: { width: '100%', textAlign: 'center', color: '#747985', fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16 },
  activeLabel: { color: '#FF5008', fontFamily: 'Inter_600SemiBold' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF5008' },
  hiddenDot: { opacity: 0 },
  pressed: { opacity: 0.65 },
});
