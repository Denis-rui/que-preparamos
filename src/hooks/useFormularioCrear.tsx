import { DatosFormularioReceta, TextosReceta } from "@/types/formularioRecetas";
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

  return {
    datos,
    actualizarTexto,
    cambiarCategoria,
    cambiarSubcategoria,
  };
};

export default useFormularioCrear;
