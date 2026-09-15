import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../loadFont";
import { PlayBadge } from "./PlayBadge";
import { yt } from "./theme";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 13, mass: 0.7 } });
  const titleIn = spring({ frame: frame - 10, fps, config: { damping: 17, mass: 0.7 } });
  const handleIn = spring({ frame: frame - 20, fps, config: { damping: 17, mass: 0.7 } });
  const urlIn = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = 1 + 0.03 * Math.sin((frame / fps) * 3.4);

  return (
    <AbsoluteFill style={{ background: yt.gradient, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 34%, rgba(94,196,240,0.22) 0%, rgba(94,196,240,0) 58%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <div
          style={{
            opacity: badgeIn,
            transform: `scale(${interpolate(badgeIn, [0, 1], [0.6, 1]) * pulse})`,
          }}
        >
          <PlayBadge width={240} />
        </div>

        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
            fontFamily,
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.1,
            letterSpacing: -1,
            color: yt.colors.white,
            textAlign: "center",
          }}
        >
          Assista o vídeo
          <br />
          completo no canal
        </div>

        <div
          style={{
            opacity: handleIn,
            transform: `scale(${interpolate(handleIn, [0, 1], [0.92, 1])})`,
            fontFamily,
            fontWeight: 800,
            fontSize: 42,
            letterSpacing: -0.4,
            color: yt.colors.navy,
            background: yt.colors.white,
            borderRadius: 999,
            padding: "22px 52px",
          }}
        >
          {yt.handle}
        </div>

        <div
          style={{
            opacity: urlIn,
            fontFamily,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 0.4,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {yt.channelUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};
