import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { WispotMark } from "./WispotMark";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const line = spring({ frame: frame - 12, fps, config: { damping: 200, mass: 0.7 } });

  return (
    <AbsoluteFill
      style={{
        background: brand.gradient,
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        padding: "0 110px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 42%, transparent 32%, ${brand.alpha(brand.colors.gray, 0.32)} 100%)`,
        }}
      />

      <div style={{ opacity: enter, transform: `scale(${0.9 + enter * 0.1})` }}>
        <WispotMark height={188} variant="white" />
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 78,
          lineHeight: 1.18,
          fontWeight: 800,
          color: brand.colors.white,
          letterSpacing: -1.5,
          opacity: line,
          transform: `translateY(${(1 - line) * 26}px)`,
          textWrap: "balance",
          textShadow: "0 4px 28px rgba(0,0,0,0.26)",
        }}
      >
        A série continua em setembro.
      </h2>

      <p
        style={{
          margin: 0,
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.35,
          color: brand.colors.white,
          opacity: line * 0.92,
        }}
      >
        Segue a Wispot e manda a sua dúvida.
        <br />A gente responde no próximo vídeo.
      </p>

      <div
        style={{
          marginTop: 12,
          padding: "22px 52px",
          borderRadius: 999,
          background: brand.colors.white,
          color: brand.colors.blueDeep,
          fontSize: 40,
          fontWeight: 800,
          opacity: line,
          transform: `translateY(${(1 - line) * 20}px)`,
        }}
      >
        {brand.site}
      </div>
    </AbsoluteFill>
  );
};
