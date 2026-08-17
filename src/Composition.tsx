import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { VideoBlock } from "./VideoBlock";
import { GraphicInterstitial } from "./GraphicInterstitial";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import { FPS, OUTRO_FRAMES, TRANSITION_FRAMES, timeline, totalDurationInFrames } from "./content";

export const ProAdvancedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Audio src={staticFile("audio/theme.mp3")} volume={0.55} />

      <TransitionSeries>
        {timeline.map((item, i) => {
          const key = item.type === "video" ? item.block.id : item.interstitial.id;
          const durationInFrames =
            item.type === "video" ? item.block.durationInFrames : item.interstitial.durationInFrames;
          return (
            <React.Fragment key={key}>
              {i === 0 ? null : (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
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
