import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet } from 'react-native';

interface Props {
    variante?: "rosa" | "blanco";
    rutaAlternativa?: Href;
    onPress?: () => void;
    deshabilitado?: boolean;
    etiqueta?: string;
}

export const BotonVolver = ({variante="rosa", rutaAlternativa, onPress, deshabilitado= false, etiqueta="volver" }: Props) => {
  
    const volver = ()=>{
        if(onPress) return onPress();
        if(router.canGoBack()){
            router.back();
        }else if (rutaAlternativa){
            router.replace(rutaAlternativa);
        }
    };

    const esRosa = variante === "rosa";
  
    return (
        <Pressable
            onPress={volver}
            disabled={deshabilitado}
            accessibilityRole="button"
            accessibilityLabel={etiqueta}
            hitSlop={8}
            style = {({pressed}) =>[
                styles.base ,
                esRosa ? styles.rosa : styles.blanco,
                pressed && (esRosa? styles.rosaPresionado : styles.blancoPresionado)
            ]}
        >
            <MaterialCommunityIcons 
                name="arrow-left-thick"
                size={esRosa? 26: 30}
                color={esRosa? "#8B1E1E" : "#552414"}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999, // siempre círculo
    alignItems: "center",
    justifyContent: "center",
  },
  rosa: {
    width: 50,
    height: 50,
    backgroundColor: "#FBD5CE",
    zIndex: 1,
  },
  rosaPresionado: {
    backgroundColor: "#F5B8AE",
  },
  blanco: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    shadowColor: "#552414",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  blancoPresionado: {
    opacity: 0.7,
  },
});