import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import type { Caption } from "./series";

const CAPTION_TRANSITION = 10;

// Borderless, left-marker caption style (no boxed card) — reads as native
// social captioning rather than a bordered lower-third.
export const CaptionCard: React.FC<{ captions: Caption[]; kicker: string }> = ({ captions, kicker }) => {
  const frame = useCurrentFrame();

  const kickerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const active = captions.find((c) => frame >= c.startFrame - CAPTION_TRANSITION && frame <= c.endFrame);

  let captionOpacity = 0;
  let captionShift = 18;
  if (active) {
    const inEnd = active.startFrame;
    const outStart = active.endFrame - CAPTION_TRANSITION;
    captionOpacity = interpolate(
      frame,
      [active.startFrame - CAPTION_TRANSITION, inEnd, outStart, active.endFrame],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    captionShift = interpolate(frame, [active.startFrame - CAPTION_TRANSITION, inEnd], [18, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 52,
        right: 64,
        bottom: 128,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: kickerOpacity,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 20,
          color: brand.colors.accent,
          letterSpacing: 1,
        }}
      >
        {"// " + kicker.toUpperCase()}
      </div>

      {active ? (
        <div
          style={{
            opacity: captionOpacity,
            transform: `translateY(${captionShift}px)`,
            display: "flex",
            gap: 16,
          }}
        >
          <div style={{ width: 6, flexShrink: 0, background: brand.colors.accent, borderRadius: 3 }} />
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.2,
              color: brand.colors.white,
              letterSpacing: -0.4,
              textShadow: "0 2px 18px rgba(0,0,0,0.5)",
            }}
          >
            {active.text}
          </div>
        </div>
      ) : null}
    </div>
  );
};
