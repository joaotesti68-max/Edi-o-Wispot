import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";
import type { SpeechCaption as CaptionData } from "./captions";

const IN_FRAMES = 4;
const OUT_FRAMES = 5;

/**
 * Legenda da narração, na base da tela.
 *
 * Uma legenda entra no quadro em que a anterior sai, então a troca é seca: só
 * uma abertura curta, sem deslocamento longo, que a esse ritmo cansaria a
 * leitura. O esmaecimento de saída fica reservado para a última legenda de cada
 * bloco, onde de fato existe silêncio depois.
 */
export const SpeechCaption: React.FC<{
  caption: CaptionData;
  frames: number;
  isLast: boolean;
}> = ({ caption, frames, isLast }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, IN_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = isLast
    ? interpolate(frame, [frames - OUT_FRAMES, frames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: theme.gutter,
        right: theme.gutter,
        // Acima dos ~260 px que Reels, Shorts e TikTok cobrem com a própria
        // interface, para a legenda não ficar atrás dos botões do app.
        bottom: 260,
        opacity: enter * exit,
        transform: `translateY(${interpolate(enter, [0, 1], [8, 0])}px)`,
        fontFamily: theme.font,
      }}
    >
      {caption.lines.map((line) => (
        <div
          key={line}
          style={{
            fontWeight: 700,
            fontSize: 50,
            lineHeight: 1.24,
            letterSpacing: -0.4,
            color: theme.color.white,
            textShadow: "0 4px 22px rgba(0,0,0,0.62)",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
