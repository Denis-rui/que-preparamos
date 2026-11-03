import type { DatosFormularioReceta } from "@/types/formularioRecetas";

export function validarReceta(datos: DatosFormularioReceta): string | null {
  const nombre = datos.nombre.trim();
  const descripcion = datos.descripcion.trim();

  if (!nombre) {
    return "Escribe un nombre.";
  }

  if (nombre.length > 150) {
    return "nombre demasiado largo";
  }

  if (!descripcion) {
    return "Escribe una descripción";
  }
  if (descripcion.length > 16000) {
    return "Descripción demasiado larga";
  }

  const enteroValido = (texto: string) =>
    /^\d+$/.test(texto.trim()) && Number(texto) >= 1 && Number(texto) <= 65535;

  if (!enteroValido(datos.porciones)) {
    return "Las porciones deben ser un entero";
  }

  if (!enteroValido(datos.tiempoPreparacion)) {
    return "El tiempo debe ser un numero entero (minutos)";
  }

  if (datos.tips.trim().length > 16000) {
    return "Tip demasiado largo";
  }

  const identificadorValido = (id: number | null) =>
    id !== null && Number.isSafeInteger(id) && id > 0;

  if (!identificadorValido(datos.categoriaId)) {
    return "Selecciona una categoría.";
  }

  if (!identificadorValido(datos.subcategoriaId)) {
    return "Selecciona una subcategoría.";
  }

  // La imagen decorativa del recuadro no cuenta como foto seleccionada.
  if (!datos.imagen?.uri) {
    return "Selecciona una imagen.";
  }

  const tamano = datos.imagen.fileSize ?? datos.imagen.file?.size;

  if (tamano !== undefined && tamano > 10 * 1024 * 1024) {
    return "La imagen no debe superar los 10 MB.";
  }

  if (datos.ingredientes.length < 1 || datos.ingredientes.length > 500) {
    return "Agrega entre 1 y 500 ingredientes.";
  }

  const identificadores = new Set<number>();

  for (const [indice, ingrediente] of datos.ingredientes.entries()) {
    if (
      !identificadorValido(ingrediente.id) ||
      identificadores.has(ingrediente.id)
    ) {
      return "Selecciona ingredientes sin repetirlos.";
    }

    identificadores.add(ingrediente.id);

    const cantidad = ingrediente.cantidad.trim().replace(",", ".");
    const notas = ingrediente.notas.trim();

    // Esta es la regla que confirmaste para tu formulario.
    if (!cantidad && !notas) {
      return `El ingrediente ${indice + 1} necesita cantidad o una nota.`;
    }

    if (
      cantidad !== "" &&
      (!/^(?:\d+(?:\.\d{0,3})?|\.\d{1,3})$/.test(cantidad) ||
        Number(cantidad) <= 0 ||
        Number(cantidad) > 9999999.999)
    ) {
      return `Revisa la cantidad del ingrediente ${indice + 1}: debe ser positiva, tener hasta tres decimales y no superar 9999999.999.`;
    }

    if (ingrediente.unidad.trim().length > 50 || notas.length > 16000) {
      return `Revisa la unidad o las notas del ingrediente ${indice + 1}.`;
    }
  }

  if (datos.pasos.length < 1 || datos.pasos.length > 500) {
    return "Agrega entre 1 y 500 pasos de preparación.";
  }

  for (const [indice, paso] of datos.pasos.entries()) {
    const instruccion = paso.instruccion.trim();

    if (!instruccion || instruccion.length > 16000) {
      return `Escribe el paso ${indice + 1} con hasta 16000 caracteres, o quítalo si no lo necesitas.`;
    }
  }
  return null;
}
