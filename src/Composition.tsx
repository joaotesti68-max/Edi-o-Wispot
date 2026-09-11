import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { OpeningCard } from "./OpeningCard";
import { ScreenBlock } from "./ScreenBlock";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import {
  FPS,
  OPENING_FRAMES,
  blockRanges,
  blocks,
  totalDurationInFrames,
  voiceOvers,
} from "./content";

export const WispotEpisode: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#062533" }}>
      <Sequence durationInFrames={OPENING_FRAMES}>
        <OpeningCard />
      </Sequence>

      {blocks.map((block, i) => (
        <Sequence
          key={block.id}
          from={blockRanges[i].start}
          durationInFrames={block.durationInFrames}
        >
          <ScreenBlock block={block} />
        </Sequence>
      ))}

      {voiceOvers.map((vo) => (
        <Sequence key={vo.src} from={vo.startFrame} durationInFrames={vo.durationInFrames}>
          <Audio src={staticFile(vo.src)} />
        </Sequence>
      ))}

      <ProgressBar />
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="WispotEp1"
      component={WispotEpisode}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
