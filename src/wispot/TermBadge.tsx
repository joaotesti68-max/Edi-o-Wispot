import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

// A feature-name chip in the product's own accent color, styled like a UI
// tag/tooltip rather than a marketing badge — reinforces "this is the name
// of a real screen in the product."
export const TermBadge: React.FC<{ text: string; appearFrame: number }> = ({ text, appearFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const in_ = spring({ frame: frame - appearFrame, fps, config: { damping: 13, mass: 0.6 } });
  const opacity = interpolate(frame, [appearFrame, appearFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(in_, [0, 1], [0.7, 1]);

  if (frame < appearFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 52,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: brand.colors.accent,
          boxShadow: `0 0 0 5px rgba(79,163,224,0.28)`,
        }}
      />
      <div
        style={{
          border: `1.5px solid ${brand.colors.accent}`,
          borderRadius: 8,
          padding: "10px 18px",
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 24,
          color: brand.colors.white,
          letterSpacing: 0.4,
          background: "rgba(13,20,32,0.55)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
