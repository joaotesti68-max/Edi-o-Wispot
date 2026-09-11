import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Layout } from "./content";
import { brand } from "./brand";

export const ProgressBar: React.FC<{
  ranges: Layout["ranges"];
  openingFrames: number;
}> = ({ ranges, openingFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [openingFrames, openingFrames + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 76,
          right: 76,
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
                flex: range.end - range.start,
                height: 5,
                borderRadius: 3,
                background: "rgba(255,255,255,0.26)",
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
      <div
        style={{
          position: "absolute",
          bottom: 22,
          right: 76,
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: 1.6,
          color: "rgba(255,255,255,0.5)",
          opacity,
        }}
      >
        {brand.site}
      </div>
    </AbsoluteFill>
  );
};
