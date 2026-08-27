import { AbsoluteFill, OffthreadVideo, Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { FootageClip, FootageSegment } from "./footage";
import { totalDurationInFrames } from "./content";

/**
 * Aproximação lenta e contínua ao longo do vídeo inteiro. A escala é função
 * do frame absoluto da composição, não do trecho: assim os cortes de silêncio
 * e as viradas de take não mudam o enquadramento, e o movimento nunca salta
 * nem oscila — só se aproxima.
 */
const ZOOM_FROM = 1.02;
const ZOOM_TO = 1.16;

const SegmentView: React.FC<{
  file: string;
  segment: FootageSegment;
  /** Frame da composição em que este trecho começa. */
  absoluteStart: number;
}> = ({ file, segment, absoluteStart }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    absoluteStart + frame,
    [0, totalDurationInFrames],
    [ZOOM_FROM, ZOOM_TO],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
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
 * Toca os trechos de fala do bloco em sequência, pulando os silêncios longos.
 */
export const Clip: React.FC<{ clips: FootageClip[]; blockStart: number }> = ({
  clips,
  blockStart,
}) => {
  const pieces = clips.flatMap((clip) =>
    clip.segments.map((segment) => ({ file: clip.file, id: clip.id, segment })),
  );

  let offset = 0;
  const timed = pieces.map((piece) => {
    const duration = piece.segment.trimAfter - piece.segment.trimBefore;
    const absoluteStart = blockStart + offset;
    offset += duration;
    return { ...piece, duration, absoluteStart };
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Series>
        {timed.map((piece) => (
          <Series.Sequence
            key={`${piece.id}-${piece.segment.trimBefore}-${piece.segment.trimAfter}`}
            durationInFrames={piece.duration}
          >
            <SegmentView
              file={piece.file}
              segment={piece.segment}
              absoluteStart={piece.absoluteStart}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
