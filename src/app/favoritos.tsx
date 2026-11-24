import { styles as s, coloresTextoBoton } from "@/styles/favoritos.styles";
import { FotoReceta } from "@/components/recetas/FotoReceta";
import { BotonVolver } from "@/components/ui/botonVolver";
import { useConexion } from "@/hooks/useConexion";
import { useListaFavoritosLocales } from "@/hooks/useListaFavoritosLocales";
import {
  quitarFavoritos,
  vaciarFavoritos,
  verificarFavoritos,
  type ListaFavoritos,
} from "@/storage/favoritos";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Eliminacion {
  lista: ListaFavoritos;
  ids: number[] | null;
  cantidad: number;
}

export default function Favoritos() {
  const { sinConexion } = useConexion();
  const cliente = useQueryClient();
  const { lista, clave, consulta, identidad } = useListaFavoritosLocales();
  const items = consulta.data ?? [];
  const [seleccionando, setSeleccionando] = useState(false);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [confirmacion, setConfirmacion] = useState<Eliminacion | null>(null);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState("");
  const [revision, setRevision] = useState(0);
  const bloqueado = useRef(false);
  const idsSeleccionados = items
    .filter((item) => seleccionados.includes(item.id))
    .map((item) => item.id);
  const todosSeleccionados =
    items.length > 0 && idsSeleccionados.length === items.length;

  useEffect(() => {
    setSeleccionando(false);
    setSeleccionados([]);
    setConfirmacion(null);
  }, [lista?.clave, lista?.token]);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      setErrorDisponibilidad("");
      if (lista && !sinConexion) {
        void (async () => {
          try {
            await verificarFavoritos(lista);
            await cliente.invalidateQueries({ queryKey: clave, exact: true });
          } catch {
            if (activo)
              setErrorDisponibilidad(
                "No pudimos comprobar la disponibilidad. Puedes consultar las copias descargadas.",
              );
          }
        })();
      }
      return () => {
        activo = false;
      };
    }, [lista, clave, sinConexion, revision, cliente]),
  );

  const eliminacion = useMutation({
    mutationKey: ["quitar-favoritos-locales", lista?.clave],
    networkMode: "always",
    retry: false,
    mutationFn: async (operacion: Eliminacion) => {
      if (operacion.ids === null) await vaciarFavoritos(operacion.lista);
      else await quitarFavoritos(operacion.lista, operacion.ids);
    },
    onSuccess: async () => {
      setSeleccionados([]);
      setSeleccionando(false);
      await Promise.all([
        cliente.invalidateQueries({
          queryKey: ["favoritos-locales", "contenido"],
        }),
        cliente.invalidateQueries({ queryKey: ["perfil-dispositivo"] }),
      ]);
    },
  });
  const ocupado = eliminacion.isPending;
  const preparado =
    !!lista &&
    identidad.isSuccess &&
    !identidad.isFetching &&
    consulta.isSuccess &&
    !ocupado;
  const cargando = !identidad.isError && (!lista || consulta.isPending);
  const error = eliminacion.isError
    ? "No pudimos quitar los favoritos. Tus selecciones se conservan; inténtalo nuevamente."
    : identidad.isError || consulta.isError
      ? "No pudimos abrir tus favoritos locales. Inténtalo nuevamente."
      : errorDisponibilidad;

  function alternarSeleccion(id: number) {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((actual) => actual !== id)
        : [...actuales, id],
    );
  }

  async function confirmarEliminacion() {
    if (!confirmacion || bloqueado.current || !preparado) return;
    bloqueado.current = true;
    const operacion = confirmacion;
    setConfirmacion(null);
    try {
      await eliminacion.mutateAsync(operacion);
    } catch {
      /* Mostramos el error y conservamos la selección. */
    } finally {
      bloqueado.current = false;
    }
  }

  return (
    <SafeAreaView style={s.pantalla}>
      <View style={s.encabezado}>
        <BotonVolver />
        <Text style={s.titulo}>Favoritos</Text>
      </View>
      <Text style={s.aviso}>
        {sinConexion ? "Sin conexión · " : ""}Guardados en este dispositivo. La
        sincronización entre dispositivos aún no está disponible.
      </Text>
      {items.length > 0 && (
        <View style={s.herramientas}>
          <View style={s.resumenColeccion}>
            <View style={s.iconoColeccion}>
              <Ionicons
                name={seleccionando ? "checkmark-done" : "heart"}
                size={22}
                color={seleccionando ? "#B83C08" : "#D84343"}
              />
            </View>
            <View style={s.textosColeccion}>
              <Text style={s.tituloColeccion}>
                {seleccionando ? "Elige tus recetas" : "Tu colección"}
              </Text>
              <Text style={s.subtituloColeccion}>
                {seleccionando
                  ? "Toca las que quieras quitar"
                  : "Tus ideas para volver a cocinar"}
              </Text>
            </View>
            <View style={s.contador}>
              <Text style={s.textoContador} accessibilityLiveRegion="polite">
                {seleccionando
                  ? `${idsSeleccionados.length}/${items.length}`
                  : items.length}
              </Text>
            </View>
          </View>
          {seleccionando ? (
            <View style={s.botonesFila}>
              <BotonFavoritos
                texto={
                  todosSeleccionados ? "Deseleccionar todo" : "Seleccionar todo"
                }
                icono={
                  todosSeleccionados
                    ? "remove-circle-outline"
                    : "checkmark-circle-outline"
                }
                disabled={!preparado}
                onPress={() =>
                  setSeleccionados(
                    todosSeleccionados ? [] : items.map((item) => item.id),
                  )
                }
              />
              <BotonFavoritos
                texto="Cancelar"
                icono="close-outline"
                variante="neutro"
                disabled={!preparado}
                onPress={() => {
                  setSeleccionando(false);
                  setSeleccionados([]);
                  eliminacion.reset();
                }}
              />
            </View>
          ) : (
            <View style={s.botonesFila}>
              <BotonFavoritos
                texto="Seleccionar"
                icono="checkbox-outline"
                disabled={!preparado}
                onPress={() => {
                  setSeleccionando(true);
                  setSeleccionados([]);
                  eliminacion.reset();
                }}
              />
              <BotonFavoritos
                texto="Vaciar lista"
                icono="trash-outline"
                variante="peligroSuave"
                disabled={!preparado}
                onPress={() => {
                  if (lista)
                    setConfirmacion({
                      lista,
                      ids: null,
                      cantidad: items.length,
                    });
                }}
              />
            </View>
          )}
        </View>
      )}
      {ocupado && (
        <View style={s.progreso}>
          <ActivityIndicator color="#FF5008" />
          <Text accessibilityLiveRegion="polite">Quitando favoritos...</Text>
        </View>
      )}
      {error ? (
        <View>
          <Text accessibilityRole="alert" style={s.aviso}>
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={ocupado}
            onPress={() => {
              eliminacion.reset();
              void identidad.refetch();
              if (lista) void consulta.refetch();
              setRevision((valor) => valor + 1);
            }}
          >
            <Text style={s.accion}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}
      {cargando ? (
        <ActivityIndicator color="#FF5008" />
      ) : (
        <FlatList
          style={s.scroll}
          data={items}
          extraData={{ seleccionados, seleccionando, preparado }}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.lista}
          ListEmptyComponent={
            error ? undefined : (
              <Text style={s.aviso}>
                Todavía no tienes favoritos. Pulsa el corazón de una receta para
                guardarla.
              </Text>
            )
          }
          renderItem={({ item }) => {
            const seleccionado = idsSeleccionados.includes(item.id);
            return (
              <View style={[s.tarjeta, seleccionado && s.tarjetaSeleccionada]}>
                <Pressable
                  disabled={
                    ocupado || (seleccionando ? !preparado : !item.receta)
                  }
                  accessibilityRole={seleccionando ? "checkbox" : "button"}
                  accessibilityState={
                    seleccionando
                      ? { checked: seleccionado, disabled: !preparado }
                      : { disabled: ocupado || !item.receta }
                  }
                  accessibilityLabel={`${seleccionando ? "Seleccionar" : "Abrir"} ${item.nombre}`}
                  onPress={() =>
                    seleccionando
                      ? alternarSeleccion(item.id)
                      : router.push({
                          pathname: "/receta/[id]",
                          params: { id: String(item.id), local: "1" },
                        })
                  }
                >
                  {seleccionando && (
                    <View
                      style={[
                        s.marcaSeleccion,
                        seleccionado && s.marcaActiva,
                        !item.receta && s.marcaSinFoto,
                      ]}
                    >
                      <Ionicons
                        name={
                          seleccionado ? "checkmark-circle" : "ellipse-outline"
                        }
                        size={23}
                        color={seleccionado ? "#FFFFFF" : "#8B7465"}
                      />
                      <Text
                        style={[
                          s.textoSeleccion,
                          seleccionado && s.textoSeleccionActivo,
                        ]}
                      >
                        {seleccionado ? "Seleccionada" : "Elegir"}
                      </Text>
                    </View>
                  )}
                  {item.receta ? (
                    <FotoReceta uri={item.receta.imagen_url} style={s.foto} />
                  ) : null}
                  <Text style={s.nombre}>{item.nombre}</Text>
                  <Text style={s.descripcion}>
                    {item.aviso ??
                      `${item.receta?.tiempo_preparacion} min · Disponible sin conexión`}
                  </Text>
                </Pressable>
                {!seleccionando && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar ${item.nombre} de favoritos`}
                    disabled={!preparado}
                    style={({ pressed }) => [
                      s.quitarIndividual,
                      !preparado && s.deshabilitado,
                      pressed && s.presionado,
                    ]}
                    onPress={() => {
                      if (lista)
                        setConfirmacion({ lista, ids: [item.id], cantidad: 1 });
                    }}
                  >
                    <Ionicons
                      name="heart-dislike-outline"
                      size={17}
                      color="#A83D36"
                    />
                    <Text style={s.textoQuitar}>Quitar de favoritos</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      )}
      {seleccionando && items.length > 0 && (
        <View style={s.barraSeleccion}>
          <Text style={s.ayudaSeleccion} accessibilityLiveRegion="polite">
            {idsSeleccionados.length === 0
              ? "Selecciona al menos una receta"
              : `${idsSeleccionados.length} ${idsSeleccionados.length === 1 ? "receta seleccionada" : "recetas seleccionadas"}`}
          </Text>
          <View style={s.botonesFila}>
            <BotonFavoritos
              texto={`Quitar selección (${idsSeleccionados.length})`}
              icono="trash-outline"
              variante="naranja"
              disabled={!preparado || !idsSeleccionados.length}
              onPress={() => {
                if (lista)
                  setConfirmacion({
                    lista,
                    ids: idsSeleccionados,
                    cantidad: idsSeleccionados.length,
                  });
              }}
            />
          </View>
        </View>
      )}
      <Modal
        transparent
        visible={confirmacion !== null}
        animationType="fade"
        onRequestClose={() => setConfirmacion(null)}
      >
        <View style={s.fondoModal}>
          <View style={s.modal} accessibilityViewIsModal>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar confirmación"
              hitSlop={8}
              style={s.cerrarModal}
              onPress={() => setConfirmacion(null)}
            >
              <Ionicons name="close" size={22} color="#8B7465" />
            </Pressable>
            <View style={s.iconoModal}>
              <Ionicons name="trash-outline" size={30} color="#B33B34" />
            </View>
            <Text style={s.tituloModal} accessibilityRole="header">
              {confirmacion?.ids === null
                ? "¿Vaciar tus favoritos?"
                : "¿Quitar de favoritos?"}
            </Text>
            <Text style={s.textoModal}>
              {confirmacion?.cantidad === 1 ? "Se quitará" : "Se quitarán"}{" "}
              {confirmacion?.cantidad}{" "}
              {confirmacion?.cantidad === 1
                ? "receta y su copia descargada"
                : "recetas y sus copias descargadas"}{" "}
              de esta lista.
            </Text>
            <View style={s.botonesFila}>
              <BotonFavoritos
                texto="Conservar"
                variante="neutro"
                onPress={() => setConfirmacion(null)}
              />
              <BotonFavoritos
                texto={confirmacion?.ids === null ? "Sí, vaciar" : "Sí, quitar"}
                icono="trash-outline"
                variante="naranja"
                disabled={!preparado}
                onPress={() => {
                  void confirmarEliminacion();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function BotonFavoritos({
  texto,
  icono,
  variante = "suave",
  disabled = false,
  onPress,
}: {
  texto: string;
  icono?: ComponentProps<typeof Ionicons>["name"];
  variante?: "suave" | "neutro" | "peligroSuave" | "peligro" | "naranja";
  disabled?: boolean;
  onPress: () => void;
}) {
  const color = coloresTextoBoton[variante].color;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.boton,
        s[variante],
        disabled && s.deshabilitado,
        pressed && s.presionado,
      ]}
    >
      {icono && <Ionicons name={icono} size={19} color={color} />}
      <Text style={[s.textoBoton, coloresTextoBoton[variante]]}>{texto}</Text>
    </Pressable>
  );
}
