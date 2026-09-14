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

  const logoIn = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const nameIn = spring({ frame: frame - 14, fps, config: { damping: 17 } });
  const ctaIn = spring({ frame: frame - 26, fps, config: { damping: 17 } });
  const siteIn = spring({ frame: frame - 38, fps, config: { damping: 17 } });

  return (
    <AbsoluteFill
      style={{ background: brand.gradient, alignItems: "center", justifyContent: "center" }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 36%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 52 }}>
        <Img
          src={staticFile(brand.logo.white)}
          style={{
            width: 640,
            opacity: logoIn,
            transform: `scale(${interpolate(logoIn, [0, 1], [0.84, 1])})`,
          }}
        />

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: -1,
            color: brand.colors.white,
            opacity: nameIn,
            transform: `translateY(${interpolate(nameIn, [0, 1], [18, 0])}px)`,
          }}
        >
          Hora Premiada
        </div>

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 600,
            fontSize: 38,
            color: "rgba(255,255,255,0.92)",
            textAlign: "center",
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [16, 0])}px)`,
          }}
        >
          Fale com a gente
        </div>

        <div
          style={{
            marginTop: 8,
            padding: "18px 46px",
            borderRadius: 999,
            background: brand.colors.white,
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 36,
            color: brand.colors.blue,
            opacity: siteIn,
            transform: `scale(${interpolate(siteIn, [0, 1], [0.93, 1])})`,
          }}
        >
          {brand.site}
        </div>
      </div>
    </AbsoluteFill>
  );
};
