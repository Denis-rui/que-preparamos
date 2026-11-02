import {
  DatosFormularioReceta,
  IngredienteFormulario,
  TextosReceta,
} from "@/types/formularioRecetas";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useRef, useState } from "react";

const useFormularioCrear = () => {
  const [datos, setDatos] = useState<DatosFormularioReceta>({
    nombre: "",
    descripcion: "",
    porciones: "",
    tiempoPreparacion: "",
    tips: "",
    categoriaId: null,
    subcategoriaId: null,
    ingredientes: [],
    pasos: [
      { id: 1, instruccion: "" },
      { id: 2, instruccion: "" },
    ],
    imagen: null,
  });

  const siguientePaso = useRef(3);

  const [imagenSeleccionada, setImagenSeleccionada] = useState(false);
  const [errorImagen, setErrorImagen] = useState<string | null>(null);

  const selectorImagenAbierto = useRef(false);
  // FUNCIONES

  const actualizarTexto = (campo: keyof TextosReceta, valor: string) => {
    setDatos((actuales) => ({
      ...actuales,
      [campo]: valor,
    }));
  };

  const seleccionarImagen = async (): Promise<void> => {
    if (selectorImagenAbierto.current) {
      return;
    }
    selectorImagenAbierto.current = true;
    setImagenSeleccionada(true);
    setErrorImagen(null);

    try {
      const resultado = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: false,
        base64: false,
      });

      if (resultado.canceled) {
        return;
      }
      const imagen = resultado.assets[0];

      if (!imagen) {
        setErrorImagen("No se pudo obtener la imagen seleccionada");
        return;
      }

      const tipo = (imagen.mimeType || imagen.file?.type)?.toLowerCase();

      const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (tipo && !tiposPermitidos.includes(tipo)) {
        setErrorImagen("seleccione una imagen JPG, PNG, JPEG O WEBP");
        return;
      }

      const tamanio = imagen.fileSize ?? imagen.file?.size;

      if (tamanio !== undefined && tamanio > 10 * 1024 * 1024) {
        setErrorImagen("Imagen debe pesar menos de 10 MB");
        return;
      }
      setDatos((actuales) => ({
        ...actuales,
        imagen,
      }));
    } catch (error) {
      setErrorImagen("No pudo abrir tus fotos. Intenta nuevamente.");
    } finally {
      selectorImagenAbierto.current = false;
      setImagenSeleccionada(false);
    }
  };

  const quitarImagen = () => {
    setDatos((actuales) => ({
      ...actuales,
      imagen: null,
    }));
    setErrorImagen(null);
  };

  const cambiarCategoria = (idCategoria: number | null) => {
    setDatos((actuales) => {
      if (actuales.categoriaId === idCategoria) {
        return actuales;
      }
      return {
        ...actuales,
        categoriaId: idCategoria,
        subcategoriaId: null,
      };
    });
  };
  const cambiarSubcategoria = (idSubcategoria: number | null) => {
    setDatos((actuales) => ({
      ...actuales,
      subcategoriaId: actuales.categoriaId === null ? null : idSubcategoria,
    }));
  };

  const agregarIngrediente = (ingrediente: IngredienteFormulario) => {
    setDatos((actuales) => {
      if (actuales.ingredientes.some((item) => item.id === ingrediente.id)) {
        return actuales;
      }
      return {
        ...actuales,
        ingredientes: [...actuales.ingredientes, ingrediente],
      };
    });
  };

  const quitarIngrediente = (id: number) => {
    setDatos((actuales) => ({
      ...actuales,
      ingredientes: actuales.ingredientes.filter((item) => item.id !== id),
    }));
  };
  const agregarPaso = () => {
    const id = siguientePaso.current;
    siguientePaso.current += 1;
    setDatos((actuales) => {
      if (actuales.pasos.length >= 500) {
        return actuales;
      }
      return {
        ...actuales,
        pasos: [...actuales.pasos, { id, instruccion: "" }],
      };
    });
  };

  const actualizarPaso = (id: number, instruccion: string) => {
    setDatos((actuales) => ({
      ...actuales,
      pasos: actuales.pasos.map((paso) =>
        paso.id === id ? { ...paso, instruccion } : paso,
      ),
    }));
  };

  const quitarPaso = (id: number) => {
    setDatos((actuales) => {
      if (actuales.pasos.length <= 1) {
        return actuales;
      }

      return {
        ...actuales,
        pasos: actuales.pasos.filter((paso) => paso.id !== id),
      };
    });
  };
  return {
    datos,
    actualizarTexto,
    cambiarCategoria,
    cambiarSubcategoria,
    agregarIngrediente,
    quitarIngrediente,
    agregarPaso,
    actualizarPaso,
    quitarPaso,
    // imagen
    seleccionarImagen,
    quitarImagen,
    imagenSeleccionada,
    errorImagen,
  };
};

export default useFormularioCrear;
