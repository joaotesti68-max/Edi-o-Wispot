import React, { createContext, useContext } from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { SPEED } from "./content";

const CueContext = createContext<number>(Number.POSITIVE_INFINITY);

/**
 * Shows its children between `at` and `at + dur`, both in seconds of the
 * recording — the footage plays back at SPEED, so the timeline is shorter.
 */
export const Cue: React.FC<{ at: number; dur: number; children: React.ReactNode }> = ({
  at,
  dur,
  children,
}) => {
  const { fps } = useVideoConfig();
  const durationInFrames = Math.round((dur / SPEED) * fps);
  return (
    <Sequence
      from={Math.round((at / SPEED) * fps)}
      durationInFrames={durationInFrames}
      layout="none"
    >
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

/**
 * Round badge. The Wispot mark is built from circles and soft terminals, so
 * nothing in the overlay system uses a square corner.
 */
export const IconBadge: React.FC<{
  children: React.ReactNode;
  size?: number;
  tone?: "brand" | "outline";
}> = ({ children, size = 62, tone = "brand" }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: 999,
      background: tone === "brand" ? brand.gradient : "transparent",
      border: tone === "brand" ? "none" : "1.5px solid rgba(255,255,255,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/** Every short statement rides one of these pills. */
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
        gap: 18,
        padding: icon ? "13px 36px 13px 13px" : "20px 36px",
        borderRadius: 999,
        background: muted ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.96)",
        border: muted ? "1.5px solid rgba(255,255,255,0.4)" : "none",
        boxShadow: muted ? "none" : "0 12px 34px rgba(4,26,38,0.32)",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {icon}
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: muted ? 600 : 700,
          fontSize: 38,
          lineHeight: 1.2,
          color: muted ? "rgba(255,255,255,0.88)" : brand.colors.ink,
          letterSpacing: -0.3,
          textDecoration: muted ? "line-through" : "none",
          textDecorationColor: brand.colors.blue,
          textDecorationThickness: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Small uppercase label that sits above a headline or a card. */
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
      <div style={{ width: 34, height: 6, borderRadius: 999, background: brand.colors.blue }} />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 3.2,
          textTransform: "uppercase",
          color: brand.colors.white,
          textShadow: "0 3px 16px rgba(0,0,0,0.5)",
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
        textShadow: "0 6px 30px rgba(4,26,38,0.55)",
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
