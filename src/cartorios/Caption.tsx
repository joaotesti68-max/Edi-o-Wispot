import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import type { Caption as CaptionData } from "./content";

const IN_FRAMES = 14;
const OUT_FRAMES = 8;

/**
 * Lower third do vídeo: um filete azul, a etiqueta em caixa alta e a frase.
 * Entra por baixo e some rápido, sempre dentro da janela de fala a que
 * pertence.
 */
export const Caption: React.FC<{ caption: CaptionData; frames: number }> = ({
  caption,
  frames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: IN_FRAMES });
  const exit = interpolate(frame, [frames - OUT_FRAMES, frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enter * (1 - exit);
  const shift = interpolate(enter, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: theme.gutter,
        right: theme.gutter,
        bottom: 150,
        opacity,
        transform: `translateY(${shift}px)`,
        fontFamily: theme.font,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
        <div
          style={{
            width: interpolate(enter, [0, 1], [0, 56]),
            height: 5,
            borderRadius: 3,
            background: theme.color.primaryLight,
          }}
        />
        <div style={{ ...theme.type.eyebrow, color: theme.color.primaryLight }}>
          {caption.eyebrow}
        </div>
      </div>

      <div
        style={{
          ...theme.type.headline,
          color: theme.color.white,
          whiteSpace: "pre-line",
          textShadow: "0 6px 30px rgba(0,0,0,0.45)",
        }}
      >
        {caption.text}
      </div>
    </div>
  );
};
