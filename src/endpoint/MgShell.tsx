import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions } from "./Captions";
import { TalkPart } from "./CameraScene";
import type { Scene } from "./edit";
import { Sfx } from "./Overlays";
import { TileGrid, pa } from "./theme";

const REVEAL = 12;

// Index of the last start at or before `frame`, -1 if none.
export const lastStarted = (starts: number[], frame: number) =>
  starts.reduce((acc, s, i) => (frame >= s ? i : acc), -1);

// Full-screen motion graphics over an off-camera take: the take's audio
// keeps playing, its picture only shows under the opening circle reveal.
export const MgShell: React.FC<{ scene: Scene; children: React.ReactNode }> = ({
  scene,
  children,
}) => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, REVEAL], [0, 120], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ background: pa.deep }}>
      {scene.parts.map((part, i) => (
        <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
          {part.from === 0 ? (
            <Sequence durationInFrames={REVEAL + 1}>
              <TalkPart src={scene.src} part={part} index={i} />
            </Sequence>
          ) : null}
          <Audio
            src={staticFile(scene.src)}
            trimBefore={part.srcStart}
            trimAfter={part.srcStart + part.durationInFrames}
          />
        </Sequence>
      ))}
      <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 45%)` }}>
        <AbsoluteFill style={{ background: pa.grad }} />
        <TileGrid opacity={0.07} />
        {children}
        <Captions scene={scene} top={1540} />
      </AbsoluteFill>
      <Sfx at={0} src="audio/sfx/whoosh.wav" volume={0.32} />
    </AbsoluteFill>
  );
};

// Big headline that swaps with a spring each time `text` changes.
export const Headline: React.FC<{
  lines: { from: number; text: React.ReactNode; small?: string }[];
  top?: number;
}> = ({ lines, top = 190 }) => {
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
