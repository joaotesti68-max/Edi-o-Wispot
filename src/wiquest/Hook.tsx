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
import { BrandBackdrop, WifiArcs } from "./ui";

const LINE = [
  "Você",
  "sabe",
  "o",
  "que",
  "o",
  "seu",
  "cliente",
  "achou",
  "da",
  "visita",
  "de",
  "hoje?",
];

/**
 * Abertura do roteiro. Não veio take de voz para esse trecho, então ele entra
 * como cartela tipográfica — a pergunta é o gancho e funciona lida.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const arcs = spring({
    frame: frame - 2,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const pulse = (i: number) =>
    interpolate((frame - i * 5) % 46, [0, 12, 30], [0.35, 1, 0.35], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const punch = spring({
    frame: frame - 52,
    fps,
    config: { damping: 13, mass: 0.8 },
  });
  const punchOpacity = interpolate(frame, [52, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 7, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <BrandBackdrop deep>
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: `translateX(-50%) scale(${interpolate(arcs, [0, 1], [0.8, 1])})`,
            opacity: 0.16,
          }}
        >
          <WifiArcs
            size={1500}
            color={wispot.white}
            opacity={[pulse(0), pulse(1), pulse(2)]}
          />
        </div>
      </BrandBackdrop>

      <AbsoluteFill
        style={{
          padding: "0 92px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0 22px",
            fontFamily: font,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 1.1,
            letterSpacing: -2,
            color: wispot.white,
          }}
        >
          {LINE.map((word, i) => {
            const w = spring({
              frame: frame - 6 - i * 2.4,
              fps,
              config: { damping: 18, mass: 0.5 },
            });
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  opacity: w,
                  transform: `translateY(${interpolate(w, [0, 1], [30, 0])}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 46,
            alignSelf: "flex-start",
            padding: "18px 38px",
            borderRadius: 20,
            background: wispot.white,
            opacity: punchOpacity,
            transform: `scale(${interpolate(punch, [0, 1], [0.86, 1])}) rotate(${interpolate(punch, [0, 1], [-2.5, 0])}deg)`,
            boxShadow: "0 26px 60px rgba(3,32,46,0.42)",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 70,
              letterSpacing: -1.6,
              whiteSpace: "nowrap",
              color: wispot.blueDeep,
            }}
          >
            Ou apenas imagina?
          </div>
        </div>
      </AbsoluteFill>

      <Img
        src={staticFile(wispot.logo.wordmarkWhite)}
        style={{
          position: "absolute",
          bottom: 132,
          left: 92,
          width: 250,
          opacity: interpolate(frame, [62, 78], [0, 0.95], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
