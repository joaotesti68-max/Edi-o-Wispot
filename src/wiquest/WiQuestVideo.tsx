import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  staticFile,
} from "remotion";
import { fontFamily } from "../loadFont";
import {
  END_FRAMES,
  END_START,
  FPS,
  HEIGHT,
  TOTAL_FRAMES,
  WIDTH,
  captions,
  cutaways,
  placedShots,
} from "./content";
import { Shot } from "./Shot";
import { Chrome, NameCard } from "./Chrome";
import { CaptionCard } from "./Captions";
import { EndCard } from "./EndCard";
import { BrandDemo } from "./cutaways/BrandDemo";
import { SpeedCompare } from "./cutaways/SpeedCompare";
import { Dashboard } from "./cutaways/Dashboard";

const CUTAWAYS = {
  demo: BrandDemo,
  speed: SpeedCompare,
  dashboard: Dashboard,
};

/**
 * Cama musical. A faixa vem masterizada em RMS -14 dB, bem mais quente que a
 * fala (RMS -23,5 dB), então o ganho é baixo: 0,05 deixa a música 17 dB abaixo
 * da voz durante o corpo do vídeo; na cartela final ela sobe para 0,2 — 5 dB
 * abaixo do nível da fala — para o fecho não cair de energia quando a voz sai.
 */
const musicVolume = (frame: number) =>
  interpolate(
    frame,
    [0, 14, END_START - 6, END_START + 14, TOTAL_FRAMES - 30, TOTAL_FRAMES],
    [0, 0.05, 0.05, 0.2, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

export const WiQuestVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#04141c" }}>
      <Audio
        src={staticFile("wiquest/audio/leberch-corporate.mp3")}
        volume={musicVolume}
      />

      {placedShots.map((shot) => (
        <Sequence
          key={`${shot.blockIndex}-${shot.shotIndex}`}
          from={shot.from}
          durationInFrames={shot.durationInFrames}
        >
          <Shot shot={shot} isBlockOpener={shot.shotIndex === 0} />
        </Sequence>
      ))}

      {captions.map((caption, i) => (
        <Sequence
          key={`caption-${i}`}
          from={caption.from}
          durationInFrames={caption.durationInFrames}
        >
          <CaptionCard caption={caption} />
        </Sequence>
      ))}

      <NameCard />
      <Chrome />

      {/* Inserts entram por cima do take — o áudio da Mari continua rodando. */}
      {cutaways.map((cutaway, i) => {
        const Component = CUTAWAYS[cutaway.kind];
        return (
          <Sequence
            key={`cutaway-${i}`}
            from={cutaway.from}
            durationInFrames={cutaway.durationInFrames}
          >
            <Component />
          </Sequence>
        );
      })}

      <Sequence from={END_START} durationInFrames={END_FRAMES}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

export const WiQuestComposition: React.FC = () => (
  <Composition
    id="WiQuest"
    component={WiQuestVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
