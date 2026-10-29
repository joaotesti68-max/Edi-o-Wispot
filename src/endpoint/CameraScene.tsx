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
import { Captions } from "./Captions";
import type { Part, Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { Cta, EndpointCard, LogoPill, Places, RiskBanner, Risks, Sticker } from "./Overlays";
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
  const scale =
    (index % 2 === 1 ? 1.12 : 1) *
    interpolate(settle, [0, 1], [1.05, 1]) *
    interpolate(frame, [0, part.durationInFrames], [1, 1.03]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 30%" }}>
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

export const CameraScene: React.FC<{ scene: Scene; first: boolean }> = ({ scene, first }) => {
  const f = (at: number) => toSceneFrame(scene, at);
  const end = scene.durationInFrames;
  const starts = scene.cues.map((c) =>
    c.type === "places" || c.type === "risks" ? f(c.items[0].at) : f(c.at),
  );
  const endOf = (i: number) => {
    const cue = scene.cues[i];
    if ("until" in cue && cue.until !== undefined) return f(cue.until);
    return i + 1 < starts.length ? starts[i + 1] - 2 : end;
  };

  return (
    <AbsoluteFill style={{ background: pa.deep }}>
      <SceneVideo scene={scene} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(28,63,87,0.35) 0%, rgba(28,63,87,0) 15%, rgba(28,63,87,0) 48%, rgba(28,63,87,0.55) 100%)",
        }}
      />
      <LogoPill animateIn={first} />

      {scene.cues.map((cue, i) => {
        const start = starts[i];
        const stop = endOf(i);
        switch (cue.type) {
          case "sticker":
            return (
              <Sticker
                key={i}
                text={cue.text}
                icon={cue.icon}
                dark={cue.dark}
                start={start}
                end={stop}
              />
            );
          case "places":
            return (
              <Places
                key={i}
                items={cue.items.map((it) => ({ ...it, start: f(it.at) }))}
                end={stop}
              />
            );
          case "endpointCard":
            return <EndpointCard key={i} start={start} reveal={f(cue.reveal)} end={end + 1} />;
          case "risks":
            return (
              <Risks
                key={i}
                items={cue.items.map((it) => ({ ...it, start: f(it.at) }))}
                end={stop}
              />
            );
          case "riskBanner":
            return <RiskBanner key={i} start={start} end={end + 1} />;
          case "cta":
            return <Cta key={i} start={start} end={end} />;
          default:
            return null;
        }
      })}

      <Captions scene={scene} top={1500} />
    </AbsoluteFill>
  );
};
