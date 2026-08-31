import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { wispot, font } from "./brand";
import type { Caption } from "./content";

/** Lower third com a ideia-chave do trecho que está sendo falado. */
export const CaptionCard: React.FC<{ caption: Caption }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { durationInFrames } = caption;

  const enter = spring({ frame, fps, config: { damping: 17, mass: 0.75 } });
  const opacity = interpolate(
    frame,
    [0, 7, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shift = interpolate(enter, [0, 1], [34, 0]);
  const barScale = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 190,
        opacity,
        transform: `translateY(${shift}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 64,
            height: 6,
            borderRadius: 3,
            background: wispot.blue,
            transform: `scaleX(${barScale})`,
            transformOrigin: "left center",
          }}
        />
        {caption.kicker ? (
          <div
            style={{
              fontFamily: font,
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: 2.6,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {caption.kicker}
          </div>
        ) : null}
      </div>

      <div
        style={{
          fontFamily: font,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.06,
          letterSpacing: -1.2,
          color: wispot.white,
          textShadow: "0 6px 28px rgba(2,18,26,0.55)",
        }}
      >
        {caption.title}
      </div>

      {caption.accent ? (
        <div
          style={{
            marginTop: 12,
            fontFamily: font,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: -0.6,
            color: wispot.blue,
            textShadow: "0 4px 22px rgba(2,18,26,0.5)",
            opacity: interpolate(frame, [10, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {caption.accent}
        </div>
      ) : null}
    </div>
  );
};
