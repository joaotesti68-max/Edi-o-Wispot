import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../shared/brand";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 15, mass: 0.7 } });
  const logoScale = interpolate(logoIn, [0, 1], [0.82, 1]);
  const logoOpacity = interpolate(logoIn, [0, 1], [0, 1]);

  const ctaIn = spring({ frame: frame - 16, fps, config: { damping: 16 } });
  const ctaOpacity = interpolate(ctaIn, [0, 1], [0, 1]);
  const ctaShift = interpolate(ctaIn, [0, 1], [16, 0]);

  const siteIn = spring({ frame: frame - 28, fps, config: { damping: 16 } });
  const siteOpacity = interpolate(siteIn, [0, 1], [0, 1]);
  const siteScale = interpolate(siteIn, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill style={{ background: brand.gradient, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <Img
          src={staticFile(brand.logo.white)}
          style={{
            width: 560,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        />

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 46,
            color: brand.colors.white,
            textAlign: "center",
            opacity: ctaOpacity,
            transform: `translateY(${ctaShift}px)`,
          }}
        >
          Fale com a gente agora
        </div>

        <div
          style={{
            opacity: siteOpacity,
            transform: `scale(${siteScale})`,
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
