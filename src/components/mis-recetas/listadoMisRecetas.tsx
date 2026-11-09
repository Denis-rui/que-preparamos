import { useConexion } from "@/hooks/useConexion";
import useMisRecetas from "@/hooks/useMisRecetas";
import { obtenerMensajeError } from "@/utils/mensajeError";
import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import EstadoListado from "./EstadoListado";
import ListaMisRecetas from "./ListaMisRecetas";
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
      <ListaMisRecetas
        key={`${filtro}:${busqueda}`}
        recetas={recetas}
        consulta={consulta}
        filtro={filtro}
        busqueda={busqueda}
        sinConexion={sinConexion}
        actualizar={actualizar}
        cargarMas={cargarMas}
        cargarAutomaticamente={cargarAutomaticamente}
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
      <View style={s.contenedorBuscador}>
        <Ionicons name="search" size={20} color="#552414" style={s.icono} />
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Ingrese el nombre a buscar"
          style={s.buscador}
          accessibilityLabel="Buscar mis recetas"
          maxLength={100}
        />
      </View>
      {preparandoBusqueda && <ActivityIndicator size="large" color="#FF5008" />}
      {mostrarContenido()}
    </View>
  );
};

export default ListadoMisRecetas;

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
  icono: {
    marginRight: 8,
  },
  contenedorBuscador: {
    flexDirection: "row", // Coloca el icono y el texto en la misma línea
    alignItems: "center", // Centra verticalmente el icono y el texto
    backgroundColor: "#FFFCF2", // O el color de fondo que uses
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12, // Espaciado interno horizontal
    height: 48, // Altura estándar táctil
  },
  buscador: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
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
