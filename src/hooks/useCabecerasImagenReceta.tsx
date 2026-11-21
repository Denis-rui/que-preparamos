import { CLAVE_SESION } from "@/config/cliente-query";
import { obtenerToken } from "@/storage/token";
import { Perfil } from "@/types/perfil";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useCabecerasImagenReceta = (usuarioId: number) => {
  const cliente = useQueryClient();
  const [cabecerasImagen, setCabecerasImagen] = useState<Record<
    string,
    string
  > | null>(null);

  const [errorCabeceraImagen, setErrorCabeceraImagen] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let vigente = true;
    setCabecerasImagen(null);
    setErrorCabeceraImagen(null);

    async function prepararCabeceras() {
      try {
        const token = await obtenerToken();
        if (!vigente) return;

        const perfil = cliente.getQueryData<Perfil | null>(CLAVE_SESION);
        if (!token || perfil?.id !== usuarioId) {
          throw new Error("La sesión cambió.");
        }
        setCabecerasImagen({ Authorization: `Bearer ${token}` });
      } catch (error) {
        if (vigente) {
          setErrorCabeceraImagen(
            "No pudimos preparar el acceso a las imágenes.",
          );
        }
      }
    }
    void prepararCabeceras();

    return () => {
      vigente = false;
    };
  }, [cliente, usuarioId]);

  return { cabecerasImagen, errorCabeceraImagen };
};

export default useCabecerasImagenReceta;
