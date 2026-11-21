import { View } from "react-native";
import { AppButton } from "../ui/appButton";

type TipoAccion = "editar" | "publicar" | "corregir" | "ver-solicitud";
type Accion = { tipo: TipoAccion; etiqueta: string; principal?: boolean };

export type ManejadoresReceta<T> = Partial<
  Record<TipoAccion | "opciones", (receta: T) => void>
>;

export const obtenerAccionesReceta = (
  visibilidad: string,
  tieneSolicitud: boolean,
  textoPublicar = "Publicar",
): Accion[] => {
  if (visibilidad !== "privada" && visibilidad !== "publicada") return [];

  if (tieneSolicitud) {
    return [{ tipo: "ver-solicitud", etiqueta: "Ver solicitud" }];
  }
  if (visibilidad === "privada") {
    return [
      { tipo: "editar", etiqueta: "Editar" },
      { tipo: "publicar", etiqueta: textoPublicar, principal: true },
    ];
  }
  return [{ tipo: "corregir", etiqueta: "Corregir" }];
};

const BotonesMisRecetas = <
  T extends { visibilidad: string; solicitud_pendiente: object | null },
>({
  receta,
  manejadores,
}: {
  receta: T;
  manejadores?: ManejadoresReceta<T>;
}) => {
  const acciones = obtenerAccionesReceta(
    receta.visibilidad,
    receta.solicitud_pendiente !== null,
  );
  return (
    <View style={{ margin: 16, gap: 8 }}>
      {acciones.map(({ tipo, etiqueta, principal }) => {
        const ejecutar = manejadores?.[tipo];

        return (
          <AppButton
            key={tipo}
            label={etiqueta}
            variant={principal ? "primario" : "secundario"}
            disabled={!ejecutar}
            onPress={() => ejecutar?.(receta)}
          />
        );
      })}
    </View>
  );
};

export default BotonesMisRecetas;
