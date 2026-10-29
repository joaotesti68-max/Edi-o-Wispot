import { Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { wsp } from "../qa/theme";
import type { IconKind } from "./edit";

export { WifiArcs, wsp } from "../qa/theme";

// WiQuest keeps its own orange (from the logo) as the accent over the Wispot
// blues; Montserrat throughout, no black.
export const wq = {
  orange: "#f36a05",
  orangeSoft: "#fff1e6",
  logoOrange: "wiquest/logo-orange.png",
  logoWhite: "wiquest/logo-white.png",
  shadow: "0 18px 50px rgba(11,145,193,0.35)",
};

const paths: Record<IconKind, React.ReactNode> = {
  chat: (
    <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5Z" />
  ),
  pin: (
    <>
      <path d="M12 21.5s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9Z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.4-2.6 4" />
      <circle cx="12" cy="17.4" r="0.6" fill="currentColor" />
    </>
  ),
  wifi: (
    <>
      <path d="M8.7 15.3a4.7 4.7 0 0 1 6.6 0" />
      <path d="M5.5 12.1a9.2 9.2 0 0 1 13 0" />
      <path d="M2.3 8.9a13.7 13.7 0 0 1 19.4 0" />
      <circle cx="12" cy="18.6" r="0.9" fill="currentColor" />
    </>
  ),
  star: (
    <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8Z" />
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.8 12.3l2.8 2.8 5.6-6" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M7.1 7.1a7 7 0 0 0 0 9.8M16.9 7.1a7 7 0 0 1 0 9.8" />
    </>
  ),
};

export const Icon: React.FC<{
  kind: IconKind;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ kind, size = 48, color = wsp.white, strokeWidth = 2.2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    color={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths[kind]}
  </svg>
);

// A five-star row; `filled` may be fractional while the stars fill in.
export const Stars: React.FC<{ filled: number; size: number; gap?: number }> = ({
  filled,
  size,
  gap = 6,
}) => (
  <div style={{ display: "flex", gap }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const on = Math.min(1, Math.max(0, filled - i));
      return (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8Z"
            fill={wq.orange}
            fillOpacity={on}
            stroke={wq.orange}
            strokeWidth={1.6}
            strokeLinejoin="round"
            style={{
              transformOrigin: "12px 12px",
              transform: `scale(${0.8 + 0.2 * on})`,
            }}
          />
        </svg>
      );
    })}
  </div>
);

export const OUT = 8;

// Spring in at `start`, quick scale-out ending at `end`.
export const usePop = (start: number, end: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { enter, exit, visible: frame >= start && frame < end, frame };
};

export const Sfx: React.FC<{ at: number; src?: string; volume?: number }> = ({
  at,
  src = "audio/sfx/pop.wav",
  volume = 0.35,
}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={18} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
