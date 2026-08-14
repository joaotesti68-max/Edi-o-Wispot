import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import {
  AlertIcon,
  ChatIcon,
  CloudIcon,
  NetworkIcon,
  RefreshIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "./Icons";
import type { IconKey } from "./content";

const ICONS: Record<IconKey, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alert: AlertIcon,
  server: ServerIcon,
  shield: ShieldCheckIcon,
  trending: TrendingUpIcon,
  chat: ChatIcon,
  network: NetworkIcon,
  cloud: CloudIcon,
  refresh: RefreshIcon,
};

export type GraphicItem = { icon: IconKey; label: string };

const RadiatingBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 200], [0, 20]);
  const dashes = Array.from({ length: 16 });
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 900,
        height: 900,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        opacity: 0.14,
      }}
    >
      {dashes.map((_, i) => {
        const angle = (i / dashes.length) * 360;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 4,
              height: 64,
              background: "#fff",
              borderRadius: 2,
              transformOrigin: "50% 380px",
              transform: `translate(-50%, -380px) rotate(${angle}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const GraphicInterstitial: React.FC<{ items: GraphicItem[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isSingle = items.length === 1;

  return (
    <AbsoluteFill style={{ background: brand.gradient, alignItems: "center", justifyContent: "center" }}>
      <RadiatingBackdrop />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isSingle ? "1fr" : "1fr 1fr",
          columnGap: 64,
          rowGap: 56,
          padding: "0 80px",
        }}
      >
        {items.map((item, i) => {
          const itemIn = spring({ frame: frame - i * 6, fps, config: { damping: 14, mass: 0.6 } });
          const Icon = ICONS[item.icon];
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
                opacity: interpolate(itemIn, [0, 1], [0, 1]),
                transform: `scale(${interpolate(itemIn, [0, 1], [0.65, 1])})`,
              }}
            >
              <div
                style={{
                  width: isSingle ? 200 : 128,
                  height: isSingle ? 200 : 128,
                  borderRadius: isSingle ? 48 : 32,
                  background: "rgba(255,255,255,0.14)",
                  border: "2.5px solid rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
              >
                <Icon size={isSingle ? 96 : 58} color={brand.colors.white} strokeWidth={1.8} />
              </div>
              <div
                style={{
                  fontFamily: brand.fontFamily,
                  fontWeight: 800,
                  fontSize: isSingle ? 48 : 32,
                  color: brand.colors.white,
                  textAlign: "center",
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
