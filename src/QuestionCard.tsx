import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { WifiArcs } from "./WispotMark";
import type { QuestionCard as QuestionCardData } from "./content";

/**
 * Full-frame card that stands in for the question João asked off-camera. It
 * holds long enough to read before cutting to Mari's answer.
 */
export const QuestionCard: React.FC<{ data: QuestionCardData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arcProgress = interpolate(frame, [4, 26], [0, 1], {
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
      <Glow />

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
            gap: 20,
            padding: "16px 34px 16px 24px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
            border: `2px solid ${hexA(brand.colors.primaryLight, 0.45)}`,
          }}
        >
          <WifiArcs size={54} color={brand.colors.primaryLight} progress={arcProgress} />
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: brand.colors.primaryLight,
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
            background: brand.colors.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Glow: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        top: -260,
        right: -220,
        width: 900,
        height: 900,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hexA(brand.colors.primary, 0.4)} 0%, transparent 68%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -320,
        left: -260,
        width: 940,
        height: 940,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hexA(brand.colors.accent, 0.2)} 0%, transparent 66%)`,
      }}
    />
  </AbsoluteFill>
);

export const hexA = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
