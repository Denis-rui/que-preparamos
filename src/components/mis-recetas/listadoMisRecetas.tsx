import { useConexion } from "@/hooks/useConexion";
import useMisRecetas from "@/hooks/useMisRecetas";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "../ui/appButton";
interface Props {
  usuarioId: number;
}
const ListadoMisRecetas = ({ usuarioId }: Props) => {
  const [filtro, setFiltro] = useState<"privadas" | "publicadas">("privadas");
  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const { sinConexion } = useConexion();

  const { consultaGuardada: consulta, recetas } = useMisRecetas(
    usuarioId,
    filtro,
    busqueda,
  );

  const errorAcceso =
    isAxiosError(consulta.error) &&
    (consulta.error.response?.status === 401 ||
      consulta.error.response?.status === 403 ||
      consulta.error.code === "SESION_CAMBIADA" ||
      consulta.error.code === "SESION_NO_ENCONTRADA");

  // No buscar si no existe data
  const totalSinBuscar =
    busqueda === "" ? consulta.data?.pages[0].total : undefined;

  const sinRecetas = totalSinBuscar === 0;

  const esperandoListadoInicial =
    busqueda === "" && consulta.data === undefined;

  const puedeBuscar = !sinRecetas && !esperandoListadoInicial && !errorAcceso;

  const preparandoBusqueda = puedeBuscar && texto.trim() !== busqueda;
  useEffect(() => {
    if (!puedeBuscar) return;
    const temporizador = setTimeout(() => {
      setBusqueda(texto.trim());
    }, 400);

    return () => {
      clearTimeout(temporizador);
    };
  }, [texto, puedeBuscar]);
  function actualizar() {
    if (sinConexion || consulta.isPaused || consulta.isFetching) return;
    void consulta.refetch();
  }
  function cargarMas() {
    if (
      preparandoBusqueda ||
      errorAcceso ||
      sinConexion ||
      consulta.isPaused ||
      consulta.isFetching ||
      !consulta.hasNextPage
    )
      return;

    void consulta.fetchNextPage({
      cancelRefetch: false,
    });
  }
  function cargarAutomaticamente() {
    // Evita que se llame a cargarMas() si ya está cargando o si hubo un error.
    if (consulta.isFetchNextPageError) return;
    if (consulta.isFetchingNextPage) return;
    cargarMas();
  }

  function seleccionarFiltro(nuevoFiltro: "privadas" | "publicadas") {
    if (nuevoFiltro === filtro) return;
    setFiltro(nuevoFiltro);
    setTexto("");
    setBusqueda("");
  }

  function mostrarContenido() {
    if (errorAcceso) {
      return (
        <EstadoListado
          mensaje={
            obtenerMensajeError(consulta.error) ??
            "No pudimos verificar tu acceso."
          }
          reintentar={
            !sinConexion && !consulta.isFetching ? actualizar : undefined
          }
        />
      );
    }

    // Todavía no hemos recibido ninguna página para esta consulta.
    if (!consulta.data) {
      if (sinConexion || consulta.isPaused) {
        return (
          <EstadoListado mensaje="Necesitas conexión para cargar estas recetas." />
        );
      }

      if (consulta.isError && !consulta.isFetching) {
        return (
          <EstadoListado
            mensaje={
              obtenerMensajeError(consulta.error) ??
              "No pudimos cargar tus recetas."
            }
            reintentar={actualizar}
          />
        );
      }

      return <EstadoListado mensaje="Cargando tus recetas…" cargando />;
    }
    return (
      <FlatList
        key={`${filtro}:${busqueda}`}
        data={recetas}
        keyExtractor={(receta) => String(receta.id)}
        contentContainerStyle={s.lista}
        keyboardShouldPersistTaps="handled"
        onEndReached={cargarAutomaticamente}
        onEndReachedThreshold={0.4}
        onRefresh={sinConexion ? undefined : actualizar}
        refreshing={consulta.isRefetching && !consulta.isPaused}
        ListHeaderComponent={
          <View>
            {(sinConexion || consulta.isPaused) && (
              <Text style={s.aviso}>Sin conexión</Text>
            )}

            {consulta.isError && !consulta.isFetchNextPageError && (
              <EstadoListado
                mensaje="No pudimos actualizar las recetas."
                reintentar={
                  !sinConexion && !consulta.isPaused && !consulta.isFetching
                    ? actualizar
                    : undefined
                }
              />
            )}
          </View>
        }
        ListEmptyComponent={
          <EstadoListado
            mensaje={
              busqueda
                ? "No encontramos recetas con ese nombre."
                : filtro === "privadas"
                  ? "Aún no tienes recetas privadas."
                  : "Aún no tienes recetas publicadas."
            }
          />
        }
        renderItem={({ item }) => (
          <View style={s.tarjeta}>
            <Text style={s.nombre}>{item.nombre}</Text>

            <Text style={s.texto}>
              {item.visibilidad === "privada" ? "Privada" : "Publicada"}
            </Text>

            {item.solicitud_pendiente && (
              <Text style={s.revision}>
                {item.solicitud_pendiente.tipo === "publicacion"
                  ? "Publicación en revisión"
                  : "Corrección en revisión"}
              </Text>
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={s.pie}>
            {consulta.isFetchingNextPage && !consulta.isPaused && (
              <EstadoListado mensaje="Cargando más recetas…" cargando />
            )}

            {consulta.isFetchNextPageError && (
              <EstadoListado
                mensaje="No pudimos cargar más recetas."
                reintentar={
                  !sinConexion && !consulta.isPaused && !consulta.isFetching
                    ? cargarMas
                    : undefined
                }
              />
            )}
          </View>
        }
      />
    );
  }

  return (
    <View style={s.contenedor}>
      <View style={s.pestanas} accessibilityRole="tablist">
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{
            selected: filtro === "privadas",
          }}
          onPress={() => seleccionarFiltro("privadas")}
          style={[s.pestana, filtro === "privadas" && s.pestanaActiva]}
        >
          <Text style={s.nombre}>Privadas</Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{
            selected: filtro === "publicadas",
          }}
          onPress={() => seleccionarFiltro("publicadas")}
          style={[s.pestana, filtro === "publicadas" && s.pestanaActiva]}
        >
          <Text style={s.nombre}>Publicadas</Text>
        </Pressable>
      </View>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Ingrese el nombre a buscar"
        style={s.buscador}
        accessibilityLabel="Buscar mis recetas"
        maxLength={100}
      />
      {preparandoBusqueda && <ActivityIndicator size="large" color="#FF5008" />}
      {mostrarContenido()}
    </View>
  );
};

export default ListadoMisRecetas;

const EstadoListado = ({
  mensaje,
  cargando = false,
  reintentar,
}: {
  mensaje: string;
  cargando?: boolean;
  reintentar?: () => void;
}) => {
  return (
    <View>
      {cargando && <ActivityIndicator size="large" color="#FF5008" />}
      <Text style={{ textAlign: "center" }}>{mensaje}</Text>
      {reintentar && <AppButton label="Reintentar" onPress={reintentar} />}
    </View>
  );
};
const s = StyleSheet.create({
  contenedor: { flex: 1, gap: 12 },

  pestanas: { flexDirection: "row" },
  pestana: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  pestanaActiva: {
    borderBottomColor: "#FF5008",
  },

  buscador: {
    backgroundColor: "#FFFFFF",
    color: "#552414",
    borderWidth: 1,
    borderColor: "#D9D1C7",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },

  botonLimpiar: {
    alignSelf: "flex-start",
    paddingVertical: 10,
  },

  lista: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  estado: {
    paddingVertical: 20,
    gap: 12,
  },
  pie: {
    paddingVertical: 12,
  },

  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D1C7",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },

  nombre: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#552414",
  },
  texto: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#6D625B",
  },
  revision: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#A54400",
  },
  aviso: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#6D625B",
    marginBottom: 12,
  },
});
