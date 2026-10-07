import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useBuscarIngredientes, type IngredienteApi, } from "../../hooks/useBuscarIngredientes";
import { useCategorias } from "../../hooks/useCategorias";
import { ListaCategorias, type Categoria } from "./ListaCategorias";

interface Props {
    onAgregarIngrediente: (ingrediente: IngredienteApi) => void;
    onSeleccionarCategoria?: (categoria: Categoria) => void;
};

export const BuscadorIngredientes =({onAgregarIngrediente, onSeleccionarCategoria}:Props)=>{
    const { categorias, loading, error } = useCategorias();

    const [texto, setTexto] = useState('');
    const [categoriasVisible, setCategoriasVisible] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
    const {resultados, loading: buscando, error: errorBusqueda} = useBuscarIngredientes(texto);

    const alternarCategorias = ()=>{
        setCategoriasVisible((prev)=>!prev);
    }

    const seleccionarCategoria = (categoria: Categoria) => {
        setCategoriaSeleccionada(categoria);
        setCategoriasVisible(false);
        onSeleccionarCategoria?.(categoria);
    };

    const seleccionarIngrediente = (ingrediente: IngredienteApi) =>{
        onAgregarIngrediente(ingrediente);
        setTexto("");
    }

    return (
        <View style={styles.busquedaContenedor}>
            <View style={styles.sugerenciasContenedor}>
                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="magnify" size={18} color="#999" />
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un ingrediente"
                        placeholderTextColor="#999"
                        value={texto}
                        onChangeText={setTexto}
                        returnKeyType="search"
                        underlineColorAndroid="transparent"
                        cursorColor="#552414"
                        autoCorrect={false}
                        autoComplete="off"
                        importantForAutofill="no"
                    />
                </View>

                {texto.trim().length > 0 && (
                    <View style={styles.sugerenciasDropdown}>
                        {buscando && (
                            <Text style={styles.sugerenciaMensaje}>Buscando...</Text>
                        )}

                        {!buscando && errorBusqueda && (
                            <Text style={[styles.sugerenciaMensaje, styles.sugerenciaError]}>
                                {errorBusqueda}
                            </Text>
                        )}

                        {!buscando && !errorBusqueda && resultados.length === 0 && (
                            <Text style={styles.sugerenciaMensaje}>
                                No se encontraron ingredientes.
                            </Text>
                        )}

                        {!buscando && !errorBusqueda && resultados.length > 0 && (
                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                nestedScrollEnabled
                            >
                                {resultados.map((ingrediente)=>(
                                    <Pressable
                                        key={ingrediente.id}
                                        style={styles.sugerenciaFila}
                                        onPress={() => seleccionarIngrediente(ingrediente)}
                                    >
                                        <Text style={styles.sugerenciaTexto}>
                                            {ingrediente.nombre}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}

                    </View>
                )}
            </View>

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
    color: "#333",
    padding: 0,
    minHeight: 24,
  },
  sugerenciasContenedor: {
    flex: 1,
    position: "relative",
    zIndex: 30,
    elevation: 30,
  },
  sugerenciasDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    maxHeight: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FBEEDC",
    shadowColor: "#552414",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
  },
  sugerenciaFila: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sugerenciaTexto: {
    color: "#333",
    fontSize: 13,
  },
  sugerenciaMensaje: {
    padding: 14,
    color: "#552414",
    fontSize: 13,
  },
  sugerenciaError: {
    color: "#D32F2F",
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