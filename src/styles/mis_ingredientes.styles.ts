import { BottomTabInset } from '@/constants/theme';
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#FFFCF2',
    justifyContent: 'space-between',
  },
  seccionInferior: {
    paddingBottom: BottomTabInset,       
  },
  seccionSuperior: {
    flex:1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  titulo: {
    fontFamily: 'Coiny_400Regular',
    fontSize: 29,
    color: '#552414',
  },
  hoja: {
    width: 36,
    height: 36,
  },
  hoja_izquierda: {
    marginRight: 0,
  },
  hoja_derecha: {
    marginLeft: 0,
  },
  mascota: {
    width: '83%',
    aspectRatio: 1942 / 810,
    alignSelf: 'center',
    marginTop: 16,           
  },
  ingredientesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,          
  },
  ingredientesHeaderIzq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  limpiarTexto: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 13,
  },
  ingredientesTitulo: {
    fontWeight: '700',
    fontSize: 17,
    color: '#552414',
    marginLeft: -4,
  },
  limpiarBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taza: {
    width: 42,
    height: 42,
    marginTop: -16,
  },
  chipsContenedor: {
    flex:1,             
    backgroundColor: '#FBEEDC',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    padding: 12,
  },
  mensajeVacioContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 10,
  },
  mensajeVacioIcono: {
    width: 48,
    height: 48,
    opacity: 0.4,
  },
  mensajeVacioTitulo: {
    fontSize: 15,
    color: '#552414',
    fontWeight: '700',
    textAlign: 'center',
  },
  mensajeVacioTexto: {
    fontSize: 13,
    color: '#9C8B7A',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },
  chipsFila: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    width: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipTexto: {
    fontSize: 13,
    color: '#552414',
    fontWeight: '600',
    flexShrink: 1,
  },
  botonBuscar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4F0A',
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 2,
    flex: 1,
    paddingVertical: 13,
    gap: 8,
  },
  botonBuscarTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  tipContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBEEDC',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    gap: 10,
  },
  tipTexto: {
    flex: 1,
    fontSize: 13,
    color: '#552414',
  },
  filaBotonBuscar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  adornoBoton: {
    width: 22,
    height: 22,
  },
});