import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../loadFont";
import { yt } from "./theme";

const IN_DELAY = 6;
const OUT_START = 62;

export const OpeningTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowIn = spring({ frame: frame - IN_DELAY, fps, config: { damping: 16, mass: 0.6 } });
  const titleIn = spring({ frame: frame - IN_DELAY - 6, fps, config: { damping: 17, mass: 0.7 } });
  const out = interpolate(frame, [OUT_START, OUT_START + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 22,
        }}
      >
        <div
          style={{
            opacity: eyebrowIn,
            transform: `translateY(${interpolate(eyebrowIn, [0, 1], [18, 0])}px)`,
            fontFamily,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 3,
            color: yt.colors.blueLight,
            background: "rgba(26,160,224,0.16)",
            border: `1px solid ${yt.colors.blue}`,
            borderRadius: 999,
            padding: "10px 24px",
          }}
        >
          VÍDEO NOVO NO CANAL
        </div>

        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [26, 0])}px)`,
            fontFamily,
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.08,
            letterSpacing: -1,
            color: yt.colors.white,
            textShadow: "0 6px 28px rgba(0,0,0,0.45)",
          }}
        >
          Assista completo
          <br />
          no YouTube
        </div>

        <div
          style={{
            opacity: titleIn,
            width: interpolate(titleIn, [0, 1], [0, 160]),
            height: 6,
            borderRadius: 3,
            background: yt.colors.play,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
