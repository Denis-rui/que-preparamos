import {
  DatosFormularioReceta,
  IngredienteFormulario,
  TextosReceta,
} from "@/types/formularioRecetas";
import { useState } from "react";

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
  });

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

  return {
    datos,
    actualizarTexto,
    cambiarCategoria,
    cambiarSubcategoria,
    agregarIngrediente,
    quitarIngrediente,
  };
};

export default useFormularioCrear;
