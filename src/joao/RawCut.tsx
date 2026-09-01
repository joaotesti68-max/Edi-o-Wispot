import React from "react";
import { AbsoluteFill, OffthreadVideo, Series, interpolate, staticFile } from "remotion";
import { JOIN_FADE_FRAMES, takeDuration, type ScriptClip, type Take } from "./takes";

const TakeClip: React.FC<{ source: string; take: Take }> = ({ source, take }) => {
  const duration = takeDuration(take);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile(source)}
        trimBefore={take.from}
        trimAfter={take.to}
        // Emenda seca no vídeo, mas com um fade curtíssimo no áudio pra não
        // estalar quando um take entra no outro.
        volume={(frame) =>
          interpolate(
            frame,
            [0, JOIN_FADE_FRAMES, duration - JOIN_FADE_FRAMES, duration],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

/**
 * Só o material bruto já cortado: os takes certos, na ordem do roteiro, sem
 * nenhuma arte por cima. É o que serve pra aprovar os cortes antes de montar.
 */
export const RawCut: React.FC<{ clip: ScriptClip }> = ({ clip }) => {
  return (
    <Series>
      {clip.takes.map((take, i) => (
        <Series.Sequence key={`${take.from}-${i}`} durationInFrames={takeDuration(take)}>
          <TakeClip source={clip.source} take={take} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
