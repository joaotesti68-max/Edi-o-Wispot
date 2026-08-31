import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { wispot, font } from "../brand";
import { BoltIcon, BrandBackdrop, CheckIcon, CloseIcon, MailIcon } from "../ui";

/** Insert: agora, com a experiência fresca — e não três dias depois por e-mail. */
export const SpeedCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const now = spring({
    frame: frame - 4,
    fps,
    config: { damping: 18, mass: 0.8 },
  });
  const later = spring({
    frame: frame - 22,
    fps,
    config: { damping: 18, mass: 0.8 },
  });
  const stamp = spring({
    frame: frame - 46,
    fps,
    config: { damping: 11, mass: 0.6 },
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <BrandBackdrop deep />

      <AbsoluteFill
        style={{ padding: "0 76px", justifyContent: "center", gap: 54 }}
      >
        <div
          style={{
            fontFamily: font,
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: 2.6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.8)",
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Quando a resposta chega
        </div>

        {/* WiQuest — agora */}
        <div
          style={{
            background: wispot.white,
            borderRadius: 40,
            padding: "54px 52px",
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: now,
            transform: `translateX(${interpolate(now, [0, 1], [-70, 0])}px)`,
            boxShadow: "0 30px 70px rgba(3,32,46,0.36)",
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 28,
              background: wispot.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BoltIcon size={54} color={wispot.white} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: wispot.blue,
              }}
            >
              WiQuest
            </div>
            <div
              style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 64,
                letterSpacing: -1.4,
                lineHeight: 1.05,
                color: wispot.ink,
              }}
            >
              Em segundos
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: font,
                fontWeight: 700,
                fontSize: 33,
                color: wispot.gray,
              }}
            >
              com a experiência ainda fresca
            </div>
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "#1c8f5a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transform: `scale(${interpolate(now, [0, 1], [0.4, 1])})`,
            }}
          >
            <CheckIcon size={38} strokeWidth={3.4} />
          </div>
        </div>

        {/* E-mail — três dias depois */}
        <div
          style={{
            position: "relative",
            background: "rgba(4,32,45,0.30)",
            border: "1.5px solid rgba(255,255,255,0.20)",
            borderRadius: 40,
            padding: "54px 52px",
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: interpolate(later, [0, 1], [0, 0.9]),
            transform: `translateX(${interpolate(later, [0, 1], [70, 0])}px) rotate(-1.2deg)`,
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 28,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MailIcon size={54} color="rgba(255,255,255,0.85)" />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Pesquisa por e-mail
            </div>
            <div
              style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 64,
                letterSpacing: -1.4,
                lineHeight: 1.05,
                color: wispot.white,
              }}
            >
              Três dias depois
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: font,
                fontWeight: 700,
                fontSize: 32,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              quando a visita já passou
            </div>
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transform: `scale(${interpolate(stamp, [0, 1], [1.8, 1])})`,
              opacity: stamp,
            }}
          >
            <CloseIcon size={38} strokeWidth={3.4} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
