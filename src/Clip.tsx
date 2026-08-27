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
  const settle = spring({ frame, fps, durationInFrames: 18, config: { damping: 200, mass: 0.5 } });
  const punch = interpolate(settle, [0, 1], [framing.scale * 1.06, framing.scale]);

  // Deriva lenta ao longo do trecho, para nada ficar completamente estático.
  const drift = interpolate(frame, [0, durationInFrames], [0, 0.05], {
    extrapolateRight: "clamp",
  });

  // Respiro tipo câmera na mão, de amplitude baixa para não embrulhar.
  const swayX = Math.sin(frame / 46) * 3.5;
  const swayY = Math.cos(frame / 54) * 2.5;

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
 * Toca os trechos de fala do bloco em sequência: pula os silêncios longos e
 * troca de enquadramento em cada emenda, seja ela um corte de silêncio, uma
 * respirada ou a virada de um take para o outro.
 */
export const Clip: React.FC<{ clips: FootageClip[]; framingOffset?: number }> = ({
  clips,
  framingOffset = 0,
}) => {
  const pieces = clips.flatMap((clip) =>
    clip.segments.map((segment) => ({ file: clip.file, id: clip.id, segment })),
  );

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Series>
        {pieces.map((piece, i) => (
          <Series.Sequence
            key={`${piece.id}-${piece.segment.trimBefore}-${piece.segment.trimAfter}`}
            durationInFrames={piece.segment.trimAfter - piece.segment.trimBefore}
          >
            <SegmentView
              file={piece.file}
              segment={piece.segment}
              framingIndex={framingOffset + i}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
