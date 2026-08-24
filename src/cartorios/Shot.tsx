import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "./theme";

/**
 * A gravação foi feita com bastante espaço acima da cabeça, então todo plano
 * entra com um leve avanço de câmera e é deslocado para baixo — o rosto sobe
 * para o terço superior e a sobra de teto sai do quadro. O avanço cresce
 * devagar ao longo do bloco para o plano não ficar parado.
 */
const PUNCH_IN = 1.12;
const PUNCH_OUT = 1.17;
const DROP_PX = 70;

export const Shot: React.FC<{ video: string; frames: number }> = ({ video, frames }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], [PUNCH_IN, PUNCH_OUT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.color.navy }}>
      <AbsoluteFill style={{ transform: `translateY(${DROP_PX}px) scale(${scale})` }}>
        <OffthreadVideo
          src={staticFile(video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Vinheta suave: fecha os cantos e mantém o olho no centro do quadro. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 52% at 50% 42%, rgba(0,0,0,0) 46%, rgba(4,10,14,0.34) 100%)",
        }}
      />

      <AbsoluteFill style={{ background: theme.footerScrim }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 300,
          background: theme.headerScrim,
        }}
      />
    </AbsoluteFill>
  );
};
