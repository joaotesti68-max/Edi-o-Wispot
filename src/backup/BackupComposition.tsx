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
  silentRanges,
  shots,
  totalDurationInFrames,
} from "./content";

const musicVolume = (frame: number) => {
  // Sits under the voice, then opens up over the end card.
  const base = interpolate(
    frame,
    [0, 22, outroRange.start - 20, outroRange.start + 10, totalDurationInFrames - 14, totalDurationInFrames],
    [0, 0.13, 0.13, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Comes forward on the beats that carry no take.
  const lift = Math.max(
    0,
    ...silentRanges.map((r) =>
      interpolate(frame, [r.start - 6, r.start + 8, r.end - 10, r.end + 4], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  return base * (1 + 0.9 * lift);
};

const Music: React.FC = () => (
  <Audio src={staticFile("audio/theme.mp3")} volume={musicVolume} loop />
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
