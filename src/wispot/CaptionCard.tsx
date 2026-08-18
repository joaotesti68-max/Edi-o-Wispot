import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import type { Caption } from "./series";

const CAPTION_TRANSITION = 6;

// Centered closed-caption "pill" that hugs its text, not a full-width
// bottom-left headline block — a different paradigm from ProAdvanced's
// large left-aligned display type, not just a restyle of the same shape.
export const CaptionCard: React.FC<{ captions: Caption[]; kicker?: string }> = ({ captions, kicker }) => {
  const frame = useCurrentFrame();

  const kickerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stay fully visible through the whole real speech span (startFrame to
  // endFrame come straight from the transcript timing) and only fade out
  // *after* she stops talking — fading beforehand made captions vanish
  // while she was still mid-word.
  const active = captions.find(
    (c) => frame >= c.startFrame - CAPTION_TRANSITION && frame <= c.endFrame + CAPTION_TRANSITION,
  );

  let captionOpacity = 0;
  let captionScale = 0.94;
  if (active) {
    captionOpacity = interpolate(
      frame,
      [active.startFrame - CAPTION_TRANSITION, active.startFrame, active.endFrame, active.endFrame + CAPTION_TRANSITION],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    captionScale = interpolate(frame, [active.startFrame - CAPTION_TRANSITION, active.startFrame], [0.94, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 168,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      {kicker ? (
        <div
          style={{
            opacity: kickerOpacity,
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 19,
            color: brand.colors.white,
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {kicker}
        </div>
      ) : null}

      {active ? (
        <div
          style={{
            opacity: captionOpacity,
            transform: `scale(${captionScale})`,
            maxWidth: 780,
            background: "rgba(0,0,0,0.62)",
            borderRadius: 28,
            padding: "20px 40px",
          }}
        >
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1.28,
              color: brand.colors.white,
              textAlign: "center",
              letterSpacing: -0.2,
            }}
          >
            {active.text}
          </div>
        </div>
      ) : null}
    </div>
  );
};
