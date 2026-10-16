import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EndCard } from "../EndCard";
import { fontFamily } from "../loadFont";
import { Captions } from "./Captions";
import { SegmentView } from "./Segment";
import { FPS, OUTRO_FADE, OUTRO_FRAMES, segments, talkFrames, totalDurationInFrames } from "./edit";

const outroStart = talkFrames - OUTRO_FADE;

export const WifiVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#000" }}>
      <Audio
        src={staticFile("audio/theme.mp3")}
        volume={(f) =>
          interpolate(f, [0, 15, totalDurationInFrames - 30, totalDurationInFrames], [0, 0.1, 0.1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {segments.map((segment) => (
        <Sequence key={segment.clip.id} from={segment.from} durationInFrames={segment.durationInFrames}>
          <SegmentView segment={segment} />
        </Sequence>
      ))}

      <Sequence durationInFrames={talkFrames}>
        <Captions />
      </Sequence>

      <Sequence from={outroStart} durationInFrames={OUTRO_FRAMES}>
        <OutroFade>
          <EndCard />
        </OutroFade>
      </Sequence>
    </AbsoluteFill>
  );
};

const OutroFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, OUTRO_FADE], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const WifiComposition = () => (
  <Composition
    id="WifiCorporativo"
    component={WifiVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
