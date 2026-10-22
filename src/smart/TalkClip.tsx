import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Clip, Part } from "./edit";
import { pa } from "./theme";

// Where João's face sits in the 1080×1920 takes.
const FACE = { x: 600, y: 820 };

// One stretch of a take. A second part after a silence cut sits a little
// tighter so the jump reads as a punch-in.
const TalkPart: React.FC<{ id: string; part: Part; zoom: number }> = ({ id, part, zoom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 18 } });
  const scale =
    zoom *
    interpolate(settle, [0, 1], [1.06, 1]) *
    interpolate(frame, [0, part.durationInFrames], [1, 1.035]);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: `${FACE.x}px ${FACE.y}px`,
      }}
    >
      <OffthreadVideo
        src={staticFile(`videos/smart/${id}.mp4`)}
        trimBefore={part.srcStart}
        trimAfter={part.srcStart + part.durationInFrames}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

export const TalkClip: React.FC<{ clip: Clip; parts: Part[] }> = ({ clip, parts }) => (
  <AbsoluteFill style={{ background: pa.ink }}>
    {parts.map((part, i) => (
      <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
        <TalkPart id={clip.id} part={part} zoom={clip.zoom * (i % 2 === 1 ? 1.08 : 1)} />
      </Sequence>
    ))}
    {/* Cool grade and a darker foot so the graphics read on the shirt */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(10,21,32,0.45) 0%, rgba(10,21,32,0) 18%, rgba(10,21,32,0) 50%, rgba(10,21,32,0.6) 100%)",
      }}
    />
    <AbsoluteFill
      style={{ background: "rgba(32,110,170,0.08)", mixBlendMode: "color" }}
    />
  </AbsoluteFill>
);
