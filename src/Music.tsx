import { Audio, interpolate, staticFile } from "remotion";
import { outroRange, totalDurationInFrames } from "./content";

/**
 * Trilha de fundo. Entra direto no nível de fundo e só cresce no fechamento,
 * onde não há mais fala.
 *
 * Os ganhos são baixos porque a trilha vem masterizada quente (pico em 0dB,
 * média -10,4dB) contra a fala em torno de -19dB. Em 0,05 ela fica em
 * -36,7dB, ou seja, cerca de 18dB abaixo da voz — a faixa confortável para
 * música sob narração é de 15 a 20dB.
 *
 * Não existe um degrau de entrada mais alto: o João começa a falar no
 * primeiro frame, então não há abertura instrumental para preencher, e um
 * degrau ali colocava o ponto mais alto da trilha exatamente em cima do
 * começo da fala.
 */
const UNDER_SPEECH = 0.05;
const OUTRO = 0.21;

export const Music: React.FC = () => {
  return (
    <Audio
      src={staticFile("audio/trilha.mp3")}
      volume={(frame) =>
        interpolate(
          frame,
          [
            0,
            20,
            outroRange.start - 30,
            outroRange.start,
            totalDurationInFrames - 20,
            totalDurationInFrames,
          ],
          [0, UNDER_SPEECH, UNDER_SPEECH, OUTRO, OUTRO, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};
