import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { theme, useEnter } from "./ui";

export const BackupEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(0, 15, 0.7);
  const cta = useEnter(14, 16);
  const site = useEnter(26, 16);
  const tags = useEnter(36, 16);

  return (
    <AbsoluteFill
      style={{ background: brand.gradient, alignItems: "center", justifyContent: "center" }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 34%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}
      >
        <Img
          src={staticFile(brand.logo.white)}
          style={{
            width: 580,
            opacity: interpolate(logo, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(logo, [0, 1], [0.84, 1])})`,
          }}
        />

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 48,
            color: theme.white,
            textAlign: "center",
            lineHeight: 1.18,
            letterSpacing: -0.8,
            opacity: interpolate(cta, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(cta, [0, 1], [18, 0])}px)`,
          }}
        >
          Conheça nossa estrutura
          <br />
          de data center
        </div>

        <div
          style={{
            opacity: interpolate(site, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(site, [0, 1], [0.94, 1])})`,
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 34,
            color: brand.colors.ink,
            background: theme.white,
            borderRadius: 999,
            padding: "18px 44px",
          }}
        >
          {brand.site}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            opacity: interpolate(tags, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(tags, [0, 1], [14, 0])}px)`,
          }}
        >
          {["Backup", "Data Center", "Hosting", "Colocation"].map((t) => (
            <div
              key={t}
              style={{
                fontFamily: brand.fontFamily,
                fontWeight: 700,
                fontSize: 24,
                color: theme.white,
                border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: 999,
                padding: "10px 20px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <AbsoluteFill
        style={{
          background: "#000",
          opacity: interpolate(frame, [80, 96], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
