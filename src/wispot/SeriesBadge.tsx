import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

// A vertical side-tab, distinct from a top pill badge — keeps series
// identity visible without competing with the caption zone at the bottom.
export const SeriesBadge: React.FC<{
  seriesLabel: string;
  episodeNumber: number;
}> = ({ seriesLabel, episodeNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const in_ = spring({ frame: frame - 6, fps, config: { damping: 15, mass: 0.6 } });
  const opacity = interpolate(in_, [0, 1], [0, 1]);
  const shift = interpolate(in_, [0, 1], [-16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 0,
        opacity,
        transform: `translateX(${shift}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: brand.colors.blue,
        borderRadius: "0 8px 8px 0",
        padding: "10px 18px 10px 14px",
      }}
    >
      <span
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 15,
          color: brand.colors.white,
        }}
      >
        EP.{String(episodeNumber).padStart(2, "0")}
      </span>
      <span style={{ width: 3, height: 3, borderRadius: "50%", background: brand.colors.white, opacity: 0.6 }} />
      <span
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 15,
          color: brand.colors.white,
          letterSpacing: 0.6,
          textTransform: "uppercase",
        }}
      >
        {seriesLabel}
      </span>
    </div>
  );
};
