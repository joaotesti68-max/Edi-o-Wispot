import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { VideoBlock } from "./VideoBlock";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import {
  FPS,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  blockRanges,
  blocks,
  outroRange,
  totalDurationInFrames,
} from "./content";

export const ProAdvancedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Audio src={staticFile("audio/theme.mp3")} volume={0.42} />

      <TransitionSeries>
        {blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
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

      <ProgressBar ranges={blockRanges} outroStart={outroRange.start} />
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
