import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { hexA } from "./QuestionCard";
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
          top: -240,
          left: -200,
          width: 880,
          height: 880,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${hexA(brand.colors.primary, 0.36)} 0%, transparent 68%)`,
        }}
      />

      <div style={{ opacity: enter, transform: `scale(${0.9 + enter * 0.1})` }}>
        <WispotMark size={86} withTagline />
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
        }}
      >
        Ficou com alguma dúvida?
      </h2>

      <p
        style={{
          margin: 0,
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.35,
          color: brand.colors.mist,
          opacity: line,
        }}
      >
        Comenta aqui embaixo ou manda mensagem.
        <br />A gente responde no próximo vídeo.
      </p>

      <div
        style={{
          marginTop: 12,
          padding: "22px 52px",
          borderRadius: 999,
          background: brand.colors.white,
          color: brand.colors.navy,
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
