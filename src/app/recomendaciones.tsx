import { FotoReceta } from "@/components/recetas/FotoReceta";
import { useRecomendaciones } from "@/hooks/useRecomendaciones";
import { styles } from "@/styles/recomendaciones.styles";
import type { RecetaRecomendada } from "@/types/receta";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// leer lo que llega desde "Mis ingredientes".
// La pantalla anterior manda texto: ingredientes="1,2,3". Aquí vuelve a números.
function parsearIds(valor: string | string[] | undefined): number[] {
  const texto = Array.isArray(valor) ? valor.join(",") : (valor ?? "");
  const ids = texto
    .split(",")
    .map((parte) => Number(parte.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
  return [...new Set(ids)].slice(0, 50);
}

function parsearCategoria(valor: string | string[] | undefined): number | null {
  const texto = Array.isArray(valor) ? valor[0] : valor;
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// cómo se ve una receta (foto, datos e ingredientes que sí tienes).
function TarjetaRecomendacion({ item }: { item: RecetaRecomendada }) {
  const faltantes =
    item.cantidad_faltantes ?? item.ingredientes_faltantes?.length ?? 0;
  const disponibles = item.ingredientes_disponibles ?? [];

  return (
    <Pressable
      style={styles.tarjeta}
      onPress={() => router.push(`/receta/${item.id}`)}
    >
      <View style={styles.filaSuperior}>
        <FotoReceta uri={item.imagen_url} style={styles.imagen} />
        <View style={styles.tarjetaContenido}>
          <View style={styles.tarjetaHeader}>
            <Text style={styles.tarjetaTitulo}>{item.nombre}</Text>
            <View style={styles.corazon}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={18}
                color="#552414"
              />
            </View>
          </View>

          <View style={styles.metaFila}>
            <MetaCapsula
              icono="clock-outline"
              texto={`${item.tiempo_preparacion} min`}
            />
            <MetaCapsula
              icono="account-group-outline"
              texto={`${item.porciones} porciones`}
            />
          </View>

          <Text style={styles.descripcion}>{item.descripcion}</Text>

          <View
            style={[
              styles.insignia,
              faltantes === 0
                ? styles.insigniaCompleta
                : styles.insigniaParcial,
            ]}
          >
            <Text style={styles.insigniaTexto}>
              {faltantes === 0
                ? "¡Lo tienes todo!"
                : faltantes === 1
                  ? "Te falta 1 ingrediente"
                  : `Te faltan ${faltantes} ingredientes`}
            </Text>
          </View>
        </View>
      </View>

      {disponibles.length > 0 && (
        <View style={styles.tienesBox}>
          <View style={styles.tienesHeader}>
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              color="#80B94B"
            />
            <Text style={styles.tienesLabel}>Tienes</Text>
          </View>
          <View style={styles.chipsFila}>
            {disponibles.map((ing) => (
              <View key={ing.ingrediente_id} style={styles.chip}>
                <Text style={styles.chipTexto}>{ing.nombre}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Capsulas con icono (se usa para tiempo y porciones).
function MetaCapsula({
  icono,
  texto,
}: {
  icono: "clock-outline" | "account-group-outline";
  texto: string;
}) {
  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons name={icono} size={12} color="#552414" />
      <Text style={styles.metaTexto}>{texto}</Text>
    </View>
  );
}

// mensajes de estado (carga, error o lista vacía).
function EstadoMensaje({
  titulo,
  texto,
  children,
}: {
  titulo?: string;
  texto: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.estadoContenedor}>
      {titulo && <Text style={styles.estadoTitulo}>{titulo}</Text>}
      <Text style={styles.estadoTexto}>{texto}</Text>
      {children}
    </View>
  );
}

// La pantalla junta todo con una lista infinita.
export default function Recomendaciones() {
  const params = useLocalSearchParams<{
    ingredientes?: string | string[];
    categoriaId?: string | string[];
  }>();
  const ids = parsearIds(params.ingredientes);
  const categoriaId = parsearCategoria(params.categoriaId);
  const {
    recetas,
    total,
    loading,
    error,
    recargar,
    tieneMas,
    cargandoMas,
    cargarMas,
  } = useRecomendaciones(ids, categoriaId);

  const sinIds = ids.length === 0;
  const mostrarLista = !sinIds && !loading && !error && total > 0;

  let contenidoVacio = (
    <EstadoMensaje
      titulo="Sin coincidencias"
      texto="Ninguna receta usa esos ingredientes. Prueba agregando otros."
    />
  );
  if (sinIds) {
    contenidoVacio = (
      <EstadoMensaje
        titulo="Sin ingredientes"
        texto="Vuelve atrás y agrega al menos un ingrediente para ver qué puedes preparar."
      />
    );
  } else if (loading) {
    contenidoVacio = (
      <EstadoMensaje texto="Buscando platos con tus ingredientes...">
        <ActivityIndicator size="large" />
      </EstadoMensaje>
    );
  } else if (error) {
    contenidoVacio = (
      <EstadoMensaje titulo="No se pudo cargar" texto={error}>
        <Pressable style={styles.botonReintentar} onPress={recargar}>
          <Text style={styles.botonReintentarTexto}>Reintentar</Text>
        </Pressable>
      </EstadoMensaje>
    );
  }

  return (
    <SafeAreaView
      style={styles.contenedor}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.topBar}>
        <Pressable style={styles.botonAtras} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#552414" />
        </Pressable>
        <View style={styles.logoFila}>
          <Image
            source={require("../assets/imagenes/icono_sombrero_chef.png")}
            style={styles.logoSombrero}
            contentFit="contain"
          />
          <Image
            source={require("../assets/imagenes/titulo.png")}
            style={styles.logoTitulo}
            contentFit="contain"
          />
        </View>
      </View>

      <FlatList
        data={mostrarLista ? recetas : []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TarjetaRecomendacion item={item} />}
        ListHeaderComponent={
          <>
            <View style={styles.tituloFila}>
              <Image
                source={require("../assets/SVG/adornos/hojas_izquierda.svg")}
                style={styles.hojaTitulo}
                contentFit="contain"
              />
              <Text style={styles.titulo}>Recomendaciones</Text>
              <Image
                source={require("../assets/SVG/adornos/hojas_derecha.svg")}
                style={styles.hojaTitulo}
                contentFit="contain"
              />
            </View>
            <Text style={styles.subtitulo}>
              Basadas en los ingredientes que seleccionaste
            </Text>
            {mostrarLista && (
              <Text style={styles.contador}>
                {total}{" "}
                {total === 1 ? "receta encontrada" : "recetas encontradas"}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={contenidoVacio}
        ListFooterComponent={
          cargandoMas ? (
            <View style={styles.cargarMasContenedor}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (mostrarLista && tieneMas && !cargandoMas) void cargarMas();
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
