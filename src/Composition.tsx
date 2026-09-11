import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile } from "remotion";
import { OpeningCard } from "./OpeningCard";
import { ScreenBlock } from "./ScreenBlock";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import { FPS, episodes, layout, type Episode } from "./content";

/** O ffmpeg embutido no Remotion vem sem o filtro afade, então o corte seco
 *  das pontas é suavizado aqui, no volume por frame. */
const VoiceOver: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => (
  <Audio
    src={staticFile(src)}
    volume={(f) =>
      interpolate(f, [0, 3, durationInFrames - 4, durationInFrames - 1], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    }
  />
);

export const WispotEpisode: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { ranges } = layout(episode);

  return (
    <AbsoluteFill style={{ fontFamily, background: "#062533" }}>
      <Sequence durationInFrames={episode.openingFrames}>
        <OpeningCard episode={episode} />
      </Sequence>

      {episode.blocks.map((block, i) => (
        <Sequence key={block.id} from={ranges[i].start} durationInFrames={block.durationInFrames}>
          <ScreenBlock block={block} />
        </Sequence>
      ))}

      {episode.voiceOvers.map((vo) => (
        <Sequence key={vo.src} from={vo.startFrame} durationInFrames={vo.durationInFrames}>
          <VoiceOver src={vo.src} durationInFrames={vo.durationInFrames} />
        </Sequence>
      ))}

      <ProgressBar ranges={ranges} openingFrames={episode.openingFrames} />
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <>
    {episodes.map((episode) => (
      <Composition
        key={episode.id}
        id={episode.id}
        component={WispotEpisode}
        defaultProps={{ episode }}
        durationInFrames={layout(episode).totalDurationInFrames}
        fps={FPS}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
