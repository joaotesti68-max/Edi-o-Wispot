import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { episode } from "./content";
import { Wordmark } from "./Wordmark";

export const OpeningCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const titleIn = spring({ frame: frame - 8, fps, config: { damping: 18, mass: 0.8 } });
  const ruleIn = spring({ frame: frame - 14, fps, config: { damping: 20, mass: 0.9 } });

  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: brand.gradient, opacity: out }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          padding: "0 160px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: logoIn,
            transform: `translateY(${interpolate(logoIn, [0, 1], [18, 0])}px)`,
          }}
        >
          <Wordmark height={150} variant="white" />
        </div>

        <div
          style={{
            width: interpolate(ruleIn, [0, 1], [0, 120]),
            height: 5,
            borderRadius: 3,
            background: "rgba(255,255,255,0.85)",
          }}
        />

        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [22, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 4.5,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {episode.series} · #{episode.number}
          </div>
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1.14,
              letterSpacing: -1,
              color: brand.colors.white,
              maxWidth: 1280,
            }}
          >
            {episode.title}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
