import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
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
