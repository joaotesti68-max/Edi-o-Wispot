import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { scaleY, slideX } from "./motion";

const IN_FRAMES = 14;
const OUT_FRAMES = 8;

/**
 * Identificação de quem fala, no canto superior esquerdo da abertura. Fica
 * alinhada com o ícone da marca no canto oposto e sai antes do primeiro painel
 * entrar, para não disputar espaço com o cabeçalho dele.
 */
export const NameCard: React.FC<{ name: string; frames: number }> = ({ name, frames }) => {
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
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 30px 16px 22px",
        borderRadius: 14,
        background: "rgba(7,18,26,0.58)",
        border: `1px solid ${theme.color.line}`,
        opacity: enter * (1 - exit),
        ...slideX(interpolate(enter, [0, 1], [-22, 0])),
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          width: 5,
          height: 34,
          borderRadius: 3,
          background: theme.color.primaryLight,
          transformOrigin: "center",
          ...scaleY(enter),
        }}
      />
      <div
        style={{
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: -0.3,
          color: theme.color.white,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
    </div>
  );
};
