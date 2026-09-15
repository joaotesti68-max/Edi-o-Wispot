import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../loadFont";
import { yt } from "./theme";

/** Placeholder rows standing in for videos on the channel. */
const ROWS = [
  { duration: "2:04", thumb: "linear-gradient(140deg, #0f3350 0%, #1aa0e0 100%)" },
  { duration: "2:17", thumb: "linear-gradient(140deg, #123f63 0%, #5ec4f0 100%)" },
  { duration: "2:09", thumb: "linear-gradient(140deg, #0b2840 0%, #1580b8 100%)" },
];

const Row: React.FC<{ row: (typeof ROWS)[number]; progress: number }> = ({ row, progress }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: 18,
        borderRadius: 24,
        background: "rgba(8,17,28,0.62)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 20px 44px rgba(0,0,0,0.34)",
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [180, 0])}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 268,
          height: 151,
          borderRadius: 16,
          background: row.thumb,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            marginLeft: 5,
            borderTop: "16px solid transparent",
            borderBottom: "16px solid transparent",
            borderLeft: "26px solid rgba(255,255,255,0.94)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            background: "rgba(0,0,0,0.78)",
            borderRadius: 6,
            padding: "5px 11px",
            fontFamily,
            fontWeight: 700,
            fontSize: 24,
            color: yt.colors.white,
          }}
        >
          {row.duration}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ width: "92%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.82)" }} />
        <div style={{ width: "68%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.58)" }} />
        <div style={{ width: "40%", height: 12, borderRadius: 6, background: "rgba(94,196,240,0.75)", marginTop: 4 }} />
      </div>
    </div>
  );
};

export const VideoCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const out = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 172,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {ROWS.map((row, i) => (
          <Row
            key={row.duration}
            row={row}
            progress={spring({ frame: frame - i * 7, fps, config: { damping: 15, mass: 0.7 } })}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
