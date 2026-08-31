import React from "react";
import { wispot } from "./brand";

/** As três ondas do símbolo da Wispot, redesenhadas em SVG para poder animar. */
export const WifiArcs: React.FC<{
  size?: number;
  color?: string;
  opacity?: [number, number, number];
  dot?: boolean;
}> = ({
  size = 120,
  color = wispot.white,
  opacity = [1, 1, 1],
  dot = false,
}) => (
  <svg width={size} height={size * 0.68} viewBox="0 0 120 82" fill="none">
    <path
      d="M10 68 A 58 50 0 0 1 110 68"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
      opacity={opacity[0]}
    />
    <path
      d="M33 68 A 33 28 0 0 1 87 68"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
      opacity={opacity[1]}
    />
    <path
      d="M52 68 A 11 10 0 0 1 68 68"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
      opacity={opacity[2]}
    />
    {dot ? (
      <circle cx="60" cy="76" r="5" fill={color} opacity={opacity[2]} />
    ) : null}
  </svg>
);

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.10)",
      border: "1.5px solid rgba(255,255,255,0.22)",
      borderRadius: 28,
      backdropFilter: "blur(6px)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  tone?: "solid" | "ghost";
  style?: React.CSSProperties;
}> = ({ children, tone = "ghost", style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 26px",
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 0.2,
      color: tone === "solid" ? wispot.ink : wispot.white,
      background: tone === "solid" ? wispot.white : "rgba(255,255,255,0.14)",
      border: tone === "solid" ? "none" : "1.5px solid rgba(255,255,255,0.28)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const CheckIcon: React.FC<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ size = 28, color = wispot.white, strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4.5 12.8 L9.6 17.9 L19.5 6.6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon: React.FC<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ size = 28, color = wispot.white, strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6 L18 18 M18 6 L6 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const ClockIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = wispot.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2.2} />
    <path
      d="M12 6.8 V12.3 L15.8 14.6"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </svg>
);

export const MailIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = wispot.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="2.8"
      y="5.2"
      width="18.4"
      height="13.6"
      rx="2.4"
      stroke={color}
      strokeWidth={2.2}
    />
    <path
      d="M3.6 6.6 L12 13 L20.4 6.6"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </svg>
);

export const BoltIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = wispot.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M13.4 2.5 L5.2 13.6 H11 L10.2 21.5 L18.6 10.2 H12.7 Z"
      stroke={color}
      strokeWidth={2.1}
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/** Moldura de celular usada nos inserts. */
export const PhoneFrame: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, children, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 56,
      padding: 12,
      background:
        "linear-gradient(160deg, #f2f6f8 0%, #c7d4da 45%, #eef4f7 100%)",
      boxShadow: "0 44px 90px rgba(3,26,38,0.48)",
      ...style,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 46,
        background: wispot.white,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 118,
          height: 26,
          borderRadius: 999,
          background: "#101418",
          zIndex: 3,
        }}
      />
      {children}
    </div>
  </div>
);

/** Fundo institucional usado nos inserts e nos cards de abertura/fechamento. */
export const BrandBackdrop: React.FC<{
  children?: React.ReactNode;
  deep?: boolean;
}> = ({ children, deep = false }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: deep ? wispot.gradientDeep : wispot.gradient,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle at 50% 22%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 58%)",
      }}
    />
    {children}
  </div>
);
