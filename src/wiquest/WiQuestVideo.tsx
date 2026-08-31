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
  HOOK_FRAMES,
  TOTAL_FRAMES,
  WIDTH,
  captions,
  cutaways,
  placedShots,
} from "./content";
import { Shot } from "./Shot";
import { Chrome, NameCard } from "./Chrome";
import { CaptionCard } from "./Captions";
import { Hook } from "./Hook";
import { EndCard } from "./EndCard";
import { PhoneSurvey } from "./cutaways/PhoneSurvey";
import { SpeedCompare } from "./cutaways/SpeedCompare";
import { Dashboard } from "./cutaways/Dashboard";

const CUTAWAYS = {
  phone: PhoneSurvey,
  speed: SpeedCompare,
  dashboard: Dashboard,
};

/** Cama musical baixa, abrindo espaço para a fala e crescendo nas cartelas. */
const musicVolume = (frame: number) =>
  interpolate(
    frame,
    [
      0,
      18,
      HOOK_FRAMES - 8,
      HOOK_FRAMES + 10,
      END_START - 6,
      END_START + 12,
      TOTAL_FRAMES - 20,
      TOTAL_FRAMES,
    ],
    [0, 0.3, 0.3, 0.1, 0.1, 0.26, 0.26, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

export const WiQuestVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#04141c" }}>
      <Audio src={staticFile("audio/theme.mp3")} volume={musicVolume} />

      <Sequence durationInFrames={HOOK_FRAMES}>
        <Hook />
      </Sequence>

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
