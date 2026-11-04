import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";

type Continuar = () => void;
type ComprobarSalida = (continuar: Continuar) => void;

interface ProtectorSalidaContexto {
  registrar: (comprobar: ComprobarSalida) => () => void;
  solicitarSalida: (continuar: Continuar) => void;
}

const Contexto = createContext<ProtectorSalidaContexto | null>(null);

export function ProtectorSalidaProvider({ children }: PropsWithChildren) {
  const comprobacion = useRef<ComprobarSalida | null>(null);

  const valor = useMemo<ProtectorSalidaContexto>(
    () => ({
      registrar(comprobar) {
        comprobacion.current = comprobar;

        return () => {
          if (comprobacion.current === comprobar) {
            comprobacion.current = null;
          }
        };
      },

      solicitarSalida(continuar) {
        if (comprobacion.current) {
          comprobacion.current(continuar);
        } else {
          continuar();
        }
      },
    }),
    [],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useProtectorSalida() {
  const contexto = useContext(Contexto);

  if (!contexto) {
    throw new Error("Falta ProtectorSalidaProvider alrededor de las pestañas.");
  }

  return contexto;
}
