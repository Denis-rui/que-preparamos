import { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

interface Props {
  titulo: string;
  opciones: { id: number; nombre: string }[];
  valor?: number;
  deshabilitado?: boolean;
  onChange: (id: number | undefined) => void;
}
export function SelectorFiltro({
  titulo,
  opciones,
  valor,
  deshabilitado = false,
  onChange,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const seleccion = opciones.find((item) => item.id === valor);

  function seleccionar(id: number | undefined) {
    onChange(id);
    setAbierto(false);
  }

  return (
    <>
      <Pressable
        disabled={deshabilitado}
        accessibilityRole="button"
        accessibilityLabel={titulo}
        onPress={() => setAbierto(true)}
        style={{
          flex: 1,
          padding: 12,
          borderRadius: 18,
          backgroundColor: "#e4d9d5",
          opacity: deshabilitado ? 0.5 : 1,
        }}
      >
        <Text numberOfLines={1} style={{ color: "#05370e", fontSize: 14 }}>
          {seleccion?.nombre ?? titulo} ▾
        </Text>
      </Pressable>

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        onRequestClose={() => setAbierto(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => setAbierto(false)}
            accessibilityRole="button"
            accessibilityLabel="Cerrar Selector"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              maxHeight: "40%",
              width: "70%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{titulo}</Text>

            <FlatList
              style={{ flexGrow: 0 }}
              data={opciones}
              keyExtractor={(item) => String(item.id)}
              ListHeaderComponent={
                <Pressable
                  style={{ paddingVertical: 14 }}
                  onPress={() => seleccionar(undefined)}
                >
                  <Text>Todas</Text>
                </Pressable>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={{ paddingVertical: 14 }}
                  onPress={() => seleccionar(item.id)}
                >
                  <Text
                    style={{
                      color: item.id === valor ? "#FF5008" : "#512013",
                      fontWeight: item.id === valor ? "bold" : "normal",
                    }}
                  >
                    {item.nombre}
                    {item.id === valor ? " ✓" : ""}
                  </Text>
                </Pressable>
              )}
            />

            <Pressable
              style={{ paddingVertical: 12 }}
              onPress={() => setAbierto(false)}
            >
              <Text>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
