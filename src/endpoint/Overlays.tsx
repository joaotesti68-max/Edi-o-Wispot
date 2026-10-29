import {
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Icon, pa } from "./theme";

const OUT = 8;

// Spring in at `start`, quick scale-out ending at `end`.
export const usePop = (start: number, end: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { enter, exit, visible: frame >= start && frame < end, frame, fps };
};

export const Sfx: React.FC<{ at: number; src?: string; volume?: number }> = ({
  at,
  src = "audio/sfx/pop.wav",
  volume = 0.3,
}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={18} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const row = (top: number): React.CSSProperties => ({
  position: "absolute",
  top,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 18,
  fontFamily: pa.font,
});

// "Fale com a gente pelo link."
export const Cta: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const { enter, visible, frame, fps } = usePop(start, end + 30, 10);
  if (!visible) return null;
  const tap = spring({ frame: frame - start - 14, fps, config: { damping: 7 } });
  const press = 1 - 0.06 * Math.max(0, Math.sin((frame - start - 14) / 4)) * (frame > start + 14 ? 1 : 0);
  return (
    <div style={row(1130)}>
      <Sfx at={start} />
      <div
        style={{
          position: "relative",
          background: pa.grad,
          borderRadius: 999,
          padding: "30px 64px",
          display: "flex",
          alignItems: "center",
          gap: 22,
          boxShadow: "0 22px 60px rgba(28,63,87,0.4)",
          transform: `scale(${enter * press})`,
          border: `5px solid ${pa.white}`,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 54, color: pa.white }}>FALE COM A GENTE</span>
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: -86,
            transform: `scale(${tap}) rotate(-18deg)`,
          }}
        >
          <Icon kind="pointer" size={120} color={pa.white} strokeWidth={1.8} />
        </div>
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 38,
          color: pa.deep,
          background: pa.white,
          padding: "12px 34px",
          borderRadius: 999,
          opacity: tap,
          marginTop: 40,
        }}
      >
        Clique no link
      </div>
    </div>
  );
};
