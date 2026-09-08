import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import { theme } from "./theme";
import type { Block } from "./content";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const ClipBlock: React.FC<{ block: Block }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Aproximação bem discreta: dá vida ao plano fixo sem virar efeito.
  const push = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateRight: "clamp",
  });

  const kickerOpacity = interpolate(frame, [4, 16], [0, 1], ease);
  const kickerShift = interpolate(frame, [4, 16], [14, 0], ease);

  const headlineOpacity = interpolate(frame, [10, 26], [0, 1], ease);
  const headlineShift = interpolate(frame, [10, 26], [18, 0], ease);

  const ruleWidth = interpolate(frame, [8, 30], [0, 64], ease);
  const watermarkOpacity = interpolate(frame, [0, 14], [0, 0.85], ease);

  const nameCardOpacity = interpolate(frame, [14, 26, 96, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.ink }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <OffthreadVideo
          src={staticFile(block.video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: theme.scrim }} />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{ position: "absolute", top: 52, right: 48, width: 58, opacity: watermarkOpacity }}
      />

      {block.nameCard ? (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: nameCardOpacity,
          }}
        >
          <div style={{ width: 3, height: 22, background: theme.accentBright }} />
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 25,
              color: theme.white,
              letterSpacing: 0.2,
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
          bottom: 132,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 25,
            letterSpacing: 2.6,
            textTransform: "uppercase",
            color: theme.accentBright,
            opacity: kickerOpacity,
            transform: `translateY(${kickerShift}px)`,
          }}
        >
          {block.kicker}
        </div>

        <div style={{ width: ruleWidth, height: 3, background: theme.rule }} />

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 54,
            lineHeight: 1.16,
            color: theme.white,
            letterSpacing: -0.6,
            textShadow: "0 4px 28px rgba(0,0,0,0.45)",
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
