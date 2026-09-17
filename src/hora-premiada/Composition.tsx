import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import {
  Abertura,
  Desenvolvimento1,
  Desenvolvimento2,
  FechamentoA,
  FechamentoB,
} from "./Scenes";
import { fontFamily } from "./fonts";
import {
  FPS,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  type ClipId,
  clips,
  outroRange,
  totalDurationInFrames,
} from "./content";

const scenes: Record<ClipId, React.FC> = {
  abertura: Abertura,
  "desenvolvimento-1": Desenvolvimento1,
  "desenvolvimento-2": Desenvolvimento2,
  "fechamento-a": FechamentoA,
  "fechamento-b": FechamentoB,
};

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/**
 * Bed sits well under the voice, then opens up once the speaker is out and the
 * end card is on screen.
 */
const musicVolume = (frame: number) =>
  interpolate(
    frame,
    [
      0,
      24,
      outroRange.start - 20,
      outroRange.start + 10,
      totalDurationInFrames - 18,
      totalDurationInFrames,
    ],
    [0, 0.07, 0.07, 0.23, 0.23, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

// The track is shorter than the piece and ends on a fade to silence, so a plain
// loop would leave a hole in the middle. Each pass starts before the previous
// one has died away, and its attack covers that tail.
const MUSIC_SECONDS = 29.64;
const MUSIC_OVERLAP = 1.6;

const musicStarts = (() => {
  const step = MUSIC_SECONDS - MUSIC_OVERLAP;
  const starts: number[] = [];
  for (let t = 0; t * FPS < totalDurationInFrames; t += step) {
    starts.push(Math.round(t * FPS));
  }
  return starts;
})();

export const HoraPremiadaVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    {musicStarts.map((from) => (
      <Sequence key={from} from={from}>
        <Audio
          src={staticFile("audio/funky-corporate-startup.mp3")}
          volume={(f) => musicVolume(f + from)}
        />
      </Sequence>
    ))}

    <TransitionSeries>
      {clips.map((clip, i) => {
        const SceneComponent = scenes[clip.id];
        return (
          <React.Fragment key={clip.id}>
            {i === 0 || clip.hardCut ? null : transition}
            <TransitionSeries.Sequence durationInFrames={clip.durationInFrames}>
              <SceneComponent />
            </TransitionSeries.Sequence>
          </React.Fragment>
        );
      })}

      {transition}
      <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
        <EndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <ProgressBar />
  </AbsoluteFill>
);

export const HoraPremiadaComposition: React.FC = () => (
  <Composition
    id="WispotHoraPremiada"
    component={HoraPremiadaVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
