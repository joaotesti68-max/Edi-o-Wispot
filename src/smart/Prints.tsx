import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Icon, type IconKind, clamp, pa, usePop } from "./theme";

// Rectangles are in the print's own pixels (the crops in public/smart are
// 1172 px wide), not relative to a pop-up's crop.
type Rect = [x: number, y: number, w: number, h: number];
export type Highlight = { lines: Rect[]; start: number };

const SRC_W = 1172;
const BAR = 64;

// A news print opening as a browser pop-up over João: title bar with the
// site's address, a crop of the print, and highlighter sweeps.
export const Popup: React.FC<{
  src: string;
  url: string;
  // Vertical slice of the print to show.
  crop: [y: number, h: number];
  width: number;
  top: number;
  x?: number;
  rotate?: number;
  dark?: boolean;
  highlights?: Highlight[];
  enter: number;
  exit: number;
}> = ({ src, url, crop, width, top, x = 0, rotate = 0, dark = false, highlights = [], enter, exit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enter || frame >= exit) return null;
  const k = width / SRC_W;
  const s = spring({ frame: frame - enter, fps, config: { damping: 11, mass: 0.6 } });
  const out = interpolate(frame, [exit - 6, exit], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: (1080 - width) / 2 + x,
        width,
        borderRadius: 24,
        overflow: "hidden",
        background: dark ? "#000" : pa.white,
        boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 0 0 3px rgba(255,255,255,0.25)",
        transformOrigin: "50% 100%",
        transform: `scale(${interpolate(s, [0, 1], [0.2, 1]) * out}) rotate(${interpolate(s, [0, 1], [-10, rotate])}deg)`,
        opacity: Math.min(1, s * 3),
        fontFamily: pa.font,
      }}
    >
      <div
        style={{
          height: BAR,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          background: "#e9edf1",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: 14,
            background: pa.white,
            borderRadius: 10,
            padding: "8px 18px",
            fontSize: 24,
            fontWeight: 700,
            color: pa.gray,
          }}
        >
          🔒 {url}
        </div>
      </div>
      <div style={{ position: "relative", height: crop[1] * k, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -crop[0] * k, width }}>
          <Img src={staticFile(src)} style={{ width, display: "block" }} />
          {highlights.map((h, i) => (
            <Marker key={i} highlight={h} k={k} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Highlighter sweeping across each line in turn.
const Marker: React.FC<{ highlight: Highlight; k: number; dark: boolean }> = ({
  highlight,
  k,
  dark,
}) => {
  const frame = useCurrentFrame();
  const total = highlight.lines.reduce((a, l) => a + l[2], 0);
  const SWEEP = 16;
  let offset = 0;
  return (
    <>
      {highlight.lines.map(([x, y, w, h], i) => {
        const a = highlight.start + (offset / total) * SWEEP;
        offset += w;
        const b = highlight.start + (offset / total) * SWEEP;
        const p = interpolate(frame, [a, b], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (x - 10) * k,
              top: y * k,
              width: (w + 20) * k * p,
              height: h * k,
              borderRadius: 6,
              background: dark ? "rgba(32,163,214,0.85)" : "rgba(32,163,214,0.6)",
              mixBlendMode: dark ? "screen" : "multiply",
            }}
          />
        );
      })}
    </>
  );
};

// Callout above João's head while the pop-ups are open.
export const TopNote: React.FC<{
  start: number;
  end: number;
  icon: IconKind;
  tone?: "blue" | "red";
  children: React.ReactNode;
}> = ({ start, end, icon, tone = "blue", children }) => {
  const { enter, exit, visible } = usePop(start, end, 12);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          maxWidth: 940,
          background: "rgba(10,21,32,0.88)",
          border: `3px solid ${tone === "red" ? pa.red : pa.cyan}`,
          borderRadius: 26,
          padding: "20px 34px 20px 20px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          transform: `translateY(${interpolate(enter, [0, 1], [-160, 0])}px) scale(${exit})`,
          opacity: Math.min(1, enter * 1.5),
          fontFamily: pa.font,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 96,
            height: 96,
            borderRadius: 22,
            background: tone === "red" ? pa.red : pa.grad,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon kind={icon} size={58} strokeWidth={2.1} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const noteBig: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 60,
  lineHeight: 1.05,
  color: pa.white,
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
};

export const noteSmall: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 32,
  lineHeight: 1.2,
  color: "rgba(255,255,255,0.8)",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  marginTop: 6,
};

// Rubber stamp slammed over the pop-ups.
export const Stamp: React.FC<{ start: number; end: number; label: string; top: number }> = ({
  start,
  end,
  label,
  top,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame >= end) return null;
  const s = spring({ frame: frame - start, fps, config: { damping: 10, mass: 0.6 } });
  const out = interpolate(frame, [end - 6, end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: out * Math.min(1, s * 2),
      }}
    >
      <div
        style={{
          fontFamily: pa.font,
          fontWeight: 800,
          fontSize: 150,
          color: pa.red,
          border: `14px solid ${pa.red}`,
          borderRadius: 24,
          padding: "6px 40px 16px",
          background: "rgba(255,255,255,0.92)",
          letterSpacing: "0.04em",
          transform: `rotate(-12deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        {label}
      </div>
    </div>
  );
};
