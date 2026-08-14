import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LogoBumper } from "./LogoBumper";
import { VideoBlock } from "./VideoBlock";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import {
  FPS,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  blocks,
  totalDurationInFrames,
} from "./content";

export const ProAdvancedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <LogoBumper />
        </TransitionSeries.Sequence>

        {blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
            <TransitionSeries.Sequence durationInFrames={block.durationInFrames}>
              <VideoBlock block={block} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar />
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="ProAdvanced"
      component={ProAdvancedVideo}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
