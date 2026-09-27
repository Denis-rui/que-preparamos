import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

export interface Categoria{
    id: number;
    nombre: string;
}

interface Props{
    categorias: Categoria[];
    categoriaSeleccionada: Categoria | null;
    seleccionarCategoria: (categoria: Categoria)=> void;
}

export const ListaCategorias =({categorias, categoriaSeleccionada, seleccionarCategoria}: Props)=>{
    return(
        <ScrollView
            style={styles.dropdownScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
        >
            {categorias.map((categoria)=>{
                const seleccionada = categoriaSeleccionada?.id === categoria.id;
                return(
                    <Pressable
                        key={categoria.id}
                        style={({pressed})=>[
                            styles.dropdownItem,
                            seleccionada && styles.dropdownItemSeleccionado,
                            pressed && styles.pressed,
                        ]}
                        onPress={()=> seleccionarCategoria(categoria)}
                    >
                        <Text
                            style={[
                                styles.dropdownItemTexto,
                                seleccionada && styles.dropdownItemTextoSeleccionado,
                            ]}
                        >
                            {categoria.nombre}
                        </Text>
                        {seleccionada && (
                            <MaterialCommunityIcons name="check" size={16} color="#4CAF50"/>
                        )}
                        
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  dropdownScroll: {
    maxHeight: 44 * 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#FBEEDC',
  },
  dropdownItemSeleccionado: {
    backgroundColor: '#FBEEDC',
  },
  dropdownItemTexto: {
    fontSize: 13,
    color: '#552414',
  },
  dropdownItemTextoSeleccionado: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  dropdownMensaje: {
    padding: 14,
    fontSize: 13,
    color: '#552414',
  },
  dropdownError: {
    color: '#D32F2F',
  },
  pressed: {
    opacity: 0.7,
  },
});