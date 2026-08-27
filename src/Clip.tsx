import {
  AbsoluteFill,
  OffthreadVideo,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { FootageClip, FootageSegment } from "./footage";

/**
 * Enquadramentos alternados. Cada corte de silêncio troca de escala e de
 * posição: é o jump cut clássico — a mudança disfarça a emenda e dá
 * movimento a uma gravação parada.
 */
const FRAMINGS = [
  { scale: 1.05, x: 0, y: 0 },
  { scale: 1.17, x: -26, y: -18 },
  { scale: 1.09, x: 20, y: 10 },
  { scale: 1.22, x: -12, y: 20 },
];

const SegmentView: React.FC<{
  file: string;
  segment: FootageSegment;
  framingIndex: number;
}> = ({ file, segment, framingIndex }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framing = FRAMINGS[framingIndex % FRAMINGS.length];

  // Assentamento curto no corte: entra um pouco maior e acomoda.
  const settle = spring({ frame, fps, durationInFrames: 14, config: { damping: 200, mass: 0.5 } });
  const punch = interpolate(settle, [0, 1], [framing.scale * 1.06, framing.scale]);

  // Deriva lenta ao longo do trecho, para nada ficar completamente estático.
  const drift = interpolate(frame, [0, durationInFrames], [0, 0.05], {
    extrapolateRight: "clamp",
  });

  // Respiro tipo câmera na mão, de amplitude baixa para não embrulhar.
  const swayX = Math.sin(frame / 37) * 3.5;
  const swayY = Math.cos(frame / 43) * 2.5;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${punch + drift}) translate(${framing.x + swayX}px, ${framing.y + swayY}px)`,
      }}
    >
      <OffthreadVideo
        src={staticFile(file)}
        trimBefore={segment.trimBefore}
        trimAfter={segment.trimAfter}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

/**
 * Toca os trechos de fala do clipe em sequência, pulando os silêncios longos
 * que o prepare-footage detectou.
 */
export const Clip: React.FC<{ clip: FootageClip; framingOffset?: number }> = ({
  clip,
  framingOffset = 0,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Series>
        {clip.segments.map((segment, i) => (
          <Series.Sequence
            key={`${segment.trimBefore}-${segment.trimAfter}`}
            durationInFrames={segment.trimAfter - segment.trimBefore}
          >
            <SegmentView file={clip.file} segment={segment} framingIndex={framingOffset + i} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
