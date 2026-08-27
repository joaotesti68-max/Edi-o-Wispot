import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 15, mass: 0.7 } });
  const ctaIn = spring({ frame: frame - 14, fps, config: { damping: 16 } });
  const subIn = spring({ frame: frame - 24, fps, config: { damping: 16 } });
  const siteIn = spring({ frame: frame - 34, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill
      style={{ background: brand.gradient, alignItems: "center", justifyContent: "center" }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
        <Img
          src={staticFile(brand.logo.white)}
          style={{
            width: 560,
            opacity: interpolate(logoIn, [0, 1], [0, 1]),
            transform: `scale(${interpolate(logoIn, [0, 1], [0.82, 1])})`,
          }}
        />

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 54,
            color: brand.colors.white,
            textAlign: "center",
            lineHeight: 1.12,
            opacity: interpolate(ctaIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(ctaIn, [0, 1], [18, 0])}px)`,
          }}
        >
          Agende seu diagnóstico
        </div>

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 32,
            color: brand.colors.white,
            opacity: interpolate(subIn, [0, 1], [0, 0.9]),
            transform: `translateY(${interpolate(subIn, [0, 1], [14, 0])}px)`,
          }}
        >
          antes que o prazo feche
        </div>

        <div
          style={{
            opacity: interpolate(siteIn, [0, 1], [0, 1]),
            transform: `scale(${interpolate(siteIn, [0, 1], [0.94, 1])})`,
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 32,
            color: brand.colors.ink,
            background: brand.colors.white,
            borderRadius: 999,
            padding: "16px 40px",
          }}
        >
          {brand.site}
        </div>
      </div>
    </AbsoluteFill>
  );
};
