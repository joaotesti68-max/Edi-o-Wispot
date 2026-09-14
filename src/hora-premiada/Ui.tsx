import React, { createContext, useContext } from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

const CueContext = createContext<number>(Number.POSITIVE_INFINITY);

/** Shows its children between `at` and `at + dur`, both in seconds. */
export const Cue: React.FC<{ at: number; dur: number; children: React.ReactNode }> = ({
  at,
  dur,
  children,
}) => {
  const { fps } = useVideoConfig();
  const durationInFrames = Math.round(dur * fps);
  return (
    <Sequence from={Math.round(at * fps)} durationInFrames={durationInFrames} layout="none">
      <CueContext.Provider value={durationInFrames}>{children}</CueContext.Provider>
    </Sequence>
  );
};

/** Spring-in on entry, fade-out over the cue's last frames. */
export const useReveal = (delayInFrames = 0, shift = 30) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueDuration = useContext(CueContext);

  const entry = spring({
    frame: frame - delayInFrames,
    fps,
    config: { damping: 17, mass: 0.7 },
  });
  const exit = Number.isFinite(cueDuration)
    ? interpolate(frame, [cueDuration - 10, cueDuration - 2], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return {
    opacity: entry * exit,
    translateY: interpolate(entry, [0, 1], [shift, 0]),
    scale: interpolate(entry, [0, 1], [0.93, 1]),
    progress: entry,
  };
};

export const IconBadge: React.FC<{
  children: React.ReactNode;
  size?: number;
  tone?: "glass" | "solid";
}> = ({ children, size = 64, tone = "glass" }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: size * 0.3,
      background: tone === "solid" ? brand.gradient : brand.blueAlpha(0.28),
      border: tone === "solid" ? "none" : `1.5px solid ${brand.blueAlpha(0.8)}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/** Glass pill used for every short on-screen statement. */
export const Chip: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  muted?: boolean;
}> = ({ icon, children, delay = 0, muted = false }) => {
  const { opacity, translateY } = useReveal(delay, 24);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: icon ? "16px 34px 16px 16px" : "20px 34px",
        borderRadius: 26,
        background: "rgba(12,19,22,0.62)",
        border: `1.5px solid ${muted ? "rgba(255,255,255,0.18)" : brand.blueAlpha(0.6)}`,
        backdropFilter: "blur(10px)",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {icon}
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.2,
          color: muted ? "rgba(255,255,255,0.72)" : brand.colors.white,
          letterSpacing: -0.2,
          textDecoration: muted ? "line-through" : "none",
          textDecorationColor: brand.blueAlpha(0.9),
          textDecorationThickness: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Small uppercase label that sits above a headline. */
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const { opacity, translateY } = useReveal(delay, 16);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ width: 42, height: 4, borderRadius: 2, background: brand.colors.blue }} />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 3.4,
          textTransform: "uppercase",
          color: brand.colors.white,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Headline: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({
  children,
  delay = 0,
  size = 62,
}) => {
  const { opacity, translateY } = useReveal(delay, 28);
  return (
    <div
      style={{
        fontFamily: brand.fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: -1,
        color: brand.colors.white,
        textShadow: "0 6px 30px rgba(0,0,0,0.45)",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Bottom-anchored column that every scene stacks its overlays into. */
export const OverlayStack: React.FC<{ children: React.ReactNode; align?: "start" | "center" }> = ({
  children,
  align = "start",
}) => (
  <div
    style={{
      position: "absolute",
      left: 64,
      right: 64,
      bottom: 150,
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      gap: 20,
    }}
  >
    {children}
  </div>
);
