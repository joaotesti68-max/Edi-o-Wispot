import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, horaPremiada } from "./brand";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const featureIn = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const ruleIn = spring({ frame: frame - 12, fps, config: { damping: 18 } });
  const wispotIn = spring({ frame: frame - 20, fps, config: { damping: 17 } });
  const ctaIn = spring({ frame: frame - 32, fps, config: { damping: 17 } });
  const siteIn = spring({ frame: frame - 44, fps, config: { damping: 17 } });

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

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <Img
          src={staticFile(horaPremiada.logo.white)}
          style={{
            width: 660,
            opacity: featureIn,
            transform: `scale(${interpolate(featureIn, [0, 1], [0.86, 1])})`,
          }}
        />

        <div
          style={{
            width: 220,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.45)",
            transform: `scaleX(${ruleIn})`,
          }}
        />

        <Img
          src={staticFile(brand.logo.white)}
          style={{
            width: 400,
            opacity: wispotIn,
            transform: `translateY(${interpolate(wispotIn, [0, 1], [16, 0])}px)`,
          }}
        />

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
