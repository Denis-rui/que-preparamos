import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useCategorias } from "../../hooks/useCategorias";
import { ListaCategorias, type Categoria } from "./ListaCategorias";

interface Props {
    onAgregarIngrediente: (nombre: string) => void;
    onSeleccionarCategoria?: (categoria: Categoria) => void;
};

export const BuscadorIngredientes =({onAgregarIngrediente, onSeleccionarCategoria}:Props)=>{
    const { categorias, loading, error } = useCategorias();

    const [texto, setTexto] = useState('');
    const [categoriasVisible, setCategoriasVisible] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

    const alternarCategorias = ()=>{
        setCategoriasVisible((prev)=>!prev);
    }

    const seleccionarCategoria = (categoria: Categoria) => {
        setCategoriaSeleccionada(categoria);
        setCategoriasVisible(false);
        onSeleccionarCategoria?.(categoria);
    };

    const handleAgregar = () => {
        if (!texto.trim()) return;
        onAgregarIngrediente(texto.trim());
        setTexto('');
    };

    return (
        <View style={styles.busquedaContenedor}>
            <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="magnify" size={18} color="#999" />
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un ingrediente"
                    placeholderTextColor="#999"
                    value={texto}
                    onChangeText={setTexto}
                    onSubmitEditing={handleAgregar}
                    returnKeyType="done"
                />
            </View>

            <Pressable style={styles.botonAgregar} onPress={handleAgregar}>
                <Text style={styles.botonAgregarTexto}>Agregar</Text>
            </Pressable>

            <View style={styles.categoriasWrapper}>
                <Pressable
                    style={({ pressed }) => [
                        styles.botonCategorias,
                        pressed && styles.pressed,
                    ]}
                    onPress={alternarCategorias}
                >
                    <Text style={styles.botonCategoriasTexto} numberOfLines={1}>
                        {categoriaSeleccionada ? categoriaSeleccionada.nombre : "Categorías"}
                    </Text>
                    <MaterialCommunityIcons
                        name={categoriasVisible ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#333"
                    />
                </Pressable>

                {categoriasVisible && (
                    <View style={styles.dropdown}>
                        {loading && (
                            <Text style={styles.dropdownMensaje}>Cargando categorías...</Text>
                        )}

                        {error && (
                            <Text style={[styles.dropdownMensaje, styles.dropdownError]}>
                                {error}
                            </Text>
                        )}

                        {!loading && !error && (
                            <ListaCategorias
                                categorias={categorias}
                                categoriaSeleccionada={categoriaSeleccionada}
                                seleccionarCategoria={seleccionarCategoria}
                            />
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  busquedaContenedor: {
    backgroundColor: '#FBEEDC',
    borderRadius: 20,
    padding: 12,
    marginTop: -3,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 12,
  },
  botonAgregar: {
    backgroundColor: '#FF4F0A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  botonAgregarTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  botonCategorias: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 4,
  },
  botonCategoriasTexto: {
    fontSize: 13,
    color: '#333',
  },
  categoriasWrapper: {
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBEEDC',
    shadowColor: '#552414',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
    overflow: 'hidden',
  },
  dropdownMensaje: {
    padding: 14,
    fontSize: 13,
    color: '#552414',
  },
  dropdownError: {
    color: '#D32F2F',
  },
});