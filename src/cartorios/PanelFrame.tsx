import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { scaleX, slideY } from "./motion";

/** Todo painel recebe a duração da sua sequência e se deve esmaecer no fim. */
export type PanelProps = { frames: number; fadeOut?: boolean };

const IN_FRAMES = 16;
const OUT_FRAMES = 7;

/**
 * Entrada e saída dos painéis: contida, sem deslizes largos.
 *
 * `fadeOut` fica falso quando o painel vai até o fim do bloco. Aí quem faz a
 * passagem é a transição entre blocos, e esmaecer aqui também acenderia o plano
 * gravado por baixo por uma fração de segundo antes dela — a piscada.
 */
export const usePanelReveal = (frames: number, fadeOut = true) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: IN_FRAMES });
  const exit = fadeOut
    ? interpolate(frame, [frames - OUT_FRAMES, frames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return { frame, enter, exit, opacity: enter * (1 - exit) };
};

/**
 * Revela um elemento a partir de um quadro dado, com deslocamento vertical.
 * É o gesto único usado por todos os itens dentro dos painéis, para o vídeo
 * inteiro ter a mesma cadência.
 */
export const useCue = (atFrame: number, shift = 22) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - atFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 13,
  });
  return {
    progress,
    style: { opacity: progress, ...slideY(interpolate(progress, [0, 1], [shift, 0])) },
  };
};

/**
 * Casca comum dos painéis de cobertura: fundo navy, malha técnica discreta,
 * cabeçalho com etiqueta e título, e o número da etapa em marca d'água.
 *
 * `backdrop` entra por cima do navy e por baixo de todo o resto — é onde vai
 * uma imagem em movimento quando o painel tem uma.
 */
export const PanelFrame: React.FC<{
  frames: number;
  eyebrow: string;
  title: React.ReactNode;
  watermark?: string;
  backdrop?: React.ReactNode;
  fadeOut?: boolean;
  children: React.ReactNode;
}> = ({ frames, eyebrow, title, watermark, backdrop, fadeOut, children }) => {
  const { enter, opacity } = usePanelReveal(frames, fadeOut);

  return (
    <AbsoluteFill style={{ opacity, fontFamily: theme.font }}>
      <AbsoluteFill style={{ background: theme.panelBackground }} />
      {backdrop}
      <AbsoluteFill style={{ background: theme.panelGlow }} />

      {/* Malha técnica: sugere planta/blueprint sem competir com o conteúdo. */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to right, ${theme.color.line} 0 1px, transparent 1px 92px),
             repeating-linear-gradient(to bottom, ${theme.color.line} 0 1px, transparent 1px 92px)`,
          opacity: 0.5,
          maskImage: "radial-gradient(115% 70% at 50% 34%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(115% 70% at 50% 34%, #000 0%, transparent 78%)",
        }}
      />

      {watermark ? (
        <div
          style={{
            position: "absolute",
            right: -34,
            bottom: 44,
            fontWeight: 800,
            fontSize: 460,
            lineHeight: 0.8,
            letterSpacing: -22,
            color: "rgba(255,255,255,0.045)",
          }}
        >
          {watermark}
        </div>
      ) : null}

      <div style={{ position: "absolute", top: 118, left: theme.gutter, right: theme.gutter }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 5,
              borderRadius: 3,
              background: theme.color.primaryLight,
              transformOrigin: "left center",
              ...scaleX(enter),
            }}
          />
          <div style={{ ...theme.type.eyebrow, color: theme.color.primaryLight }}>{eyebrow}</div>
        </div>

        <div style={{ ...theme.type.panelTitle, color: theme.color.white, marginTop: 26 }}>
          {title}
        </div>

        <div
          style={{
            marginTop: 40,
            height: 1,
            background: theme.color.lineStrong,
            transformOrigin: "left center",
            ...scaleX(enter),
          }}
        />
      </div>

      {children}
    </AbsoluteFill>
  );
};
