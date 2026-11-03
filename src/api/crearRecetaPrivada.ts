import type { DatosFormularioReceta } from "@/types/formularioRecetas";
import { AxiosError } from "axios";
import { Platform } from "react-native";
import { quePreparamos } from "./cliente";

interface RespuestaCrearReceta {
  // La respuesta trae más campos.
  // Aquí describimos únicamente el identificador que utilizamos.
  data: {
    id: number;
  };
}

export async function crearRecetaPrivada(
  datos: DatosFormularioReceta,
): Promise<number> {
  const imagen = datos.imagen;

  if (!imagen || datos.categoriaId === null || datos.subcategoriaId === null) {
    throw new Error("El formulario está incompleto.");
  }

  const cuerpo = new FormData();

  cuerpo.append("nombre", datos.nombre.trim());
  cuerpo.append("descripcion", datos.descripcion.trim());
  cuerpo.append("porciones", String(Number(datos.porciones)));
  cuerpo.append("tiempo_preparacion", String(Number(datos.tiempoPreparacion)));

  cuerpo.append("categoria_id", String(datos.categoriaId));
  cuerpo.append("subcategoria_id", String(datos.subcategoriaId));

  if (datos.tips.trim()) {
    cuerpo.append("tips", datos.tips.trim());
  }
  cuerpo.append(
    "ingredientes",
    JSON.stringify(
      datos.ingredientes.map((ingrediente, indice) => {
        const cantidad = ingrediente.cantidad.trim().replace(",", ".");

        return {
          ingrediente_id: ingrediente.id,
          cantidad: cantidad === "" ? null : Number(cantidad),
          unidad: ingrediente.unidad.trim() || null,
          notas: ingrediente.notas.trim() || null,

          // El orden depende de la posición actual.
          orden: indice + 1,
        };
      }),
    ),
  );

  cuerpo.append(
    "pasos",
    JSON.stringify(
      datos.pasos.map((paso, indice) => ({
        orden: indice + 1,
        instruccion: paso.instruccion.trim(),
      })),
    ),
  );
  const tipoDeclarado = (
    imagen.mimeType ||
    imagen.file?.type ||
    ""
  ).toLowerCase();

  const extensionOriginal = (imagen.fileName || imagen.uri.split("?")[0])
    .split(".")
    .pop()
    ?.toLowerCase();

  const tipoPorExtension: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  const tipo =
    tipoDeclarado === "image/jpg"
      ? "image/jpeg"
      : tipoDeclarado || tipoPorExtension[extensionOriginal ?? ""];

  const extensionPorTipo: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const extension = extensionPorTipo[tipo];

  if (!extension) {
    throw new Error("No se pudo identificar el formato de la imagen.");
  }

  const nombreArchivo = `receta.${extension}`;

  if (Platform.OS === "web") {
    // En navegador adjuntamos un File.
    const archivo = imagen.file ?? (await (await fetch(imagen.uri)).blob());

    cuerpo.append("imagen", new File([archivo], nombreArchivo, { type: tipo }));
  } else {
    const cuerpoNativo = cuerpo as FormData & {
      append(
        campo: string,
        archivo: {
          uri: string;
          name: string;
          type: string;
        },
      ): void;
    };

    cuerpoNativo.append("imagen", {
      uri: imagen.uri,
      name: nombreArchivo,
      type: tipo,
    });
  }

  const respuesta = await quePreparamos.post<RespuestaCrearReceta>(
    "/mis-recetas",
    cuerpo,
    {
      autenticar: true,
      timeout: 60000,
    },
  );

  // respuesta.data es el JSON recibido por Axios.
  // El data interior pertenece al contrato del backend.
  const id = respuesta.data?.data?.id;

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AxiosError(
      "El servidor no confirmó el identificador de la receta.",
      "NO_DATA",
      respuesta.config,
      respuesta.request,
      respuesta,
    );
  }

  return id;
}
