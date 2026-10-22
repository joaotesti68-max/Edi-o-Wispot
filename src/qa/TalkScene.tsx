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
import {
  Chips,
  CommentBox,
  Dashboard,
  LogoPop,
  NameTag,
  NextEpisode,
  Sticker,
} from "./Overlays";
import { WifiArcs, wsp } from "./theme";

// One surviving stretch of a take. Alternate parts sit tighter so the jump
// cuts read as punch-ins, and each part opens with a quick zoom settle.
const TalkPart: React.FC<{
  src: string;
  part: Part;
  zoom: number;
  index: number;
}> = ({ src, part, zoom, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 18 } });
  const scale =
    zoom *
    (index % 2 === 1 ? 1.12 : 1) *
    interpolate(settle, [0, 1], [1.04, 1]) *
    interpolate(frame, [0, part.durationInFrames], [1, 1.025]);
  return (
    <AbsoluteFill
      style={{ transform: `scale(${scale})`, transformOrigin: "50% 32%" }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={part.srcStart}
        trimAfter={part.srcStart + part.durationInFrames}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// "WISPOT RESPONDE" badge pinned to the top of the talking scenes.
const Badge: React.FC<{ animateIn: boolean }> = ({ animateIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = animateIn ? spring({ frame: frame - 4, fps, config: { damping: 13 } }) : 1;
  const arcs = [0, 1, 2].map((i) =>
    animateIn
      ? interpolate(frame, [8 + i * 4, 16 + i * 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1,
  ) as [number, number, number];
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
          gap: 16,
          background: wsp.grad,
          color: wsp.white,
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: "0.1em",
          padding: "14px 34px 14px 24px",
          borderRadius: 999,
          boxShadow: "0 10px 30px rgba(11,145,193,0.35)",
          transform: `translateY(${interpolate(s, [0, 1], [-200, 0])}px)`,
        }}
      >
        <WifiArcs size={46} progress={arcs} />
        WISPOT RESPONDE
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
  const starts = scene.cues.map((c) =>
    c.type === "chips" ? f(c.items[0].at) : f(c.at),
  );
  const endOf = (i: number) => {
    const cue = scene.cues[i];
    if ("until" in cue && cue.until !== undefined) return f(cue.until);
    return i + 1 < starts.length ? starts[i + 1] - 2 : end;
  };

  const vignette = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: wsp.blueDeep }}>
      {scene.parts.map((part, i) => (
        <Sequence
          key={part.from}
          from={part.from}
          durationInFrames={part.durationInFrames}
        >
          <TalkPart src={scene.src} part={part} zoom={scene.zoom} index={i} />
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
          case "sticker":
            return (
              <Sticker
                key={i}
                text={cue.text}
                icon={cue.icon}
                start={start}
                end={stop}
              />
            );
          case "name":
            return <NameTag key={i} start={start} end={stop} />;
          case "logo":
            return <LogoPop key={i} start={start} end={end + 12} />;
          case "dashboard":
            return <Dashboard key={i} start={start} end={stop} />;
          case "chips":
            return (
              <Chips
                key={i}
                items={cue.items.map((it) => ({ ...it, start: f(it.at) }))}
                end={end + 12}
              />
            );
          case "comment":
            return <CommentBox key={i} start={start} end={end + 12} />;
          case "next":
            return <NextEpisode key={i} start={start} end={end + 12} />;
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );
};
