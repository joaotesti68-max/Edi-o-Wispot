import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { VideoBlock } from "./VideoBlock";
import { EndCard } from "./EndCard";
import { ProgressBar } from "./ProgressBar";
import { fontFamily } from "./loadFont";
import {
  FPS,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  blockRanges,
  blocks,
  outroRange,
  totalDurationInFrames,
} from "./contentLogistica";

/**
 * He delivered the script in short fragments, so the edit leans on movement to
 * carry it: a directional push between blocks instead of a dissolve.
 */
const SLIDE_DIRECTIONS = ["from-right", "from-bottom", "from-left", "from-bottom"] as const;

export const ProAdvancedLogistica: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Already normalised to -26 LUFS on disk; this sits it well under his voice. */}
      <Audio src={staticFile("audio/theme-logistica.mp3")} volume={0.5} />

      <TransitionSeries>
        {blocks.map((block, i) => (
          <React.Fragment key={block.id}>
            {i === 0 ? null : (
              <TransitionSeries.Transition
                presentation={slide({
                  direction: SLIDE_DIRECTIONS[(i - 1) % SLIDE_DIRECTIONS.length],
                })}
                timing={springTiming({
                  config: { damping: 200 },
                  durationInFrames: TRANSITION_FRAMES,
                })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={block.durationInFrames}>
              <VideoBlock block={block} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          {/* matches how he closes the script, "fale conosco" */}
          <EndCard cta="Fale conosco" />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar ranges={blockRanges} outroStart={outroRange.start} />
    </AbsoluteFill>
  );
};

export const LogisticaComposition = () => {
  return (
    <Composition
      id="ProAdvancedLogistica"
      component={ProAdvancedLogistica}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
