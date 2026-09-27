import { Path, Svg } from "react-native-svg";

type Props = {
  size?: number;
};

export function IconoCanastaVacia({ size = 64 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Cuerpo de la canasta */}
      <Path
        d="M20 55 L25 85 Q25 90 30 90 L70 90 Q75 90 75 85 L80 55 Z"
        fill="#E8A854"
      />
      <Path
        d="M20 55 L25 85 Q25 90 30 90 L70 90 Q75 90 75 85 L80 55 Z"
        fill="none"
        stroke="#B87A3D"
        strokeWidth="1.5"
      />

      {/* Borde superior de la canasta */}
      <Path
        d="M18 55 L82 55"
        stroke="#B87A3D"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Líneas del tejido */}
      <Path d="M28 60 L32 88" stroke="#B87A3D" strokeWidth="1.5" />
      <Path d="M40 58 L42 90" stroke="#B87A3D" strokeWidth="1.5" />
      <Path d="M50 58 L50 90" stroke="#B87A3D" strokeWidth="1.5" />
      <Path d="M60 58 L58 90" stroke="#B87A3D" strokeWidth="1.5" />
      <Path d="M72 60 L68 88" stroke="#B87A3D" strokeWidth="1.5" />

      {/* Asa */}
      <Path
        d="M35 55 Q35 30 50 30 Q65 30 65 55"
        fill="none"
        stroke="#B87A3D"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>
  );
}