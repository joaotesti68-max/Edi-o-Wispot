import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { VideoBlock } from "./VideoBlock";
import { QuestionCard } from "./QuestionCard";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import {
  FPS,
  HEIGHT,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  WIDTH,
  segments,
  totalDurationInFrames,
} from "./content";

export const FeatureDaSemana: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Sits well under Mari's voice — the clips carry the audio. */}
      <Audio src={staticFile("audio/theme.mp3")} volume={0.12} />

      <TransitionSeries>
        {segments.map((segment, i) => (
          <React.Fragment key={segment.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={segment.durationInFrames}>
              {segment.kind === "question" ? (
                <QuestionCard data={segment} />
              ) : (
                <VideoBlock clip={segment} />
              )}
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
      id="FeatureDaSemana"
      component={FeatureDaSemana}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
