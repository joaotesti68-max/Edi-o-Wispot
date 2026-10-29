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
import type { Part, Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { AttackDemo, MapDemo, OrbitDemo, RiskDemo, ScanDemo } from "./Demos";
import { Cta } from "./Overlays";
import { pa } from "./theme";

// One surviving stretch of a take. Alternate parts sit tighter so the jump
// cuts read as punch-ins, and each part opens with a quick zoom settle.
export const TalkPart: React.FC<{ src: string; part: Part; index: number }> = ({
  src,
  part,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 18 } });
  // Framed on the upper body: the source shows the speaker down to the knees.
  const scale =
    (index % 2 === 1 ? 1.34 : 1.24) *
    interpolate(settle, [0, 1], [1.05, 1]) *
    interpolate(frame, [0, part.durationInFrames], [1, 1.03]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 24%" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={part.srcStart}
        trimAfter={part.srcStart + part.durationInFrames}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const SceneVideo: React.FC<{ scene: Scene }> = ({ scene }) => (
  <>
    {scene.parts.map((part, i) => (
      <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
        <TalkPart src={scene.src} part={part} index={i} />
      </Sequence>
    ))}
  </>
);

export const CameraScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const f = (at: number) => toSceneFrame(scene, at);
  const end = scene.durationInFrames;

  return (
    <AbsoluteFill style={{ background: pa.deep }}>
      <SceneVideo scene={scene} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(28,63,87,0) 50%, rgba(28,63,87,0.45) 100%)",
        }}
      />
      {scene.cues.map((cue, i) => {
        switch (cue.type) {
          case "attack":
            return (
              <AttackDemo
                key={i}
                start={f(cue.at)}
                server={f(cue.server)}
                laptop={f(cue.laptop)}
                end={Math.min(f(cue.until), end) + 1}
              />
            );
          case "map":
            return (
              <MapDemo key={i} start={f(cue.at)} stops={cue.stops.map(f)} end={f(cue.until)} />
            );
          case "orbit":
            return <OrbitDemo key={i} start={f(cue.at)} endpoints={f(cue.endpoints)} end={end + 1} />;
          case "risk":
            return (
              <RiskDemo
                key={i}
                start={f(cue.at)}
                update={f(cue.update)}
                lost={f(cue.lost)}
                spread={f(cue.spread)}
                end={end + 1}
              />
            );
          case "scan":
            return <ScanDemo key={i} start={f(cue.at)} end={f(cue.until)} />;
          case "cta":
            return <Cta key={i} start={f(cue.at)} end={end} />;
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );
};
