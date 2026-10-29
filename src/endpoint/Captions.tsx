import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { pa } from "./theme";
import { words } from "./words";

type Chunk = { start: number; end: number; words: { text: string; start: number }[] };

// Groups the take's words into short lines (max 3 words, breaking on
// punctuation) and maps them onto the cut scene's frames.
const chunksFor = (scene: Scene): Chunk[] => {
  const list = words[scene.id] ?? [];
  const chunks: Chunk[] = [];
  let cur: Chunk | null = null;
  list.forEach(([a, b, text], i) => {
    const start = toSceneFrame(scene, a);
    if (!cur) cur = { start, end: 0, words: [] };
    cur.words.push({ text, start });
    cur.end = toSceneFrame(scene, b);
    const next = list[i + 1];
    const breakHere =
      /[,.?!]$/.test(text) || cur.words.length >= 3 || !next || next[0] - b > 0.3;
    if (breakHere) {
      chunks.push(cur);
      cur = null;
    }
  });
  // Each line stays up until the next one starts.
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.end = next ? next.start : Math.min(scene.durationInFrames, c.end + 10);
  });
  return chunks;
};

export const Captions: React.FC<{ scene: Scene; top: number }> = ({ scene, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunk = chunksFor(scene).find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const pop = spring({ frame: frame - chunk.start, fps, config: { damping: 14, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 14px",
        fontFamily: pa.font,
        fontWeight: 800,
        fontSize: 68,
        lineHeight: 1.15,
        textTransform: "uppercase",
        transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`,
        opacity: pop,
      }}
    >
      {chunk.words.map((w, i) => {
        const active =
          frame >= w.start && (i + 1 >= chunk.words.length || frame < chunk.words[i + 1].start);
        return (
          <span
            key={i}
            style={{
              color: pa.white,
              padding: "2px 14px",
              borderRadius: 14,
              background: active ? pa.blue : "transparent",
              textShadow: active
                ? "none"
                : "0 3px 0 rgba(28,63,87,0.9), 0 0 18px rgba(28,63,87,0.75)",
              boxShadow: active ? "0 8px 24px rgba(28,63,87,0.35)" : "none",
            }}
          >
            {w.text.replace(/[,.]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
