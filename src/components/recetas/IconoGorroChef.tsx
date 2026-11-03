import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

type Props = {
  // true: gorro marcado (naranja). false: gorro vacío (blanco).
  lleno?: boolean;
  // De 0 a 1: porción pintada de izquierda a derecha. Tiene prioridad sobre `lleno`.
  proporcion?: number;
  size?: number;
};

const COPA =
  "M29 74 C29 68 28 63 26 58 C4 62 6 20 32 24 A20 20 0 0 1 68 24 C94 20 96 62 74 58 C72 63 71 68 71 74 Z";
const BANDA = "M27 74 Q50 80 73 74 L72.5 83 Q50 90 27.5 83 Z";

function Gorro({ lleno }: { lleno: boolean }) {
  const colorCopa = lleno ? "#FF8A4C" : "#FFFFFF";
  const colorBanda = lleno ? "#FF4F0A" : "#ECE7E2";
  const colorContorno = lleno ? "#7A3B1E" : "#7A6E67";

  return (
    <>
      <Path
        d={COPA}
        fill={colorCopa}
        stroke={colorContorno}
        strokeWidth={3.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d={BANDA}
        fill={colorBanda}
        stroke={colorContorno}
        strokeWidth={3.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  );
}

export function IconoGorroChef({ lleno = false, proporcion, size = 44 }: Props) {
  const p = Math.min(Math.max(proporcion ?? (lleno ? 1 : 0), 0), 1);
  const parcial = p > 0 && p < 1;
  const idClip = `clip-gorro-${Math.round(p * 1000)}`;

  return (
    <Svg width={size} height={size} viewBox="2 2 96 96">
      {/* Base: vacío, salvo que esté completamente lleno */}
      <Gorro lleno={p === 1} />

      {/* Capa pintada, recortada según la proporción */}
      {parcial ? (
        <>
          <Defs>
            <ClipPath id={idClip}>
              <Rect x={2} y={2} width={96 * p} height={96} />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#${idClip})`}>
            <Gorro lleno />
          </G>
        </>
      ) : null}
    </Svg>
  );
}