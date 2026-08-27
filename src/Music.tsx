import { Audio, interpolate, staticFile } from "remotion";
import { outroRange, totalDurationInFrames } from "./content";

/**
 * Trilha de fundo com dinâmica: entra presente, recua para não disputar com
 * a fala do João e volta a crescer no fechamento, onde entra a chamada.
 */
export const Music: React.FC = () => {
  return (
    <Audio
      src={staticFile("audio/theme.mp3")}
      volume={(frame) =>
        interpolate(
          frame,
          [0, 25, 58, outroRange.start - 30, outroRange.start, totalDurationInFrames - 20, totalDurationInFrames],
          [0, 0.34, 0.17, 0.17, 0.36, 0.36, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};
