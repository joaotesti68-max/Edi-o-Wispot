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
import { Headline, Watermark, theme } from "./ui";
import type { Shot } from "./content";

const Footage: React.FC<{ src: string }> = ({ src }) => (
  <OffthreadVideo
    src={staticFile(src)}
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
);

/** Shared backdrop for the shots that show no footage. */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, -26], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill
        style={{ background: "linear-gradient(158deg, #08202f 0%, #061019 46%, #08243c 100%)" }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 76% 14%, ${theme.primary}46 0%, rgba(0,0,0,0) 52%), radial-gradient(circle at 12% 88%, ${theme.primary}22 0%, rgba(0,0,0,0) 46%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translateY(${drift}px)`,
          maskImage:
            "radial-gradient(circle at 50% 40%, #000 0%, rgba(0,0,0,0.3) 60%, transparent 84%)",
        }}
      />
    </>
  );
};

const FullLayout: React.FC<{ shot: Shot; video: string }> = ({ shot, video }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.ink }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Footage src={video} />
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
        <Graphic graphic={shot.graphic} delay={shot.graphicDelay} />
        <Headline text={shot.headline} size={58} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Used where he reads off the page: the take is heard but never seen, and the
 * mockup has the screen to itself.
 */
const MockupLayout: React.FC<{ shot: Shot; video: string }> = ({ shot, video }) => (
  <AbsoluteFill style={{ background: "#06121c" }}>
    <AbsoluteFill style={{ opacity: 0 }}>
      <Footage src={video} />
    </AbsoluteFill>
    <Backdrop />
    <Watermark />

    <div
      style={{
        position: "absolute",
        left: 78,
        right: 78,
        top: 250,
        height: 1130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Graphic graphic={shot.graphic} delay={shot.graphicDelay} />
    </div>

    <div style={{ position: "absolute", left: 78, right: 78, bottom: 200 }}>
      <Headline text={shot.headline} size={58} delay={10} />
    </div>

    <Img
      src={staticFile(brand.logo.white)}
      style={{ position: "absolute", left: 78, bottom: 84, width: 250, opacity: 0.8 }}
    />
  </AbsoluteFill>
);

export const ShotBlock: React.FC<{ shot: Shot }> = ({ shot }) =>
  shot.layout === "mockup" ? (
    <MockupLayout shot={shot} video={shot.video} />
  ) : (
    <FullLayout shot={shot} video={shot.video} />
  );
