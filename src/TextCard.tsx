import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import {
  AlertIcon,
  ChatIcon,
  RadarIcon,
  RestoreIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  TruckIcon,
} from "./Icons";
import type { IconKey } from "./types";

const ICONS: Record<IconKey, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alert: AlertIcon,
  server: ServerIcon,
  shield: ShieldCheckIcon,
  trending: TrendingUpIcon,
  chat: ChatIcon,
  truck: TruckIcon,
  radar: RadarIcon,
  restore: RestoreIcon,
};

/** Carries a line of the script he never recorded, full frame. */
export const TextCard: React.FC<{ line: string; icon: IconKey }> = ({ line, icon }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const Icon = ICONS[icon];

  const iconIn = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const lineIn = spring({ frame: frame - 6, fps, config: { damping: 17, mass: 0.8 } });
  const drift = interpolate(frame, [0, durationInFrames], [0, -22]);
  const rule = interpolate(spring({ frame: frame - 3, fps, config: { damping: 18 } }), [0, 1], [0, 168]);

  return (
    <AbsoluteFill style={{ background: brand.gradient }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 24% 32%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 58%)",
        }}
      />
      <AbsoluteFill
        style={{
          padding: "0 84px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 40,
          transform: `translateY(${drift}px)`,
        }}
      >
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: 28,
            background: "rgba(255,255,255,0.16)",
            border: "2px solid rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(iconIn, [0, 1], [0, 1]),
            transform: `scale(${interpolate(iconIn, [0, 1], [0.55, 1])})`,
          }}
        >
          <Icon size={54} color={brand.colors.white} strokeWidth={2.2} />
        </div>

        <div style={{ width: rule, height: 6, borderRadius: 3, background: brand.colors.white }} />

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.14,
            letterSpacing: -1,
            color: brand.colors.white,
            opacity: interpolate(lineIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(lineIn, [0, 1], [34, 0])}px)`,
            textShadow: "0 6px 30px rgba(0,0,0,0.22)",
          }}
        >
          {line}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
