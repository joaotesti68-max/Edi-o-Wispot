import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../loadFont";
import { PlayBadge } from "./PlayBadge";
import { yt } from "./theme";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 13, mass: 0.7 } });
  const titleIn = spring({ frame: frame - 10, fps, config: { damping: 17, mass: 0.7 } });
  const slabIn = spring({ frame: frame - 16, fps, config: { damping: 18, mass: 0.8 } });
  const handleIn = spring({ frame: frame - 26, fps, config: { damping: 17, mass: 0.7 } });

  const pulse = 1 + 0.03 * Math.sin((frame / fps) * 3.4);

  return (
    <AbsoluteFill style={{ background: yt.colors.white }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 26%, rgba(26,160,224,0.15) 0%, rgba(26,160,224,0) 55%)",
        }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: yt.colors.blue }} />

      <Img
        src={staticFile(yt.logo.color)}
        style={{
          position: "absolute",
          top: 150,
          left: "50%",
          width: 330,
          transform: `translateX(-50%) translateY(${interpolate(badgeIn, [0, 1], [-24, 0])}px)`,
          opacity: badgeIn,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 430,
          left: 72,
          right: 72,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 46,
        }}
      >
        <div style={{ opacity: badgeIn, transform: `scale(${interpolate(badgeIn, [0, 1], [0.6, 1]) * pulse})` }}>
          <PlayBadge width={244} />
        </div>

        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
            fontFamily,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.08,
            letterSpacing: -1.4,
            color: yt.colors.navy,
            textAlign: "center",
          }}
        >
          Assista o vídeo
          <br />
          completo no canal
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 700,
          borderRadius: "80px 80px 0 0",
          background: `linear-gradient(170deg, ${yt.colors.blue} 0%, #0f7fb8 100%)`,
          transform: `translateY(${interpolate(slabIn, [0, 1], [700, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.8)",
            opacity: handleIn,
          }}
        >
          NO YOUTUBE
        </div>

        <div
          style={{
            opacity: handleIn,
            transform: `scale(${interpolate(handleIn, [0, 1], [0.92, 1])})`,
            fontFamily,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: -0.6,
            color: yt.colors.blue,
            background: yt.colors.white,
            borderRadius: 999,
            padding: "26px 60px",
            boxShadow: "0 18px 44px rgba(3,42,64,0.28)",
          }}
        >
          {yt.handle}
        </div>

        <div
          style={{
            opacity: handleIn,
            fontFamily,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 0.4,
            color: "rgba(255,255,255,0.86)",
          }}
        >
          {yt.channelUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};
