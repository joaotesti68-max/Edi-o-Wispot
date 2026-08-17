import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { fontFamily } from "../loadFont";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { TalkingHeadBlock } from "./TalkingHeadBlock";
import { FPS, OUTRO_FRAMES, TRANSITION_FRAMES, buildTimeline, type Episode } from "./series";
import { feature01 } from "./episodes/feature-01";

export const FeatureDaSemanaVideo: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { blockRanges, outroRange } = buildTimeline(episode.blocks);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <TransitionSeries>
        {episode.blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-bottom" })}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={block.durationInFrames}>
              <TalkingHeadBlock block={block} seriesLabel={episode.seriesLabel} episodeNumber={episode.episodeNumber} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <EndCard {...episode.endCard} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar blockRanges={blockRanges} outroRange={outroRange} />
    </AbsoluteFill>
  );
};

export const FeatureDaSemanaComposition: React.FC = () => {
  const { totalDurationInFrames } = buildTimeline(feature01.blocks);

  return (
    <Composition
      id="FeatureDaSemana-01"
      component={FeatureDaSemanaVideo}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ episode: feature01 }}
    />
  );
};
