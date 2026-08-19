import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import { hexA } from "./QuestionCard";
import { WifiArcs, WispotMark } from "./WispotMark";
import type { Clip } from "./content";

export const VideoBlock: React.FC<{ clip: Clip }> = ({ clip }) => {
  return (
    <AbsoluteFill style={{ background: brand.colors.navyDeep }}>
      <OffthreadVideo src={staticFile(clip.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      <Vignette />

      {clip.kicker ? <Kicker text={clip.kicker} /> : null}
      {clip.ribbon ? <QuestionRibbon text={clip.ribbon} /> : null}
      {clip.nameCard ? <NameCard name={clip.nameCard.name} role={clip.nameCard.role} /> : null}

      <Watermark />
    </AbsoluteFill>
  );
};

/** Keeps the top and bottom overlays readable over the footage. */
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(to bottom, ${hexA(brand.colors.navyDeep, 0.72)} 0%, transparent 26%, transparent 62%, ${hexA(brand.colors.navyDeep, 0.86)} 100%)`,
    }}
  />
);

const Kicker: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 0.6 } });
  const exit = interpolate(frame, [110, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 108,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(enter, 1 - exit),
        transform: `translateY(${(1 - enter) * -26}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 34px",
          borderRadius: 999,
          background: hexA(brand.colors.navyDeep, 0.72),
          border: `2px solid ${hexA(brand.colors.primaryLight, 0.5)}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <WifiArcs size={44} color={brand.colors.accent} />
        <span
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: brand.colors.white,
            letterSpacing: 1,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * Compact reminder of the question, so someone landing mid-answer still knows
 * what Mari is answering. Retracts once the answer is under way.
 */
const QuestionRibbon: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 2, fps, config: { damping: 200, mass: 0.6 } });
  const exit = interpolate(frame, [132, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(enter, 1 - exit),
        transform: `translateY(${(1 - enter) * -30}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "18px 32px",
          borderRadius: 28,
          background: hexA(brand.colors.navyDeep, 0.78),
          border: `2px solid ${hexA(brand.colors.primaryLight, 0.42)}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: brand.colors.primary,
            color: brand.colors.white,
            fontSize: 30,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ?
        </span>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: brand.colors.white,
            lineHeight: 1.2,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const NameCard: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 26, fps, config: { damping: 200, mass: 0.7 } });
  const exit = interpolate(frame, [150, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 188,
        opacity: Math.min(enter, 1 - exit),
        transform: `translateX(${(1 - enter) * -40}px)`,
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div style={{ width: 8, height: 92, borderRadius: 999, background: brand.colors.accent }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 58, fontWeight: 800, color: brand.colors.white, lineHeight: 1 }}>
          {name}
        </span>
        <span style={{ fontSize: 32, fontWeight: 700, color: brand.colors.mist, lineHeight: 1 }}>
          {role}
        </span>
      </div>
    </div>
  );
};

const Watermark: React.FC = () => (
  <div style={{ position: "absolute", right: 56, bottom: 74, opacity: 0.88 }}>
    <WispotMark size={40} />
  </div>
);
