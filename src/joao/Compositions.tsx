import React from "react";
import { Composition } from "remotion";
import { RawCut } from "./RawCut";
import { JOAO_FPS, JOAO_HEIGHT, JOAO_WIDTH, clipDuration, clips } from "./takes";

export const JoaoCompositions: React.FC = () => {
  return (
    <>
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
