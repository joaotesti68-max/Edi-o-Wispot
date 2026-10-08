import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { WifiIcon } from "./WispotMark";
import type { QuestionCard as QuestionCardData } from "./content";

/**
 * Card que assume a pergunta feita fora de quadro. Fica no ar tempo suficiente
 * para ler antes de cortar para a resposta.
 *
 * Fundo no degradê institucional; o manual deixa o fundo livre desde que
 * priorize as cores da marca e preserve o contraste — daí o texto em branco no
 * corpo mais fechado do degradê e a tarja da pergunta em branco sólido.
 */
export const QuestionCard: React.FC<{ data: QuestionCardData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconIn = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: brand.gradient,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 96px",
      }}
    >
      <Depth />

      <div
        style={{
          position: "relative",
          transform: `translateY(${(1 - enter) * 48 - exit * 40}px)`,
          opacity: Math.min(enter, 1 - exit),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 34px 14px 22px",
            borderRadius: 999,
            background: brand.colors.white,
          }}
        >
          <div style={{ opacity: iconIn, transform: `scale(${0.7 + iconIn * 0.3})` }}>
            <WifiIcon height={44} variant="color" />
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: brand.colors.blueDeep,
              letterSpacing: 3,
            }}
          >
            PERGUNTA {data.index}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: data.question.length > 44 ? 90 : 104,
            lineHeight: 1.12,
            fontWeight: 800,
            color: brand.colors.white,
            letterSpacing: -2,
            textWrap: "balance",
            textShadow: "0 4px 28px rgba(0,0,0,0.28)",
          }}
        >
          {data.question}
        </h1>

        <div
          style={{
            width: interpolate(frame, [8, 34], [0, 220], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 8,
            borderRadius: 999,
            background: brand.colors.white,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Fecha os cantos para o branco do texto não competir com o azul aberto. */
const Depth: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 45%, transparent 30%, ${brand.alpha(brand.colors.gray, 0.34)} 100%)`,
      }}
    />
  </AbsoluteFill>
);
