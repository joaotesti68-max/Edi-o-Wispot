import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { fontFamily } from "../loadFont";
import { ClipBlock } from "./ClipBlock";
import { Chrome } from "./Chrome";
import { EndCard } from "./EndCard";
import { OpeningTitle } from "./OpeningTitle";
import { VideoCards } from "./VideoCards";
import { YoutubePop } from "./YoutubePop";
import {
  END_CARD_FRAMES,
  FPS,
  TRANSITION_FRAMES,
  VIDEO_CARDS_FRAMES,
  VIDEO_CARDS_START,
  YOUTUBE_POP_FRAMES,
  YOUTUBE_POP_START,
  clips,
  clipDurations,
  endCardStart,
  totalDurationInFrames,
} from "./content";

const OPENING_TITLE_FRAMES = 80;

/** Music sits under the speech and only comes forward on the end card. */
const Soundtrack: React.FC = () => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [0, 10, 30, endCardStart - 6, endCardStart + 10, totalDurationInFrames - 14, totalDurationInFrames],
    [0, 0.2, 0.05, 0.05, 0.24, 0.24, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Audio
      src={staticFile("audio/funky-corporate.mp3")}
      loop
      loopVolumeCurveBehavior="extend"
      volume={volume}
    />
  );
};

export const YoutubeCallVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#000" }}>
      <Soundtrack />

      <TransitionSeries>
        {clips.map((clip, i) => (
          <React.Fragment key={clip.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={clipDurations[i]}>
              <ClipBlock clip={clip} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={END_CARD_FRAMES}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Sequence durationInFrames={OPENING_TITLE_FRAMES}>
        <OpeningTitle />
      </Sequence>

      <Sequence from={VIDEO_CARDS_START} durationInFrames={VIDEO_CARDS_FRAMES}>
        <VideoCards />
      </Sequence>

      <Sequence from={YOUTUBE_POP_START} durationInFrames={YOUTUBE_POP_FRAMES}>
        <YoutubePop />
      </Sequence>

      <Chrome />
    </AbsoluteFill>
  );
};

export const YoutubeCallComposition: React.FC = () => {
  return (
    <Composition
      id="ChamadaYoutube"
      component={YoutubeCallVideo}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
