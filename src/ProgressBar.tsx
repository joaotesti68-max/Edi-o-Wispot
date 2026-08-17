import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { blockRanges, outroRange } from "./content";
import { brand } from "./brand";

export const ProgressBar: React.FC = () => {
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
          top: 28,
          left: 56,
          right: 56,
          display: "flex",
          gap: 8,
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
