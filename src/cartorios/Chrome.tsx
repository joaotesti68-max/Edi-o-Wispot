import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../shared/brand";
import { theme } from "./theme";
import { endcardStart, totalFrames } from "./content";

/**
 * Camada fixa sobre tudo: um filete de progresso no topo e o ícone da marca.
 * A barra é contínua, e não segmentada, para não puxar o vídeo para um ar de
 * rede social — o tom aqui é institucional.
 */
export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, endcardStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [endcardStart - 14, endcardStart], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "rgba(255,255,255,0.18)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: theme.color.primaryLight,
          }}
        />
      </div>

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{ position: "absolute", top: 108, right: theme.gutter, width: 62, opacity: 0.92 }}
      />
    </AbsoluteFill>
  );
};

/**
 * Volume da trilha. Os planos de fala estão normalizados em -18 LUFS e a trilha
 * mede -13,5 LUFS em ganho unitário; 0,15 põe o leito uns 12 LU abaixo da voz,
 * que é onde a música sustenta sem disputar com a narração. No cartão final não
 * há voz, então a trilha sobe e termina em fade.
 */
export const musicVolume = (frame: number) => {
  const bed = interpolate(
    frame,
    [0, 26, endcardStart - 10, endcardStart + 20],
    [0, 0.15, 0.15, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const tail = interpolate(frame, [totalFrames - 30, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return bed * tail;
};
