import { Fragment } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { fontFamily } from "../loadFont";
import {
  END_FRAMES,
  FPS,
  TRANSITION,
  endStart,
  sceneStarts,
  scenes,
  totalDurationInFrames,
  transitionAfter,
} from "./edit";
import { QuestionCard } from "./QuestionCard";
import { TalkScene } from "./TalkScene";
import { wsp } from "./theme";

const { width, height } = { width: 1080, height: 1920 };

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 4, fps, config: { damping: 11 } });
  const site = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const reveal = interpolate(frame, [2, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        background: wsp.white,
        alignItems: "center",
        justifyContent: "center",
        gap: 70,
        fontFamily: wsp.font,
      }}
    >
      {/* The Wi-Fi mark from the Wispot logo, revealed outward from its dot */}
      <Img
        src={staticFile(wsp.wifiSymbol)}
        style={{
          position: "absolute",
          top: 470,
          width: 1640,
          opacity: 0.13,
          clipPath: `circle(${reveal * 110}% at 50% 86%)`,
          transform: `scale(${1 + frame * 0.0012})`,
        }}
      />
      <Img
        src={staticFile(wsp.logoBlue)}
        style={{
          width: 720,
          transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
          opacity: logo,
        }}
      />
      <div
        style={{
          background: wsp.grad,
          color: wsp.white,
          fontWeight: 800,
          fontSize: 50,
          padding: "22px 56px",
          borderRadius: 999,
          opacity: site,
          transform: `translateY(${interpolate(site, [0, 1], [60, 0])}px)`,
        }}
      >
        {wsp.site}
      </div>
    </AbsoluteFill>
  );
};

const Whoosh: React.FC<{ at: number }> = ({ at }) => (
  <Sequence from={Math.max(0, at - 6)} durationInFrames={18} layout="none">
    <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.32} />
  </Sequence>
);

// Music ducks under speech and lifts on the question cards and end card.
const musicVolume = (f: number) => {
  const keys: number[] = [0];
  const vals: number[] = [0.09];
  const UNDER = 0.09;
  const UP = 0.3;
  scenes.forEach((scene, i) => {
    if (scene.kind !== "question") return;
    const a = sceneStarts[i];
    const b = a + scene.durationInFrames;
    keys.push(a, a + 8, b - 14, b);
    vals.push(UNDER, UP, UP, UNDER);
  });
  keys.push(endStart, endStart + 10, totalDurationInFrames - 25, totalDurationInFrames);
  vals.push(UNDER, 0.34, 0.34, 0);
  return interpolate(f, keys, vals, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const QaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: wsp.blueDeep }}>
      <Audio src={staticFile("audio/funky-startup.mp3")} volume={musicVolume} />

      <TransitionSeries>
        {scenes.map((scene, i) => {
          const t = transitionAfter(i);
          return (
            <Fragment key={scene.id}>
              <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
                {scene.kind === "talk" ? (
                  <TalkScene scene={scene} first={i === 0} />
                ) : (
                  <QuestionCard card={scene} />
                )}
              </TransitionSeries.Sequence>
              {t === "iris" || t === "end" ? (
                <TransitionSeries.Transition
                  presentation={iris({ width, height })}
                  timing={linearTiming({ durationInFrames: TRANSITION })}
                />
              ) : t === "slide" ? (
                <TransitionSeries.Transition
                  presentation={slide({ direction: "from-bottom" })}
                  timing={springTiming({
                    durationInFrames: TRANSITION,
                    config: { damping: 200 },
                  })}
                />
              ) : null}
            </Fragment>
          );
        })}
        <TransitionSeries.Sequence durationInFrames={END_FRAMES}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {scenes.map((scene, i) =>
        i > 0 && transitionAfter(i - 1) !== "cut" ? (
          <Whoosh key={scene.id} at={sceneStarts[i]} />
        ) : null,
      )}
      <Whoosh at={endStart} />
    </AbsoluteFill>
  );
};

export const QaComposition = () => (
  <Composition
    id="QaVanessa"
    component={QaVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={width}
    height={height}
  />
);
