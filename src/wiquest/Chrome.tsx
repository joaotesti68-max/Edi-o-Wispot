import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { wispot, font } from "./brand";
import {
  END_START,
  NAME_CARD,
  NAME_CARD_FRAMES,
  NAME_CARD_FROM,
  blockRanges,
} from "./content";

/** Barra de progresso por bloco + assinatura da marca, presentes o vídeo todo. */
export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [END_START - 14, END_START], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  if (opacity <= 0) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 56,
          right: 56,
          display: "flex",
          gap: 10,
        }}
      >
        {blockRanges.map((range) => {
          const fill = interpolate(
            frame,
            [range.from, range.from + range.durationInFrames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={range.id}
              style={{
                flex: range.durationInFrames,
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.30)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  background: wispot.white,
                  borderRadius: 3,
                }}
              />
            </div>
          );
        })}
      </div>

      <Img
        src={staticFile(wispot.logo.wordmarkWhite)}
        style={{
          position: "absolute",
          top: 74,
          right: 56,
          width: 210,
          opacity: 0.92,
        }}
      />
    </AbsoluteFill>
  );
};

/** Etiqueta com o nome de quem apresenta, só na entrada. */
export const NameCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - NAME_CARD_FROM;

  if (local < 0 || local > NAME_CARD_FRAMES) {
    return null;
  }

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 16, mass: 0.7 },
  });
  const opacity = interpolate(
    local,
    [0, 8, NAME_CARD_FRAMES - 12, NAME_CARD_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 148,
        left: 56,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 24px 12px 16px",
        borderRadius: 14,
        background: "rgba(6,26,36,0.55)",
        border: "1px solid rgba(255,255,255,0.16)",
        opacity,
        transform: `translateX(${interpolate(enter, [0, 1], [-22, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 5,
          height: 30,
          borderRadius: 3,
          background: wispot.blue,
        }}
      />
      <div
        style={{
          fontFamily: font,
          fontWeight: 700,
          fontSize: 34,
          color: wispot.white,
        }}
      >
        {NAME_CARD}
      </div>
    </div>
  );
};
