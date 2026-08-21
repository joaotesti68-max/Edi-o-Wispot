import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import { captions } from "./captions";

/**
 * Word-by-word captions: the whole phrase stays on screen while the word being
 * spoken right now is highlighted in the brand blue.
 */
export const Captions: React.FC<{ captionKey: string }> = ({ captionKey }) => {
  const frame = useCurrentFrame();
  const chunks = captions[captionKey] ?? [];

  const chunk = chunks.find((c) => frame >= c.from && frame < c.to);
  if (!chunk) {
    return null;
  }

  // Chunks follow each other back to back, so the entrance is a quick pop
  // rather than a fade — a slow fade would read as a flicker between phrases.
  const local = frame - chunk.from;
  const opacity = interpolate(local, [0, 2], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(local, [0, 5], [0.965, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        bottom: 300,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 18px",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {chunk.words.map((word, i) => {
        const active = frame >= word.from && frame < word.to;
        return (
          <span
            key={i}
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 800,
              fontSize: 68,
              lineHeight: 1.22,
              letterSpacing: -0.5,
              color: active ? brand.colors.primaryLight : brand.colors.white,
              textShadow: "0 6px 26px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.45)",
              transition: "none",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
