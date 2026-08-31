import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { PlacedShot } from "./content";

const AUDIO_FADE = 3;

/**
 * Um take já cortado. Os cortes de silêncio deixam saltos de imagem, então
 * takes vizinhos alternam entre enquadramento cheio e um leve punch-in — o
 * corte passa a ler como intenção de edição, não como falha.
 */
export const Shot: React.FC<{ shot: PlacedShot; isBlockOpener: boolean }> = ({
  shot,
  isBlockOpener,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = shot;

  const base = shot.shotIndex % 2 === 0 ? 1 : 1.05;
  const drift = interpolate(frame, [0, durationInFrames], [0, 0.022], {
    extrapolateRight: "clamp",
  });
  const scale = base + drift;

  // Abertura de bloco entra com um respiro; cortes internos são secos.
  const openIn = isBlockOpener
    ? interpolate(frame, [0, 5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const volume = (f: number) =>
    shot.gain *
    interpolate(
      f,
      [0, AUDIO_FADE, durationInFrames - AUDIO_FADE, durationInFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <AbsoluteFill style={{ background: "#04141c" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale * (isBlockOpener ? interpolate(openIn, [0, 1], [1.03, 1]) : 1)})`,
          opacity: openIn,
        }}
      >
        <OffthreadVideo
          src={staticFile(shot.video)}
          trimBefore={shot.trimBefore}
          trimAfter={shot.trimAfter}
          volume={volume}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Scrim para o texto respirar em cima da imagem. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,20,28,0.42) 0%, rgba(4,20,28,0) 22%, rgba(4,20,28,0) 52%, rgba(4,20,28,0.62) 80%, rgba(4,20,28,0.86) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
