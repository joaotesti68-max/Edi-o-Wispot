import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LogoBumper } from "./LogoBumper";
import { VideoBlock } from "./VideoBlock";
import { GraphicInterstitial } from "./GraphicInterstitial";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import { FPS, INTRO_FRAMES, OUTRO_FRAMES, TRANSITION_FRAMES, timeline, totalDurationInFrames } from "./content";

export const ProAdvancedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <LogoBumper />
        </TransitionSeries.Sequence>

        {timeline.map((item) => {
          const key = item.type === "video" ? item.block.id : item.interstitial.id;
          const durationInFrames =
            item.type === "video" ? item.block.durationInFrames : item.interstitial.durationInFrames;
          return (
            <React.Fragment key={key}>
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
              <TransitionSeries.Sequence durationInFrames={durationInFrames}>
                {item.type === "video" ? (
                  <VideoBlock block={item.block} />
                ) : (
                  <GraphicInterstitial items={item.interstitial.items} />
                )}
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}

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
