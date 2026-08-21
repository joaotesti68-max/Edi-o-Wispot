import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import {
  AlertIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  PulseIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "./Icons";
import type { Card, IconKey } from "./content";

const ICONS: Record<IconKey, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alert: AlertIcon,
  server: ServerIcon,
  shield: ShieldCheckIcon,
  trending: TrendingUpIcon,
  chat: ChatIcon,
  pulse: PulseIcon,
  clock: ClockIcon,
};

const ChecklistItem: React.FC<{ label: string; from: number }> = ({ label, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - from, fps, config: { damping: 15, mass: 0.5 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [-16, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: brand.colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CheckIcon size={20} color={brand.colors.white} strokeWidth={2.8} />
      </div>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 38,
          color: brand.colors.white,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const InfoCard: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const opacity = interpolate(
    frame,
    [0, 8, card.durationInFrames - 12, card.durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shift = interpolate(enter, [0, 1], [34, 0]);
  const Icon = ICONS[card.icon];

  return (
    <div
      style={{
        position: "absolute",
        top: 168,
        left: 60,
        maxWidth: 760,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        padding: "30px 40px",
        borderRadius: 24,
        background: "rgba(6,9,12,0.55)",
        border: "1.5px solid rgba(54,150,205,0.5)",
        backdropFilter: "blur(14px)",
        opacity,
        transform: `translateX(${shift}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 18,
            background: "rgba(54,150,205,0.34)",
            border: `1.5px solid ${brand.colors.primaryLight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={32} color={brand.colors.white} strokeWidth={2.2} />
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1.1,
            color: brand.colors.white,
            letterSpacing: -0.6,
          }}
        >
          {card.title}
        </div>
      </div>

      {card.items ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingLeft: 4 }}>
          {card.items.map((item) => (
            <ChecklistItem key={item.label} label={item.label} from={item.from} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
