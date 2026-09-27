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
    width: '100%',
    aspectRatio: 1942 / 810,
    marginTop: 12,
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
    backgroundColor: '#FBEEDC',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    maxHeight: 140,
  },
  chipsFila: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    width: 112,
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