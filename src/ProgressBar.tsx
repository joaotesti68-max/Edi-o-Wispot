import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { outroRange, segmentRanges } from "./content";
import { brand } from "./brand";
import { hexA } from "./QuestionCard";

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
          top: 40,
          left: 56,
          right: 56,
          display: "flex",
          gap: 8,
          opacity,
        }}
      >
        {segmentRanges.map((range, i) => {
          const fill = interpolate(frame, [range.start, range.end], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                // Weighted so a long answer reads as a longer chapter than a card.
                flex: range.end - range.start,
                height: 6,
                borderRadius: 3,
                background: hexA(brand.colors.white, 0.3),
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  background: brand.colors.accent,
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
