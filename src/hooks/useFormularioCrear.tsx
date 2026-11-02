import {
  DatosFormularioReceta,
  IngredienteFormulario,
  TextosReceta,
} from "@/types/formularioRecetas";
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
  const actualizarTexto = (campo: keyof TextosReceta, valor: string) => {
    setDatos((actuales) => ({
      ...actuales,
      [campo]: valor,
    }));
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
  };
};

export default useFormularioCrear;
