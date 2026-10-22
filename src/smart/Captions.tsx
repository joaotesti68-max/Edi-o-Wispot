import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { captions } from "./captionWords";
import { at, endOf } from "./edit";
import { pa } from "./theme";

type Chunk = { words: { text: string; start: number }[]; start: number; end: number };

// Chunks in absolute frames; each holds until the next one in its take.
const chunks: Chunk[] = Object.entries(captions).flatMap(([id, list]) =>
  list.map((words, i) => {
    const mapped = words.map(([text, sec]) => ({ text, start: at(id, sec) }));
    const next = list[i + 1];
    return {
      words: mapped,
      start: mapped[0].start,
      end: next ? at(id, next[0][1]) : endOf(id),
    };
  }),
).filter((c) => c.words.some((w) => w.text !== ""));

// Word-by-word captions sitting just below João's chin.
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunk = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const s = spring({ frame: frame - chunk.start, fps, config: { damping: 13, mass: 0.5 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1095,
        left: 40,
        right: 40,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 30px",
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {chunk.words.map((w, i) => {
        const active = frame >= w.start && (i + 1 >= chunk.words.length || frame < chunk.words[i + 1].start);
        const pop = spring({ frame: frame - w.start, fps, config: { damping: 12, mass: 0.4 } });
        return (
          <span
            key={i}
            style={{
              fontFamily: pa.font,
              fontWeight: 800,
              fontSize: 72,
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              color: active ? pa.cyan : pa.white,
              WebkitTextStroke: "12px #0a1520",
              paintOrder: "stroke fill",
              textShadow: "0 8px 24px rgba(0,0,0,0.5)",
              display: "inline-block",
              transform: `scale(${active ? interpolate(pop, [0, 1], [1.18, 1.03]) : 1})`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
