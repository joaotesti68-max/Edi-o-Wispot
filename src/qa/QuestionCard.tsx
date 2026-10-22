import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Card } from "./edit";
import { WifiArcs, wsp } from "./theme";

// Rings that pulse out from behind the question, like a Wi-Fi signal.
const Rings: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame + i * 22) % 88) / 88;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1700 * t + 200,
              height: 1700 * t + 200,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.9)",
              opacity: 0.16 * (1 - t),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const QuestionCard: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = card.question.split(" ");

  const pill = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const mark = spring({ frame: frame - 2, fps, config: { damping: 9, mass: 0.8 } });
  const logo = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const arcs = [0, 1, 2].map((i) =>
    interpolate(frame, [8 + i * 4, 18 + i * 4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  ) as [number, number, number];
  const timer = interpolate(frame, [14, durationInFrames - 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: wsp.grad, fontFamily: wsp.font }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <Rings />

      {/* Oversized question mark drifting behind the text */}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: 260,
          fontSize: 980,
          fontWeight: 800,
          lineHeight: 1,
          color: "rgba(255,255,255,0.1)",
          transform: `rotate(${interpolate(mark, [0, 1], [40, 12]) - frame * 0.08}deg) scale(${mark})`,
        }}
      >
        ?
      </div>

      <AbsoluteFill
        style={{
          padding: "0 86px",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 54,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: wsp.white,
            color: wsp.blueDeep,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: "0.12em",
            padding: "18px 34px 18px 26px",
            borderRadius: 999,
            transform: `scale(${pill}) rotate(${interpolate(pill, [0, 1], [-8, -2])}deg)`,
            transformOrigin: "left center",
            boxShadow: "0 14px 40px rgba(11,145,193,0.35)",
          }}
        >
          <WifiArcs size={50} color={wsp.blue} progress={arcs} />
          PERGUNTA {String(card.number).padStart(2, "0")}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: 24,
            rowGap: 6,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: wsp.white,
          }}
        >
          {words.map((word, i) => {
            const s = spring({
              frame: frame - 12 - i * 2.5,
              fps,
              config: { damping: 14, mass: 0.6 },
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                  textShadow: "0 6px 26px rgba(11,145,193,0.45)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Reading timer */}
        <div
          style={{
            width: 360,
            height: 10,
            borderRadius: 5,
            background: "rgba(255,255,255,0.28)",
            overflow: "hidden",
            opacity: logo,
          }}
        >
          <div
            style={{
              width: `${timer * 100}%`,
              height: "100%",
              background: wsp.white,
              borderRadius: 5,
            }}
          />
        </div>
      </AbsoluteFill>

      <Img
        src={staticFile(wsp.logoWhite)}
        style={{
          position: "absolute",
          bottom: 150,
          left: "50%",
          width: 260,
          opacity: logo,
          transform: `translateX(-50%) translateY(${interpolate(logo, [0, 1], [30, 0])}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
