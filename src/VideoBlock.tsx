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
import { AlertIcon, ChatIcon, ServerIcon, ShieldCheckIcon, TrendingUpIcon } from "./Icons";
import type { Block, IconKey } from "./content";

const ICONS: Record<IconKey, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alert: AlertIcon,
  server: ServerIcon,
  shield: ShieldCheckIcon,
  trending: TrendingUpIcon,
  chat: ChatIcon,
};

export const VideoBlock: React.FC<{ block: Block }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateRight: "clamp",
  });

  const iconIn = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.6 } });

  const headlineIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, mass: 0.7 },
  });
  const headlineOpacity = interpolate(headlineIn, [0, 1], [0, 1]);
  const headlineShift = interpolate(headlineIn, [0, 1], [26, 0]);

  const watermarkOpacity = interpolate(frame, [0, 12], [0, 0.9], {
    extrapolateRight: "clamp",
  });

  const nameCardIn = spring({ frame: frame - 10, fps, config: { damping: 16, mass: 0.7 } });
  const nameCardOpacity = interpolate(frame, [10, 20, 78, 92], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameCardShift = interpolate(nameCardIn, [0, 1], [-18, 0]);

  const Icon = ICONS[block.icon];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
        <OffthreadVideo
          src={staticFile(block.video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(10,14,18,0.72) 82%, rgba(6,9,12,0.88) 100%)",
        }}
      />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{
          position: "absolute",
          top: 56,
          right: 48,
          width: 68,
          opacity: watermarkOpacity,
        }}
      />

      {block.nameCard ? (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: nameCardOpacity,
            transform: `translateX(${nameCardShift}px)`,
            background: "rgba(6,9,12,0.55)",
            borderRadius: 12,
            padding: "12px 22px 12px 16px",
          }}
        >
          <div style={{ width: 4, height: 26, background: brand.colors.primaryLight, borderRadius: 2 }} />
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 30,
              color: brand.colors.white,
              letterSpacing: -0.2,
            }}
          >
            {block.nameCard}
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 120,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: interpolate(iconIn, [0, 1], [0, 1]),
            transform: `scale(${interpolate(iconIn, [0, 1], [0.6, 1])})`,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "rgba(54,150,205,0.32)",
              border: `1.5px solid ${brand.colors.primaryLight}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={28} color={brand.colors.white} strokeWidth={2.2} />
          </div>
          <div style={{ width: 40, height: 4, background: brand.colors.primaryLight, borderRadius: 2 }} />
        </div>

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.12,
            color: brand.colors.white,
            letterSpacing: -0.5,
            textShadow: "0 4px 24px rgba(0,0,0,0.35)",
            opacity: headlineOpacity,
            transform: `translateY(${headlineShift}px)`,
          }}
        >
          {block.headline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
