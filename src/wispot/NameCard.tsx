import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

// Identity card — rises into the center of the frame briefly whenever
// Vanessa is on camera, then fades so it doesn't compete with captions.
export const NameCard: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const in_ = spring({ frame: frame - 14, fps, config: { damping: 16, mass: 0.7 } });
  const shift = interpolate(in_, [0, 1], [36, 0]);
  const scale = interpolate(in_, [0, 1], [0.92, 1]);
  const opacity = interpolate(frame, [14, 26, 96, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: "50%",
        opacity,
        transform: `translateX(-50%) translateY(${shift}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: "rgba(13,20,32,0.62)",
        borderRadius: 20,
        padding: "22px 40px",
      }}
    >
      <div style={{ width: 44, height: 4, background: brand.colors.blue, borderRadius: 2 }} />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 38,
          color: brand.colors.white,
          letterSpacing: -0.3,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 600,
          fontSize: 24,
          color: brand.colors.white,
          opacity: 0.8,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {role}
      </div>
    </div>
  );
};
