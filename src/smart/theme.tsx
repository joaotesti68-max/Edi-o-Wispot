import {
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";

// Pro Advanced blues and ink, plus one alert red reserved for the leak itself.
export const pa = {
  blue: brand.colors.primary,
  cyan: brand.colors.primaryLight,
  ink: "#0a1520",
  navy: "#0f2536",
  gray: brand.colors.gray,
  white: "#ffffff",
  red: "#ff3b45",
  grad: brand.manualGradient,
  font: brand.fontFamily,
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Spring in at `start`, quick scale-out ending at `end` (both absolute frames).
export const usePop = (start: number, end: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });
  const exit = interpolate(frame, [end - 7, end], [1, 0], clamp);
  return { enter, exit, visible: frame >= start && frame < end, frame };
};

export type SfxName =
  | "impact"
  | "glitch"
  | "beep"
  | "typing"
  | "riser"
  | "whoosh"
  | "pop";

const sfxFile: Record<SfxName, string> = {
  impact: "audio/smart/impact.wav",
  glitch: "audio/smart/glitch.wav",
  beep: "audio/smart/beep.wav",
  typing: "audio/smart/typing.wav",
  riser: "audio/smart/riser.wav",
  whoosh: "audio/sfx/whoosh.wav",
  pop: "audio/sfx/pop.wav",
};

export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.35,
}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(sfxFile[name])} volume={volume} />
  </Sequence>
);

export type IconKind =
  | "hacker"
  | "camera"
  | "building"
  | "warning"
  | "shield"
  | "user"
  | "globe"
  | "server"
  | "pin"
  | "face"
  | "x";

const paths: Record<IconKind, React.ReactNode> = {
  hacker: (
    <>
      <path d="M4 21c0-5 2.5-8 4-9.5C7 9 7.5 3 12 3s5 6 4 8.5c1.5 1.5 4 4.5 4 9.5" />
      <path d="M8.6 11.5c.9 1 2 1.5 3.4 1.5s2.5-.5 3.4-1.5" />
      <path d="M9.5 9.2h1.4M13.1 9.2h1.4" />
    </>
  ),
  camera: (
    <>
      <path d="M3 7.5 16.5 4l1.6 6L4.6 13.5Z" />
      <path d="M18.1 10l2.6-.7M10.5 12l1 3.8H6.5M6.5 13.5V20" />
      <circle cx="14.5" cy="7.6" r="0.9" fill="currentColor" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5.5L13 3v18M13 8.5l7 2V21M2.5 21h19" />
      <path d="M7.5 8h2M7.5 11.5h2M7.5 15h2M16 13.5h1.5M16 17h1.5" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.5 2.5 20h19Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.3" r="0.6" fill="currentColor" />
    </>
  ),
  shield: (
    <path d="M12 2.5 4.5 5.5V11c0 5 3.3 9 7.5 10.5 4.2-1.5 7.5-5.5 7.5-10.5V5.5Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" />
    </>
  ),
  server: (
    <>
      <rect x="3.5" y="3.5" width="17" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="17" height="7" rx="1.5" />
      <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s-7-6.2-7-11.8a7 7 0 0 1 14 0c0 5.6-7 11.8-7 11.8Z" />
      <circle cx="12" cy="9.7" r="2.6" />
    </>
  ),
  face: (
    <>
      <path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16" />
      <path d="M9 9.5v1M15 9.5v1M12 9.5v4h-1M9.5 16.5c1.5 1 3.5 1 5 0" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

export const Icon: React.FC<{
  kind: IconKind;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ kind, size = 48, color = pa.white, strokeWidth = 2 }) => (
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

// Deterministic pseudo-random in [0, 1) for glitch slices and noise.
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
