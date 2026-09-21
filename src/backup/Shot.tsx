import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import { Graphic } from "./graphics";
import { Headline, Watermark, theme, useEnter } from "./ui";
import type { Shot } from "./content";

const Footage: React.FC<{ src: string; muted?: boolean; style?: React.CSSProperties }> = ({
  src,
  muted,
  style,
}) => (
  <OffthreadVideo
    src={staticFile(src)}
    muted={muted}
    style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
  />
);

const FullLayout: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.ink }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Footage src={shot.video} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 44%, rgba(7,11,15,0.72) 70%, rgba(7,11,15,0.94) 100%)",
        }}
      />

      <Watermark />

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 132,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 28,
        }}
      >
        <Graphic graphic={shot.graphic} delay={shot.graphicDelay} step={shot.graphicStep} />
        <Headline text={shot.headline} size={58} />
      </div>
    </AbsoluteFill>
  );
};

const MockupLayout: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pip = useEnter(2, 17, 0.8);
  const zoom = interpolate(frame, [0, durationInFrames], [1.04, 1.1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.ink }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, filter: "blur(38px) saturate(0.7)" }}>
        <Footage src={shot.video} muted />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(150deg, rgba(8,26,40,0.92) 0%, rgba(6,13,19,0.9) 45%, rgba(9,31,47,0.93) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 78% 16%, ${theme.primary}3a 0%, rgba(0,0,0,0) 46%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 50% 42%, #000 0%, rgba(0,0,0,0.25) 62%, transparent 85%)",
        }}
      />

      <Watermark />

      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 214,
          height: 960,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Graphic graphic={shot.graphic} delay={shot.graphicDelay} step={shot.graphicStep} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          width: 566,
          bottom: 196,
        }}
      >
        {shot.hideHeadline ? null : <Headline text={shot.headline} size={46} delay={14} />}
      </div>

      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 170,
          width: 300,
          height: 533,
          borderRadius: 26,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.82)",
          boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
          opacity: interpolate(pip, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(pip, [0, 1], [34, 0])}px)`,
        }}
      >
        <Footage src={shot.video} />
      </div>

      <Img
        src={staticFile(brand.logo.white)}
        style={{ position: "absolute", left: 70, bottom: 74, width: 240, opacity: 0.85 }}
      />
    </AbsoluteFill>
  );
};

export const ShotBlock: React.FC<{ shot: Shot }> = ({ shot }) =>
  shot.layout === "mockup" ? <MockupLayout shot={shot} /> : <FullLayout shot={shot} />;
