import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ShotBlock } from "./Shot";
import { WifiEndCard } from "./EndCard";
import { theme } from "../backup/ui";
import { fontFamily } from "../loadFont";
import {
  FPS,
  HEIGHT,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  WIDTH,
  outroRange,
  shotRanges,
  shotTransitions,
  shots,
  totalDurationInFrames,
} from "./content";

const musicVolume = (frame: number) =>
  // Sits under the voice, then opens up over the end card.
  interpolate(
    frame,
    [0, 20, outroRange.start - 16, outroRange.start + 10, totalDurationInFrames - 16, totalDurationInFrames],
    [0, 0.085, 0.085, 0.22, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [outroRange.start - 12, outroRange.start + 4], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 34, left: 52, right: 52, display: "flex", gap: 7, opacity }}>
        {shotRanges.map((range, i) => (
          <div
            key={i}
            style={{
              flex: range.end - range.start,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.3)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${
                  interpolate(frame, [range.start, range.end], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) * 100
                }%`,
                height: "100%",
                background: theme.white,
                borderRadius: 3,
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const WifiVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, background: "#000" }}>
    <Audio src={staticFile("audio/funky-jazz.mp3")} volume={musicVolume} />

    <TransitionSeries>
      {shots.map((shot, i) => (
        <React.Fragment key={shot.id}>
          {i === 0 ? null : (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: shotTransitions[i] })}
            />
          )}
          <TransitionSeries.Sequence durationInFrames={shot.durationInFrames}>
            <ShotBlock shot={shot} />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
        <WifiEndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <ProgressBar />
  </AbsoluteFill>
);

export const WifiComposition: React.FC = () => (
  <Composition
    id="ProAdvancedWifi"
    component={WifiVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
