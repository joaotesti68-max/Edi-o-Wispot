import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ClipBlock } from "./ClipBlock";
import { EndCard } from "./EndCard";
import { StepRail } from "./StepRail";
import { fontFamily } from "../loadFont";
import { FPS, OUTRO_FRAMES, TRANSITION_FRAMES, blocks, totalDurationInFrames } from "./content";

export const ProvedoresVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily, background: "#001824" }}>
      {/* Bem abaixo da narração: aqui a voz dela é o conteúdo, não a trilha. */}
      <Audio src={staticFile("audio/theme.mp3")} volume={0.16} />

      <TransitionSeries>
        {blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={block.durationInFrames}>
              <ClipBlock block={block} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <StepRail />
    </AbsoluteFill>
  );
};

export const ProvedoresComposition = () => {
  return (
    <Composition
      id="Provedores"
      component={ProvedoresVideo}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
