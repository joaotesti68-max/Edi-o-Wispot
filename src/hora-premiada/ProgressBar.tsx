import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { chapterRanges, outroRange } from "./content";
import { brand } from "./brand";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [outroRange.start - 12, outroRange.start + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 64,
          right: 64,
          display: "flex",
          gap: 10,
          opacity: Math.min(fadeIn, fadeOut),
        }}
      >
        {chapterRanges.map((range, i) => {
          const fill = interpolate(frame, [range.start, range.end], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 7,
                borderRadius: 999,
                background: "rgba(255,255,255,0.38)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: brand.gradient,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
