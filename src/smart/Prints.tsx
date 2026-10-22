import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PIP } from "./TalkClip";
import { Icon, type IconKind, clamp, pa, usePop } from "./theme";

// Rectangles are in the print's own pixels (the crops in public/smart are
// 1172 px wide).
type Rect = [x: number, y: number, w: number, h: number];
export type Highlight = { lines: Rect[]; start: number };

type PrintProps = {
  src: string;
  source: string;
  width: number;
  viewport: number;
  dark: boolean;
  highlights: Highlight[];
  // Height (print pixels) the card pushes in on once the first highlight runs.
  focusY: number;
  enter: number;
  exit: number;
  // Direction the card leaves to: slides off when the next print comes in.
  exitTo: "left" | "fade";
  enterFrom: "bottom" | "right";
};

const SRC_W = 1172;
const TOP = 250;

export const PrintCard: React.FC<PrintProps> = ({
  src,
  source,
  width,
  viewport,
  dark,
  highlights,
  focusY,
  enter,
  exit,
  exitTo,
  enterFrom,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enter || frame >= exit) return null;
  const k = width / SRC_W;
  const s = spring({ frame: frame - enter, fps, config: { damping: 15, mass: 0.8 } });
  const out = interpolate(frame, [exit - 8, exit], [0, 1], clamp);
  const zoom = interpolate(
    frame,
    [highlights[0].start - 4, highlights[0].start + 20],
    [1, 1.07],
    { ...clamp, easing: (t) => 1 - (1 - t) ** 3 },
  );

  const inX = enterFrom === "right" ? interpolate(s, [0, 1], [1100, 0]) : 0;
  const inY = enterFrom === "bottom" ? interpolate(s, [0, 1], [1500, 0]) : 0;
  const outX = exitTo === "left" ? -1200 * out : 0;
  const rot = interpolate(s, [0, 1], [enterFrom === "right" ? 14 : -10, -1.5]) - out * 12;

  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - width) / 2,
        top: TOP,
        width,
        perspective: 1600,
        opacity: exitTo === "fade" ? 1 - out : 1,
        transform: `translate(${inX + outX}px, ${inY}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          height: viewport,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 4px rgba(255,255,255,0.12)",
          transform: `rotateX(${interpolate(s, [0, 1], [25, 3])}deg) rotateZ(${rot}deg)`,
          background: dark ? "#000" : pa.white,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `50% ${focusY * k}px`,
            transform: `scale(${zoom})`,
          }}
        >
          <Img src={staticFile(src)} style={{ width, display: "block" }} />
          {highlights.map((h, i) => (
            <Marker key={i} highlight={h} k={k} dark={dark} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: -30,
          left: 30,
          background: pa.grad,
          color: pa.white,
          fontFamily: pa.font,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: "0.1em",
          padding: "10px 22px",
          borderRadius: 10,
          transform: `rotate(-3deg) scale(${s})`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        FONTE: {source}
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

// Box to the right of João's bubble while the prints are up.
export const SideNote: React.FC<{
  start: number;
  end: number;
  icon: IconKind;
  tone?: "blue" | "red";
  children: React.ReactNode;
}> = ({ start, end, icon, tone = "blue", children }) => {
  const { enter, exit, visible } = usePop(start, end, 13);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: PIP.x + PIP.r + 50,
        right: 50,
        top: PIP.y,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        transform: `translateY(-50%) translateX(${interpolate(enter, [0, 1], [200, 0])}px) scale(${exit})`,
        opacity: Math.min(1, enter * 1.5),
        fontFamily: pa.font,
      }}
    >
      <div
        style={{
          width: 86,
          height: 86,
          borderRadius: 20,
          background: tone === "red" ? pa.red : pa.grad,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon kind={icon} size={52} strokeWidth={2.1} />
      </div>
      {children}
    </div>
  );
};

export const noteBig: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 64,
  lineHeight: 1,
  color: pa.white,
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
};

export const noteSmall: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 34,
  lineHeight: 1.15,
  color: "rgba(255,255,255,0.8)",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
};

export const CountUp: React.FC<{ start: number; to: number }> = ({ start, to }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + 18], [0, to], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  return <>{Math.round(v).toLocaleString("pt-BR")}</>;
};

// Rubber stamp slammed over the print.
export const Stamp: React.FC<{ start: number; end: number; label: string }> = ({
  start,
  end,
  label,
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
        top: 600,
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
