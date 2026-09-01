import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";

type Range = { start: number; end: number };

export const ProgressBar: React.FC<{ ranges: Range[]; outroStart: number }> = ({
  ranges,
  outroStart,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [outroStart - 10, outroStart + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 56,
          right: 56,
          display: "flex",
          gap: 8,
          opacity,
        }}
      >
        {ranges.map((range, i) => {
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
                borderRadius: 3,
                background: "rgba(255,255,255,0.32)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  background: brand.colors.white,
                  borderRadius: 3,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
