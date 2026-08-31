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

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const at = (delay: number, damping = 16) =>
    spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 } });

  const logo = at(0, 15);
  const product = at(12);
  const cta = at(26);
  const site = at(38);

  return (
    <AbsoluteFill>
      <BrandBackdrop>
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: "50%",
            transform: "translateX(-50%) rotate(180deg)",
            opacity: 0.12,
          }}
        >
          <WifiArcs size={1400} color={wispot.white} />
        </div>
      </BrandBackdrop>

      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 42 }}
      >
        <Img
          src={staticFile(wispot.logo.white)}
          style={{
            width: 560,
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.86, 1])})`,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: product,
            transform: `translateY(${interpolate(product, [0, 1], [18, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 54,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.55)",
            }}
          />
          <div
            style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 78,
              letterSpacing: -1.6,
              color: wispot.white,
            }}
          >
            WiQuest
          </div>
          <div
            style={{
              width: 54,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.55)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 6,
            maxWidth: 800,
            textAlign: "center",
            fontFamily: font,
            fontWeight: 700,
            fontSize: 42,
            lineHeight: 1.25,
            color: "rgba(255,255,255,0.94)",
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [16, 0])}px)`,
          }}
        >
          Fale com a gente e transforme a opinião do seu cliente em decisão que
          gera resultado.
        </div>

        <div
          style={{
            marginTop: 14,
            padding: "20px 52px",
            borderRadius: 999,
            background: wispot.white,
            fontFamily: font,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 0.4,
            color: wispot.blueDeep,
            opacity: site,
            transform: `scale(${interpolate(site, [0, 1], [0.92, 1])})`,
            boxShadow: "0 22px 54px rgba(3,32,46,0.32)",
          }}
        >
          {wispot.site}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
