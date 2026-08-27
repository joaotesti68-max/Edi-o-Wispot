import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

/**
 * Quebra o headline em torno do trecho destacado, para colorir só ele sem
 * perder a quebra de linha natural do parágrafo.
 */
const split = (headline: string, highlight?: string) => {
  if (!highlight) return [{ text: headline, lit: false }];
  const at = headline.indexOf(highlight);
  if (at === -1) return [{ text: headline, lit: false }];
  return [
    { text: headline.slice(0, at), lit: false },
    { text: highlight, lit: true },
    { text: headline.slice(at + highlight.length), lit: false },
  ].filter((part) => part.text.length > 0);
};

export const Headline: React.FC<{ kicker: string; headline: string; highlight?: string }> = ({
  kicker,
  headline,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({ frame: frame - 4, fps, config: { damping: 16, mass: 0.6 } });
  const headlineIn = spring({ frame: frame - 9, fps, config: { damping: 16, mass: 0.7 } });
  const sweep = interpolate(frame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(kickerIn, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(kickerIn, [0, 1], [-18, 0])}px)`,
        }}
      >
        <div style={{ width: 34, height: 4, background: brand.colors.primaryLight, borderRadius: 2 }} />
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: brand.colors.primaryLight,
          }}
        >
          {kicker}
        </div>
      </div>

      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.1,
          color: brand.colors.white,
          letterSpacing: -0.6,
          textShadow: "0 4px 24px rgba(0,0,0,0.4)",
          opacity: interpolate(headlineIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headlineIn, [0, 1], [28, 0])}px)`,
        }}
      >
        {split(headline, highlight).map((part) =>
          part.lit ? (
            <span key={part.text} style={{ position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ position: "relative", zIndex: 1 }}>{part.text}</span>
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  bottom: 2,
                  height: 14,
                  background: brand.colors.primary,
                  borderRadius: 4,
                  transformOrigin: "left center",
                  transform: `scaleX(${sweep})`,
                }}
              />
            </span>
          ) : (
            <span key={part.text}>{part.text}</span>
          ),
        )}
      </div>
    </div>
  );
};
