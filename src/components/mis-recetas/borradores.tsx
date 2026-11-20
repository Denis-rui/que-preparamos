import { CLAVE_SESION, clienteQuery } from "@/config/cliente-query";
import { Spacing, TemaFormulario } from "@/constants/theme";
import { eliminarBorrador, listarBorradores } from "@/storage/borrador-receta";
import { BorradorReceta } from "@/types/borradorReceta";
import { Perfil } from "@/types/perfil";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useIsFocused } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FotoReceta } from "../recetas/FotoReceta";
import EstadoListado from "./EstadoListado";

const borradores = ({ usuarioId }: { usuarioId: number }) => {
  const enfocado = useIsFocused();
  const queryKey = ["borradores-receta", usuarioId] as const;
  const query = useQuery({
    queryKey,
    queryFn: () => listarBorradores(usuarioId),
    enabled: enfocado,
    networkMode: "always",
    retry: false,
    gcTime: 0,
    refetchOnReconnect: false,
  });

  const borrado = useMutation({
    mutationFn: (id: string) => eliminarBorrador(usuarioId, id),
    networkMode: "always",
    retry: false,
    onSuccess: async () => {
      await clienteQuery.invalidateQueries({ queryKey, exact: true });
    },
  });

  function confirmarEliminacion(borrador: BorradorReceta) {
    Alert.alert(
      "¿Eliminar borrador?",
      "Se borrará del teléfono el avance de esta receta.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const perfil = clienteQuery.getQueryData<Perfil | null>(
              CLAVE_SESION,
            );
            if (perfil?.id === usuarioId) borrado.mutate(borrador.id);
          },
        },
      ],
    );
  }
  const datos = query.data;
  if (!datos) {
    return query.isError ? (
      <EstadoListado
        mensaje="No pudimos leer tus borradores."
        reintentar={() => {
          void query.refetch();
        }}
      />
    ) : (
      <EstadoListado cargando mensaje="Cargando borradores..." />
    );
  }
  return (
    <FlatList
      data={datos.borradores}
      keyExtractor={(borrador) => borrador.id}
      refreshing={query.isRefetching}
      onRefresh={() => {
        query.refetch();
      }}
      ListHeaderComponent={
        <>
          {query.isError && (
            <EstadoListado
              mensaje="No pudimos actualizar tus borradores."
              reintentar={() => {
                query.refetch();
              }}
            />
          )}
          {datos.omitidos > 0 && (
            <Text accessibilityRole="alert" style={styles.aviso}>
              Algunos borradores guardados no se pudieron leer.
            </Text>
          )}
          {borrado.isError && (
            <Text accessibilityRole="alert" style={styles.aviso}>
              No se pudo eliminar el borrador. Vuelve a intentarlo.
            </Text>
          )}
        </>
      }
      ListEmptyComponent={
        datos.omitidos === 0 ? (
          <EstadoListado mensaje="No tiene Borradores" />
        ) : undefined
      }
      renderItem={({ item }) => {
        const nombre = item.edicion.datos.nombre.trim() || "Receta sin nombre";
        const fecha = new Date(item.guardadoEn);
        const guardado = Number.isFinite(fecha.getTime())
          ? fecha.toLocaleString("es-PE")
          : null;

        return (
          <View>
            <Pressable
              style={styles.abrir}
              accessibilityRole="button"
              accessibilityLabel={"Retomar " + nombre}
              disabled={borrado.isPending}
              onPress={() =>
                router.navigate({
                  pathname: "/mis-recetas/borrador/[id]",
                  params: { id: item.id },
                })
              }
            >
              <FotoReceta
                uri={item.edicion.datos.imagen?.uri}
                style={styles.foto}
              />
              <View style={styles.detalle}>
                <Text style={styles.nombre} numberOfLines={2}>
                  {nombre}
                </Text>
                {guardado && <Text style={styles.fecha}>{guardado}</Text>}
              </View>
            </Pressable>
            <Pressable
              style={styles.eliminar}
              accessibilityRole="button"
              accessibilityLabel={"Eliminar " + nombre}
              disabled={borrado.isPending}
              onPress={() => confirmarEliminacion(item)}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={TemaFormulario.colores.error}
              />
            </Pressable>
          </View>
        );
      }}
    />
  );
};

export default borradores;
const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
    borderRadius: TemaFormulario.radioCampo,
    borderWidth: 1,
    borderColor: TemaFormulario.colores.borde,
    backgroundColor: TemaFormulario.colores.campo,
  },
  abrir: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
  },
  foto: { width: 64, height: 64, borderRadius: Spacing.two },
  detalle: { flex: 1 },
  fecha: { color: TemaFormulario.colores.secundario },
  nombre: {
    fontFamily: TemaFormulario.fuenteEtiqueta,
    color: TemaFormulario.colores.texto,
  },
  eliminar: {
    width: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.one,
  },
  aviso: { color: TemaFormulario.colores.error, marginBottom: Spacing.two },
});
