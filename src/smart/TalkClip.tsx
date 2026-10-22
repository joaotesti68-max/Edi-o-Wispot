import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Clip } from "./edit";
import { pa } from "./theme";

// Where João's face sits in the 1080×1920 takes.
const FACE = { x: 600, y: 820 };

export const TalkClip: React.FC<{ clip: Clip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = clip.out - clip.in;
  const settle = spring({ frame, fps, config: { damping: 18 } });
  const scale =
    clip.zoom *
    interpolate(settle, [0, 1], [1.06, 1]) *
    interpolate(frame, [0, duration], [1, 1.035]);
  return (
    <AbsoluteFill style={{ background: pa.ink }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${FACE.x}px ${FACE.y}px`,
        }}
      >
        <OffthreadVideo
          src={staticFile(`videos/smart/${clip.id}.mp4`)}
          trimBefore={clip.in}
          trimAfter={clip.out}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
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
};
