import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { Abertura, Desenvolvimento1, Desenvolvimento2, Fechamento } from "./Scenes";
import { fontFamily } from "./fonts";
import {
  FPS,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  blocks,
  outroRange,
  totalDurationInFrames,
} from "./content";

const scenes = [Abertura, Desenvolvimento1, Desenvolvimento2, Fechamento];

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/**
 * Bed stays well under the voice, then opens up once the speaker is out and the
 * end card is on screen.
 */
const musicVolume = (frame: number) =>
  interpolate(
    frame,
    [0, 20, outroRange.start - 20, outroRange.start + 10, totalDurationInFrames - 16, totalDurationInFrames],
    [0, 0.12, 0.12, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

export const HoraPremiadaVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Audio src={staticFile("audio/theme.mp3")} volume={musicVolume} loop />

    <TransitionSeries>
      {scenes.map((SceneComponent, i) => (
        <React.Fragment key={blocks[i].id}>
          {i === 0 ? null : transition}
          <TransitionSeries.Sequence durationInFrames={blocks[i].durationInFrames}>
            <SceneComponent />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}

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
