import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ShotBlock } from "./Shot";
import { BackupEndCard } from "./EndCard";
import { ProgressBar } from "./ui";
import { fontFamily } from "../loadFont";
import {
  FPS,
  HEIGHT,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  WIDTH,
  outroRange,
  shotTransitions,
  shots,
  totalDurationInFrames,
} from "./content";

const musicVolume = (frame: number) =>
  // Sits under the voice, then opens up over the end card.
  interpolate(
    frame,
    [0, 20, outroRange.start - 16, outroRange.start + 10, totalDurationInFrames - 16, totalDurationInFrames],
    [0, 0.085, 0.085, 0.22, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const Music: React.FC = () => (
  <Audio src={staticFile("audio/funky-jazz.mp3")} volume={musicVolume} />
);

export const BackupVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#000" }}>
      <Music />

      <TransitionSeries>
        {shots.map((shot, i) => (
          <React.Fragment key={shot.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: shotTransitions[i] })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={shot.durationInFrames}>
              <ShotBlock shot={shot} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <BackupEndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar />
    </AbsoluteFill>
  );
};

export const BackupComposition: React.FC = () => (
  <Composition
    id="ProAdvancedBackup"
    component={BackupVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
