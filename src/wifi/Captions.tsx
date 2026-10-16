import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { captionPages } from "./edit";

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = captionPages.find((p) => frame >= p.start && frame < p.end);
  if (!page) return null;

  const enter = spring({ frame: frame - page.start, fps, config: { damping: 14, mass: 0.5 } });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1400,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 30,
          rowGap: 4,
          transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])}) translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
          opacity: interpolate(enter, [0, 1], [0, 1]),
        }}
      >
        {page.words.map((word, i) => {
          const next = page.words[i + 1];
          const active = frame >= word.start && (!next || frame < next.start);
          const spoken = frame >= word.start;
          const pop = spring({ frame: frame - word.start, fps, config: { damping: 12, mass: 0.4 } });
          return (
            <span
              key={i}
              style={{
                fontFamily: brand.fontFamily,
                fontWeight: 800,
                fontSize: 80,
                lineHeight: 1.12,
                textTransform: "uppercase",
                letterSpacing: -1,
                color: active ? "#ffd23f" : brand.colors.white,
                opacity: spoken ? 1 : 0.85,
                transform: `scale(${active ? interpolate(pop, [0, 1], [1, 1.05]) : 1})`,
                WebkitTextStroke: "14px #0b1a26",
                paintOrder: "stroke fill",
                textShadow: "0 8px 0 rgba(11,26,38,0.85)",
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
