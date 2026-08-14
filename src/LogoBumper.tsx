import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

export const LogoBumper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const iconRotate = interpolate(frame, [0, 24], [-25, 0], { extrapolateRight: "clamp" });
  const wordmarkOpacity = interpolate(frame, [8, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordmarkShift = interpolate(frame, [8, 16], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: brand.gradient, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <Img
          src={staticFile(brand.logo.iconWhite)}
          style={{
            width: 220,
            transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
          }}
        />
        <Img
          src={staticFile(brand.logo.white)}
          style={{
            width: 520,
            opacity: wordmarkOpacity,
            transform: `translateY(${wordmarkShift}px)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
