import React from "react";
import { AbsoluteFill, OffthreadVideo, Series, interpolate, staticFile } from "remotion";
import { JOIN_FADE_FRAMES, clips, takeDuration, type ScriptClip, type Take } from "./takes";

const TakeClip: React.FC<{ take: Take }> = ({ take }) => {
  const duration = takeDuration(take);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile(take.source)}
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

const TakeSeries: React.FC<{ takes: Take[] }> = ({ takes }) => {
  return (
    <Series>
      {takes.map((take, i) => (
        <Series.Sequence key={`${take.source}-${take.from}-${i}`} durationInFrames={takeDuration(take)}>
          <TakeClip take={take} />
        </Series.Sequence>
      ))}
    </Series>
  );
};

/**
 * Um bloco do roteiro: os takes certos, na ordem, sem nenhuma arte por cima.
 * É o que serve pra aprovar os cortes antes de montar.
 */
export const RawCut: React.FC<{ clip: ScriptClip }> = ({ clip }) => {
  return <TakeSeries takes={clip.takes} />;
};

/** Todos os blocos emendados, pra ver o vídeo inteiro de ponta a ponta. */
export const FullRawCut: React.FC = () => {
  return <TakeSeries takes={clips.flatMap((clip) => clip.takes)} />;
};
