import React from "react";
import { Composition } from "remotion";
import { FullRawCut, RawCut } from "./RawCut";
import { JoaoVideo } from "./FinalVideo";
import {
  JOAO_FPS,
  JOAO_HEIGHT,
  JOAO_WIDTH,
  clipDuration,
  clips,
  finalDuration,
  totalDuration,
} from "./takes";

export const JoaoCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="JoaoPSI"
        component={JoaoVideo}
        durationInFrames={finalDuration}
        fps={JOAO_FPS}
        width={JOAO_WIDTH}
        height={JOAO_HEIGHT}
      />
      <Composition
        id="Joao-00-completo"
        component={FullRawCut}
        durationInFrames={totalDuration}
        fps={JOAO_FPS}
        width={JOAO_WIDTH}
        height={JOAO_HEIGHT}
      />
      {clips.map((clip, i) => (
        <Composition
          key={clip.id}
          id={`Joao-${String(i + 1).padStart(2, "0")}-${clip.id}`}
          component={RawCut}
          defaultProps={{ clip }}
          durationInFrames={clipDuration(clip)}
          fps={JOAO_FPS}
          width={JOAO_WIDTH}
          height={JOAO_HEIGHT}
        />
      ))}
    </>
  );
};
