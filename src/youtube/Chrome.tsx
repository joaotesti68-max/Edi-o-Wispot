import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../loadFont";
import { endCardStart, segmentRanges } from "./content";
import { yt } from "./theme";

/** Progress segments and the channel handle, on screen for the whole piece. */
export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [endCardStart - 12, endCardStart + 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <div style={{ position: "absolute", top: 30, left: 52, right: 52, display: "flex", gap: 8 }}>
        {segmentRanges.map((range, i) => {
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
                background: "rgba(255,255,255,0.3)",
                overflow: "hidden",
              }}
            >
              <div style={{ width: `${fill * 100}%`, height: "100%", background: yt.colors.white, borderRadius: 3 }} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 62,
          left: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(5,13,22,0.5)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 999,
          padding: "10px 22px 10px 14px",
        }}
      >
        <div
          style={{
            width: 30,
            height: 21,
            borderRadius: 7,
            background: yt.colors.play,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 2,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: `8px solid ${yt.colors.white}`,
            }}
          />
        </div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 26, color: yt.colors.white, letterSpacing: -0.2 }}>
          {yt.handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
