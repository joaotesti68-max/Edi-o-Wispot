import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";

// Bottom-edge, square-cornered progress line in the brand accent color —
// deliberately opposite ProAdvanced's top, rounded, white-on-gray bars.
export const ProgressBar: React.FC<{
  blockRanges: { start: number; end: number }[];
  outroRange: { start: number; end: number };
}> = ({ blockRanges, outroRange }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [outroRange.start - 10, outroRange.start + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          gap: 3,
          opacity,
        }}
      >
        {blockRanges.map((range, i) => {
          const fill = interpolate(frame, [range.start, range.end], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 5,
                background: "rgba(79,163,224,0.22)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  background: brand.colors.accent,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
