import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "./edit";
import { Sfx } from "./Overlays";
import { TileGrid, pa } from "./theme";

// Index of the last start at or before `frame`, -1 if none.
export const lastStarted = (starts: number[], frame: number) =>
  starts.reduce((acc, s, i) => (frame >= s ? i : acc), -1);

// Full-screen motion graphics over an off-camera take: only the take's
// audio is used, the graphics cut in straight away.
export const MgShell: React.FC<{ scene: Scene; children: React.ReactNode }> = ({
  scene,
  children,
}) => (
  <AbsoluteFill style={{ background: pa.deep }}>
    {scene.parts.map((part) => (
      <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
        <Audio
          src={staticFile(scene.src)}
          trimBefore={part.srcStart}
          trimAfter={part.srcStart + part.durationInFrames}
        />
      </Sequence>
    ))}
    <AbsoluteFill style={{ background: pa.grad }} />
    <TileGrid opacity={0.07} />
    {children}
    <Sfx at={0} src="audio/sfx/whoosh.wav" volume={0.32} />
  </AbsoluteFill>
);

// Big headline that swaps with a spring each time `text` changes.
export const Headline: React.FC<{
  lines: { from: number; text: React.ReactNode; small?: string }[];
  top?: number;
}> = ({ lines, top = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = lastStarted(lines.map((l) => l.from), frame);
  if (idx < 0) return null;
  const line = lines[idx];
  const s = spring({ frame: frame - line.from, fps, config: { damping: 13 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: pa.font,
        color: pa.white,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
        opacity: s,
      }}
    >
      {line.small ? (
        <div style={{ fontWeight: 700, fontSize: 40, letterSpacing: "0.12em", opacity: 0.85 }}>
          {line.small}
        </div>
      ) : null}
      <div style={{ fontWeight: 800, fontSize: 82, lineHeight: 1.05 }}>{line.text}</div>
    </div>
  );
};
