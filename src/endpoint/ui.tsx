import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sfx } from "./Overlays";
import { pa } from "./theme";

// 0→1 between two frames, clamped.
export const ramp = (frame: number, a: number, b: number, ease = true) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.inOut(Easing.cubic) : undefined,
  });

export const CARD_W = 960;
export const CARD_H = 560;

// The white stage the camera-scene animations play on, over the chest.
export const StageCard: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
  background?: string;
}> = ({ start, end, children, background = pa.white }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame >= end) return null;
  const enter = spring({ frame: frame - start, fps, config: { damping: 15 } });
  const exit = ramp(frame, end - 8, end);
  return (
    <div
      style={{
        position: "absolute",
        top: 1040,
        left: 60,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 44,
        background,
        overflow: "hidden",
        fontFamily: pa.font,
        boxShadow: "0 30px 70px rgba(28,63,87,0.4)",
        transform: `translateY(${interpolate(enter, [0, 1], [160, 0]) + exit * 160}px) scale(${1 - exit * 0.1})`,
        opacity: enter * (1 - exit),
      }}
    >
      <Sfx at={start} src="audio/sfx/whoosh.wav" volume={0.22} />
      {children}
    </div>
  );
};

type CursorKey = { at: number; x: number; y: number; click?: boolean };

// Mouse pointer gliding between keyframes, with a ripple on each click.
export const Cursor: React.FC<{ keys: CursorKey[]; size?: number }> = ({ keys, size = 64 }) => {
  const frame = useCurrentFrame();
  if (frame < keys[0].at) return null;
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const t = ramp(frame, keys[i - 1].at, keys[i].at);
    if (frame >= keys[i - 1].at) {
      x = interpolate(t, [0, 1], [keys[i - 1].x, keys[i].x]);
      y = interpolate(t, [0, 1], [keys[i - 1].y, keys[i].y]);
    }
  }
  const clicks = keys.filter((k) => k.click);
  const last = clicks.filter((k) => frame >= k.at).pop();
  const since = last ? frame - last.at : 99;
  const press = since < 6 ? 0.82 : 1;
  return (
    <>
      {clicks.map((k) => (
        <Sfx key={k.at} at={k.at} volume={0.28} />
      ))}
      {since < 16 ? (
        <div
          style={{
            position: "absolute",
            left: x - 50,
            top: y - 50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `5px solid ${pa.blue}`,
            transform: `scale(${0.3 + since / 10})`,
            opacity: 1 - since / 16,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - size * 0.18,
          top: y - size * 0.08,
          transform: `scale(${press})`,
          transformOrigin: "18% 8%",
          filter: "drop-shadow(0 6px 10px rgba(28,63,87,0.35))",
        }}
      >
        <path
          d="M4.5 2.5v17l4.6-4.2 3 6.6 3-1.4-3-6.4h6.4Z"
          fill={pa.deep}
          stroke={pa.white}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

// App window chrome: blue title bar with the Pro Advanced mark.
export const WindowBar: React.FC<{ title: string; height?: number }> = ({
  title,
  height = 84,
}) => (
  <div
    style={{
      height,
      background: pa.grad,
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "0 30px",
      color: pa.white,
      fontFamily: pa.font,
      fontWeight: 800,
      fontSize: 30,
      flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
          }}
        />
      ))}
    </div>
    <span style={{ flex: 1, marginLeft: 8 }}>{title}</span>
    <Img src={staticFile(pa.iconWhite)} style={{ height: height * 0.62 }} />
  </div>
);

// Thin road lines on a tinted ground, the base for the map scenes.
export const MapGround: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
    <rect width={width} height={height} fill={pa.tint} />
    {[0.18, 0.46, 0.78].map((r) => (
      <line
        key={`h${r}`}
        x1={0}
        y1={height * r}
        x2={width}
        y2={height * r + 40}
        stroke={pa.white}
        strokeWidth={22}
      />
    ))}
    {[0.12, 0.38, 0.64, 0.88].map((r) => (
      <line
        key={`v${r}`}
        x1={width * r}
        y1={0}
        x2={width * r - 50}
        y2={height}
        stroke={pa.white}
        strokeWidth={16}
      />
    ))}
    <path
      d={`M0 ${height * 0.62} C ${width * 0.3} ${height * 0.5}, ${width * 0.6} ${height * 0.95}, ${width} ${height * 0.7}`}
      stroke="rgba(54,150,205,0.18)"
      strokeWidth={40}
      fill="none"
    />
  </svg>
);
