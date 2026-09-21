import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { shotRanges, outroRange } from "./content";

export const theme = {
  ink: "#070b0f",
  panel: "rgba(11,19,27,0.74)",
  panelBorder: "rgba(120,180,220,0.22)",
  primary: brand.colors.primary,
  primaryLight: brand.colors.primaryLight,
  white: "#ffffff",
  muted: "rgba(226,240,250,0.68)",
  danger: "#ff6f4d",
  success: "#3ad4a4",
};

/** 0 → 1 entrance value that is already settled for negative delays. */
export const useEnter = (delay: number, damping = 16, mass = 0.7) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass } });
};

export const Rise: React.FC<{
  delay: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, distance = 28, children, style }) => {
  const v = useEnter(delay);
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(v, [0, 1], [distance, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{
  icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  delay: number;
  tone?: "brand" | "danger" | "success";
  compact?: boolean;
  /** Dimmed placeholder state, used before the line mentions the item. */
  ghost?: boolean;
}> = ({ icon: Icon, label, delay, tone = "brand", compact = false, ghost = false }) => {
  const color =
    tone === "danger" ? theme.danger : tone === "success" ? theme.success : theme.primaryLight;
  const v = useEnter(delay, 15, 0.6);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 14 : 18,
        padding: compact ? "14px 22px" : "18px 28px",
        borderRadius: 18,
        background: theme.panel,
        border: `1.5px solid ${color}55`,
        backdropFilter: "blur(14px)",
        opacity: interpolate(v, [0, 1], [0, ghost ? 0.34 : 1], { extrapolateRight: "clamp" }),
        transform: `translateX(${interpolate(v, [0, 1], [-26, 0])}px)`,
      }}
    >
      <div
        style={{
          width: compact ? 40 : 50,
          height: compact ? 40 : 50,
          borderRadius: 13,
          background: `${color}2e`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={compact ? 22 : 27} color={color} strokeWidth={2.1} />
      </div>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: compact ? 30 : 34,
          color: theme.white,
          letterSpacing: -0.3,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Headline: React.FC<{ text: string; delay?: number; size?: number }> = ({
  text,
  delay = 8,
  size = 60,
}) => {
  const v = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        opacity: interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(v, [0, 1], [26, 0])}px)`,
      }}
    >
      <div
        style={{
          width: interpolate(v, [0, 1], [0, 72]),
          height: 6,
          borderRadius: 3,
          background: theme.primaryLight,
        }}
      />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.1,
          color: theme.white,
          letterSpacing: -1,
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile(brand.logo.iconWhite)}
      style={{
        position: "absolute",
        top: 62,
        right: 52,
        width: 64,
        opacity: interpolate(frame, [0, 14], [0, 0.88], { extrapolateRight: "clamp" }),
      }}
    />
  );
};

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [outroRange.start - 12, outroRange.start + 4], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 52,
          right: 52,
          display: "flex",
          gap: 7,
          opacity,
        }}
      >
        {shotRanges.map((range, i) => (
          <div
            key={i}
            style={{
              flex: range.end - range.start,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.3)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${
                  interpolate(frame, [range.start, range.end], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) * 100
                }%`,
                height: "100%",
                background: theme.white,
                borderRadius: 3,
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
