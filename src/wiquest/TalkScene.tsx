import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Part, Talk } from "./edit";
import { toSceneFrame } from "./edit";
import { Cta, Flow, LogoCard, QuestionMark, ReviewCard, Sticker } from "./Overlays";
import { wq, wsp } from "./theme";

// One surviving stretch of a take, with a slow push-in. Later parts sit
// tighter so a jump cut reads as a punch-in.
export const TalkPart: React.FC<{ src: string; part: Part; index: number }> = ({
  src,
  part,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 18 } });
  const scale =
    (index % 2 === 1 ? 1.14 : 1.02) *
    interpolate(settle, [0, 1], [1.04, 1]) *
    interpolate(frame, [0, part.durationInFrames], [1, 1.03]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 30%" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={part.srcStart}
        trimAfter={part.srcStart + part.durationInFrames}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(1.06) saturate(1.05)",
        }}
      />
    </AbsoluteFill>
  );
};

// "WiQuest na prática" badge pinned to the top of the talking scenes.
export const Badge: React.FC<{ animateIn: boolean }> = ({ animateIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = animateIn ? spring({ frame: frame - 4, fps, config: { damping: 13 } }) : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 92,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        fontFamily: wsp.font,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: wq.orange,
          color: wsp.white,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "0.08em",
          padding: "16px 34px 18px",
          borderRadius: 999,
          boxShadow: "0 10px 30px rgba(243,106,5,0.35)",
          transform: `translateY(${interpolate(s, [0, 1], [-200, 0])}px)`,
        }}
      >
        <Img src={staticFile(wq.logoWhite)} style={{ height: 50 }} />
        NA PRÁTICA
      </div>
    </div>
  );
};

export const TalkScene: React.FC<{ scene: Talk; first: boolean }> = ({
  scene,
  first,
}) => {
  const frame = useCurrentFrame();
  const f = (at: number) => toSceneFrame(scene, at);
  const end = scene.durationInFrames;

  // Each cue lasts until the next one starts unless it says otherwise.
  const starts = scene.cues.map((c) => f(c.at));
  const endOf = (i: number) => {
    const cue = scene.cues[i];
    if ("until" in cue && cue.until !== undefined) return f(cue.until);
    return i + 1 < starts.length ? starts[i + 1] - 2 : end + 12;
  };

  const vignette = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: wsp.blueDeep }}>
      {scene.parts.map((part, i) => (
        <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
          <TalkPart src={scene.src} part={part} index={i} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          opacity: vignette,
          background:
            "linear-gradient(to bottom, rgba(11,145,193,0.35) 0%, rgba(11,145,193,0) 16%, rgba(11,145,193,0) 55%, rgba(11,60,90,0.45) 100%)",
        }}
      />

      <Badge animateIn={first} />
      <Img
        src={staticFile(wsp.logoWhite)}
        style={{
          position: "absolute",
          bottom: 70,
          right: 60,
          width: 170,
          opacity: 0.85 * vignette,
        }}
      />

      {scene.cues.map((cue, i) => {
        const start = starts[i];
        const stop = endOf(i);
        switch (cue.type) {
          case "question":
            return <QuestionMark key={i} start={start} end={stop} />;
          case "sticker":
            return (
              <Sticker key={i} text={cue.text} icon={cue.icon} start={start} end={stop} />
            );
          case "logo":
            return <LogoCard key={i} start={start} end={stop} tagline={cue.tagline} />;
          case "review":
            return <ReviewCard key={i} start={start} end={stop} />;
          case "cta":
            return <Cta key={i} start={start} end={end + 12} />;
          case "flow":
            return <Flow key={i} start={start} to={f(cue.to)} end={end + 12} />;
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );
};
