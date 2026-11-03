import { BotonVolver } from "@/components/ui/botonVolver";
import { FotoReceta } from "@/components/recetas/FotoReceta";
import { useConexion } from "@/hooks/useConexion";
import { identificarListaFavoritos, leerFavoritos, quitarFavorito, verificarFavoritos, type FavoritoLocal, type ListaFavoritos } from "@/storage/favoritos";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favoritos() {
  const { sinConexion } = useConexion();
  const [lista, setLista] = useState<ListaFavoritos | null>(null);
  const [items, setItems] = useState<FavoritoLocal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [quitando, setQuitando] = useState<number | null>(null);
  const [revision, setRevision] = useState(0);

  useFocusEffect(useCallback(() => {
    let activo = true;
    setItems([]);
    setLista(null);
    setCargando(true);
    setError("");
    void (async () => {
      try {
        const actual = await identificarListaFavoritos();
        let guardados = await leerFavoritos(actual);
        if (activo) { setLista(actual); setItems(guardados); }
        if (!sinConexion) {
          try {
            await verificarFavoritos(actual);
            guardados = await leerFavoritos(actual);
            if (activo) setItems(guardados);
          } catch {
            if (activo) setError("No pudimos comprobar la disponibilidad. Puedes consultar las copias descargadas.");
          }
        }
      } catch {
        if (activo) setError("No pudimos abrir tus favoritos locales. Inténtalo nuevamente.");
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => { activo = false; };
  }, [sinConexion, revision]));

  async function quitar(id: number) {
    if (!lista || quitando !== null) return;
    setQuitando(id);
    setError("");
    try {
      await quitarFavorito(lista, id);
      setItems(await leerFavoritos(lista));
    } catch { setError("No pudimos quitar la receta. Inténtalo nuevamente."); }
    finally { setQuitando(null); }
  }

  return (
    <SafeAreaView style={s.pantalla}>
      <View style={s.encabezado}><BotonVolver /><Text style={s.titulo}>Favoritos</Text></View>
      <Text style={s.aviso}>{sinConexion ? "Sin conexión · " : ""}Guardados solo en este dispositivo. No se sincronizan con tu cuenta.</Text>
      {error ? <View><Text accessibilityRole="alert" style={s.aviso}>{error}</Text><Pressable onPress={() => setRevision((valor) => valor + 1)}><Text style={s.accion}>Reintentar</Text></Pressable></View> : null}
      {cargando ? <ActivityIndicator color="#FF5008" /> : (
        <FlatList data={items} keyExtractor={(item) => String(item.id)} contentContainerStyle={s.lista}
          ListEmptyComponent={<Text style={s.aviso}>Todavía no tienes favoritos. Abre una receta y pulsa el corazón para descargarla.</Text>}
          renderItem={({ item }) => (
            <View style={s.tarjeta}>
              <Pressable disabled={!item.receta} accessibilityRole="button"
                accessibilityLabel={`Abrir ${item.nombre}`}
                onPress={() => router.push({ pathname: "/receta/[id]", params: { id: String(item.id), local: "1" } })}>
                {item.receta ? <FotoReceta uri={item.receta.imagen_url} style={s.foto} /> : null}
                <Text style={s.nombre}>{item.nombre}</Text>
                <Text style={s.descripcion}>{item.aviso ?? `${item.receta?.tiempo_preparacion} min · Disponible sin conexión`}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${item.nombre} de favoritos`} disabled={quitando !== null} onPress={() => { void quitar(item.id); }}>
                <Text style={s.accion}>{quitando === item.id ? "Quitando..." : "Quitar de favoritos"}</Text>
              </Pressable>
            </View>
          )} />
      )}
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "#FFFBEF" },
  encabezado: { flexDirection: "row", alignItems: "center", gap: 20, padding: 20 },
  titulo: { fontSize: 26, fontFamily: "Kavoon_400Regular", color: "#552414" },
  aviso: { marginHorizontal: 20, marginBottom: 16, color: "#675348", lineHeight: 21 },
  lista: { padding: 20, gap: 16 },
  tarjeta: { backgroundColor: "white", borderRadius: 18, overflow: "hidden", paddingBottom: 12 },
  foto: { height: 170, width: "100%" },
  nombre: { fontFamily: "Inter_800ExtraBold", fontSize: 18, color: "#552414", padding: 12 },
  descripcion: { paddingHorizontal: 12, color: "#675348" },
  accion: { color: "#B83C08", padding: 12, fontWeight: "600" },
});
