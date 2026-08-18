import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { fontFamily } from "../loadFont";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { TalkingHeadBlock } from "./TalkingHeadBlock";
import { FPS, OUTRO_FRAMES, TRANSITION_FRAMES, buildTimeline, type Episode } from "./series";
import { feature01 } from "./episodes/feature-01";

const MUSIC_PEAK_VOLUME = 0.13;

const BackgroundMusic: React.FC<{ totalDurationInFrames: number }> = ({ totalDurationInFrames }) => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 36, totalDurationInFrames - 60, totalDurationInFrames],
    [0, MUSIC_PEAK_VOLUME, MUSIC_PEAK_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <Audio src={staticFile("audio/wispot-feature-theme.mp3")} volume={volume} />;
};

export const FeatureDaSemanaVideo: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { blockRanges, outroRange, totalDurationInFrames } = buildTimeline(episode.blocks);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <BackgroundMusic totalDurationInFrames={totalDurationInFrames} />

      <TransitionSeries>
        {episode.blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={fade()}
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
