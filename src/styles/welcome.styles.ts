import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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