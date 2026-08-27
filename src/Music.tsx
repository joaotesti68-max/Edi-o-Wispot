import { Audio, interpolate, staticFile } from "remotion";
import { outroRange, totalDurationInFrames } from "./content";

/**
 * Trilha de fundo com dinâmica: entra presente, recua para não disputar com
 * a fala do João e volta a crescer no fechamento, onde entra a chamada.
 *
 * Os ganhos são baixos porque a trilha vem masterizada quente (pico em 0dB,
 * média -10,4dB) enquanto a fala está normalizada em -16 LUFS. Sob a voz ela
 * fica em torno de -32dB, que é presença sem disputa.
 */
const INTRO = 0.15;
const UNDER_SPEECH = 0.085;
const OUTRO = 0.3;

export const Music: React.FC = () => {
  return (
    <Audio
      src={staticFile("audio/trilha.mp3")}
      volume={(frame) =>
        interpolate(
          frame,
          [
            0,
            25,
            58,
            outroRange.start - 30,
            outroRange.start,
            totalDurationInFrames - 20,
            totalDurationInFrames,
          ],
          [0, INTRO, UNDER_SPEECH, UNDER_SPEECH, OUTRO, OUTRO, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};
