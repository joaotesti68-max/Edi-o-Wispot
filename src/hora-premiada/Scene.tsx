import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import { SPEED, type Clip } from "./content";

/** Persistent Wispot mark, kept clear of the speaker per the manual's clearance rule. */
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 0.92], { extrapolateRight: "clamp" });
  return (
    <Img
      src={staticFile(brand.logo.white)}
      style={{ position: "absolute", top: 92, right: 64, width: 210, opacity }}
    />
  );
};

const NameCard: React.FC<{ name: string }> = ({ name }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame: frame - 12, fps, config: { damping: 17, mass: 0.7 } });
  const opacity = interpolate(frame, [12, 24, 100, 116], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 64,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 26px 14px 18px",
        borderRadius: 999,
        background: "rgba(5,26,38,0.62)",
        backdropFilter: "blur(10px)",
        opacity,
        transform: `translateX(${interpolate(entry, [0, 1], [-22, 0])}px)`,
      }}
    >
      <div style={{ width: 6, height: 30, borderRadius: 999, background: brand.colors.blue }} />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 34,
          color: brand.colors.white,
          letterSpacing: -0.2,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export const Scene: React.FC<{
  clip: Clip;
  nameCard?: string;
  children?: React.ReactNode;
}> = ({ clip, nameCard, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const base = clip.zoom ?? 1;
  const kenBurns = interpolate(frame, [0, durationInFrames], [base, base * 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
        <OffthreadVideo
          src={staticFile(clip.video)}
          playbackRate={SPEED}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Legibility scrim: the speaker stays clean, the lower third goes dark. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,26,38,0.55) 0%, rgba(5,26,38,0) 22%, rgba(5,26,38,0) 42%, rgba(5,26,38,0.74) 74%, rgba(3,18,27,0.93) 100%)",
        }}
      />

      <Watermark />
      {nameCard ? <NameCard name={nameCard} /> : null}

      {children}
    </AbsoluteFill>
  );
};
