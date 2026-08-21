import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { VideoBlock } from "./VideoBlock";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import { FPS, OUTRO_FRAMES, TRANSITION_FRAMES, blocks, outroRange, totalDurationInFrames } from "./content";

export const ProAdvancedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Music bed sits ~20 dB under the voice, then opens up over the end card. */}
      <Audio
        src={staticFile("audio/trilha-corporate.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [
              0,
              20,
              outroRange.start - 18,
              outroRange.start + 22,
              totalDurationInFrames - 14,
              totalDurationInFrames,
            ],
            [0, 0.1, 0.1, 0.26, 0.26, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />

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
