import { BloqueValoracionReceta } from "@/components/recetas/InformacionReceta";
import ModalValoracion from "@/components/recetas/ModalValoracion";
import { useMiValoracion } from "@/hooks/useMiValoracion";
import { useValorarReceta } from "@/hooks/useValorarReceta";
import { styles } from "@/styles/receta.styles";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export function ValoracionMiReceta({
  id,
  usuarioId,
  sinConexion,
}: {
  id: number;
  usuarioId: number;
  sinConexion: boolean;
}) {
  const recetaId = String(id);
  const consulta = useMiValoracion(recetaId, !sinConexion, usuarioId);
  const voto = useValorarReceta(recetaId);
  const [modal, setModal] = useState<{ puntuacion: number | null } | null>(
    null,
  );

  if (!consulta.data) {
    return (
      <View style={styles.encabezadoValoracion}>
        {consulta.isError && !sinConexion ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void consulta.refetch();
            }}
            style={styles.valoracionBloque}
          >
            <Text style={styles.valoracionCantidad}>Reintentar valoración</Text>
          </Pressable>
        ) : (
          <Text style={[styles.valoracionBloque, styles.valoracionCantidad]}>
            {sinConexion || consulta.isPaused
              ? "Valoración sin conexión"
              : "Cargando valoración…"}
          </Text>
        )}
      </View>
    );
  }

  return (
    <>
      <BloqueValoracionReceta
        etiqueta="Valorar receta"
        total={consulta.data.cantidad_valoraciones}
        promedio={consulta.data.valoracion_promedio}
        deshabilitado={sinConexion || voto.guardando}
        alPulsar={() => {
          voto.reiniciar();
          // Captura el voto inicial para que el modal conserve su modo al guardar.
          setModal({ puntuacion: consulta.miPuntuacion });
        }}
      />

      <ModalValoracion
        visible={modal !== null}
        editando={modal?.puntuacion != null}
        puntuacionActual={modal?.puntuacion}
        guardando={voto.guardando}
        exito={voto.exito}
        error={voto.error}
        onClose={() => {
          if (!voto.guardando) setModal(null);
        }}
        onCalificar={voto.valorar}
      />
    </>
  );
}
