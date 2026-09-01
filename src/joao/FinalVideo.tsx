import React from "react";
import { AbsoluteFill, Audio, Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { EndCard } from "../EndCard";
import { ProgressBar } from "../ProgressBar";
import { fontFamily } from "../loadFont";
import { StyledBlock } from "./StyledBlock";
import {
  OUTRO_FRAMES,
  OUTRO_TRANSITION_FRAMES,
  blockRanges,
  blocksDuration,
  clipDuration,
  clips,
  finalDuration,
  outroRange,
} from "./takes";

/**
 * Trilha baixa o suficiente pra não brigar com a fala, entrando e saindo em
 * fade. A composição da Isabella usa 0.42, mas ali a música sustenta cortes
 * mais longos; aqui é fala direta do começo ao fim.
 */
const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Audio
      src={staticFile("audio/theme.mp3")}
      volume={() =>
        interpolate(
          frame,
          [0, 36, blocksDuration - 24, blocksDuration, finalDuration - 18, finalDuration],
          [0, 0.16, 0.16, 0.3, 0.3, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};

export const JoaoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <MusicBed />

      {/* Corte seco entre os blocos: um fade sobreporia as duas falas. Só a
          entrada do end card leva transição. */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={blocksDuration}>
          <Series>
            {clips.map((clip) => (
              <Series.Sequence key={clip.id} durationInFrames={clipDuration(clip)}>
                <StyledBlock clip={clip} />
              </Series.Sequence>
            ))}
          </Series>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: OUTRO_TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar ranges={blockRanges} outroStart={outroRange.start} />
    </AbsoluteFill>
  );
};
