import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Insert do bloco 1: a demo oficial do WiQuest ("Use a sua marca."), fornecida
 * pelo cliente. Entra em tela cheia com o áudio da Mari correndo por baixo.
 *
 * A peça original tem 23,4 s e percorre cinco cores de marca. A janela usada
 * começa em 1,5 s — depois da abertura do logo, com a tela rosa já montada — e
 * pega a virada para o azul, que é onde a pergunta aparece na tela. Assim o
 * insert mostra duas marcas diferentes sem precisar acelerar a animação.
 */
const TRIM_BEFORE = Math.round(1.5 * 30);

export const BrandDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, background: "#eef1f4" }}>
      <OffthreadVideo
        src={staticFile("wiquest/videos/wiquest-demo.mp4")}
        trimBefore={TRIM_BEFORE}
        trimAfter={TRIM_BEFORE + durationInFrames}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
