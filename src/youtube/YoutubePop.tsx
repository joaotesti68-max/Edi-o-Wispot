import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../loadFont";
import { yt } from "./theme";

const CARD_TILT = [-7, 0, 7];
const CARD_LIFT = [16, 0, 16];

/** One of the little video tiles that fan out under the logo. */
const Thumb: React.FC<{ index: number; progress: number }> = ({ index, progress }) => {
  const shades = [
    "linear-gradient(140deg, #0b4f72 0%, #25a8e0 100%)",
    "linear-gradient(140deg, #0b91c1 0%, #7fd0f2 100%)",
    "linear-gradient(140deg, #093a56 0%, #0b91c1 100%)",
  ];

  return (
    <div
      style={{
        width: 196,
        height: 118,
        borderRadius: 16,
        background: shades[index],
        border: "2px solid rgba(255,255,255,0.22)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.38)",
        transform: `rotate(${CARD_TILT[index] * (1 - progress * 0.35)}deg) translateY(${
          CARD_LIFT[index] + (1 - progress) * 120
        }px)`,
        opacity: progress,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 12,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: 0,
          height: 0,
          borderTop: "13px solid transparent",
          borderBottom: "13px solid transparent",
          borderLeft: `21px solid rgba(255,255,255,0.92)`,
        }}
      />
      <div style={{ width: "72%", height: 7, borderRadius: 4, background: "rgba(255,255,255,0.75)" }} />
      <div style={{ width: "44%", height: 7, borderRadius: 4, background: "rgba(255,255,255,0.4)", marginTop: 6 }} />
    </div>
  );
};

/** YouTube logo plus a few video tiles, for the beat where she mentions the channel. */
export const YoutubePop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 13, mass: 0.8 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 190,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "22px 36px",
            borderRadius: 999,
            background: "rgba(5,13,22,0.62)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 22px 54px rgba(0,0,0,0.42)",
            opacity: logoIn,
            transform: `translateY(${interpolate(logoIn, [0, 1], [70, 0])}px) scale(${interpolate(
              logoIn,
              [0, 1],
              [0.7, 1],
            )})`,
          }}
        >
          <Img src={staticFile(yt.logo.white)} style={{ width: 250 }} />

          <div style={{ width: 2, height: 62, background: "rgba(255,255,255,0.28)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 88,
                height: 62,
                borderRadius: 18,
                background: yt.colors.play,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 34px rgba(255,59,48,0.42)",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 5,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  borderLeft: `23px solid ${yt.colors.white}`,
                }}
              />
            </div>
            <div
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 52,
                letterSpacing: -1.2,
                color: yt.colors.white,
              }}
            >
              YouTube
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
          {[0, 1, 2].map((i) => (
            <Thumb
              key={i}
              index={i}
              progress={spring({ frame: frame - 8 - i * 5, fps, config: { damping: 14, mass: 0.7 } })}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
