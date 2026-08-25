import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { scaleX, slideX } from "./motion";
import type { Caption as CaptionData } from "./content";

const IN_FRAMES = 14;
const OUT_FRAMES = 8;

/**
 * Tarja editorial: nomeia o assunto do trecho.
 *
 * Fica no alto, à esquerda, na mesma linguagem do selo de nome — a base da tela
 * é da legenda da narração. Entra só onde acrescenta alguma coisa que a legenda
 * não diz.
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

  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: theme.gutter,
        maxWidth: 780,
        padding: "18px 32px 20px 22px",
        borderRadius: 14,
        background: "rgba(7,18,26,0.58)",
        border: `1px solid ${theme.color.line}`,
        opacity: enter * (1 - exit),
        ...slideX(interpolate(enter, [0, 1], [-22, 0])),
        fontFamily: theme.font,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <div
          style={{
            width: 34,
            height: 4,
            borderRadius: 2,
            background: theme.color.primaryLight,
            transformOrigin: "left center",
            ...scaleX(enter),
          }}
        />
        <div
          style={{
            ...theme.type.eyebrow,
            fontSize: 22,
            letterSpacing: 2.8,
            color: theme.color.primaryLight,
          }}
        >
          {caption.eyebrow}
        </div>
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 42,
          lineHeight: 1.14,
          letterSpacing: -0.4,
          color: theme.color.white,
          whiteSpace: "pre-line",
        }}
      >
        {caption.text}
      </div>
    </div>
  );
};
