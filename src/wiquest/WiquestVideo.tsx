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
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
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
import { HowItWorks } from "./HowItWorks";
import { TalkScene } from "./TalkScene";
import { Sfx, wq, wsp } from "./theme";

const { width, height } = { width: 1080, height: 1920 };

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 4, fps, config: { damping: 11 } });
  const by = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const cta = spring({ frame: frame - 24, fps, config: { damping: 14 } });
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
        gap: 60,
        fontFamily: wsp.font,
      }}
    >
      <Img
        src={staticFile(wsp.wifiSymbol)}
        style={{
          position: "absolute",
          top: 470,
          width: 1640,
          opacity: 0.1,
          clipPath: `circle(${reveal * 110}% at 50% 86%)`,
          transform: `scale(${1 + frame * 0.0012})`,
        }}
      />
      <Img
        src={staticFile(wq.logoOrange)}
        style={{
          width: 800,
          transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
          opacity: logo,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: by,
          transform: `translateY(${interpolate(by, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 40, color: wsp.gray }}>uma solução</div>
        <Img src={staticFile(wsp.logoBlue)} style={{ width: 300 }} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          background: wsp.grad,
          color: wsp.white,
          padding: "24px 60px",
          borderRadius: 999,
          opacity: cta,
          transform: `translateY(${interpolate(cta, [0, 1], [60, 0])}px)`,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 50 }}>Fale com a Wispot</div>
        <div style={{ fontWeight: 700, fontSize: 34, opacity: 0.9 }}>{wsp.site}</div>
      </div>
    </AbsoluteFill>
  );
};

// Music ducks under speech and lifts on the end card.
const musicVolume = (f: number) => {
  const UNDER = 0.09;
  const keys: number[] = [0];
  const vals: number[] = [UNDER];
  keys.push(endStart, endStart + 10, totalDurationInFrames - 25, totalDurationInFrames);
  vals.push(UNDER, 0.34, 0.34, 0);
  return interpolate(f, keys, vals, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const WIPE = 18;

// Blue panel led and trailed by orange stripes sweeps right to left; it fully
// covers the frame at `at`, where the hard cut sits.
const BrandWipe: React.FC<{ at: number }> = ({ at }) => (
  <Sequence from={at - WIPE / 2} durationInFrames={WIPE} layout="none">
    <WipeBars />
  </Sequence>
);

const WipeBars: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, WIPE], [0, 1], { easing: Easing.inOut(Easing.cubic) });
  const x = interpolate(p, [0, 1], [1.3 * width, -2.1 * width]);
  const bar = (left: number, w: number, background: string): React.CSSProperties => ({
    position: "absolute",
    top: -200,
    bottom: -200,
    left: x + left * width,
    width: w * width,
    background,
    transform: "skewX(-12deg)",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={bar(-0.22, 0.2, wq.orange)} />
      <div style={bar(0, 1.8, wsp.grad)} />
      <div style={bar(1.84, 0.14, wq.orange)} />
      <Img
        src={staticFile(wq.logoWhite)}
        style={{
          position: "absolute",
          top: height / 2 - 70,
          left: x + 0.9 * width - 260,
          width: 520,
        }}
      />
    </AbsoluteFill>
  );
};

export const WiquestVideo: React.FC = () => {
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
                  <HowItWorks scene={scene} />
                )}
              </TransitionSeries.Sequence>
              {t === "end" ? (
                <TransitionSeries.Transition
                  presentation={iris({ width, height })}
                  timing={linearTiming({ durationInFrames: TRANSITION })}
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
        i > 0 ? (
          <Fragment key={scene.id}>
            <BrandWipe at={sceneStarts[i]} />
            <Sfx at={sceneStarts[i] - 8} src="audio/sfx/whoosh.wav" volume={0.3} />
          </Fragment>
        ) : null,
      )}
      <Sfx at={endStart - 6} src="audio/sfx/whoosh.wav" volume={0.32} />
    </AbsoluteFill>
  );
};

export const WiquestComposition = () => (
  <Composition
    id="WiQuestNaPratica"
    component={WiquestVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={width}
    height={height}
  />
);
