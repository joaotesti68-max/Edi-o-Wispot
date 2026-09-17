import React from "react";
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, horaPremiada } from "./brand";
import { useReveal, IconBadge } from "./Ui";
import { ClockIcon, RepeatIcon, TicketIcon } from "./Icons";

const CARD = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: 34,
  boxShadow: "0 16px 44px rgba(4,26,38,0.34)",
} as const;

/**
 * A slice of the trading day with the promo window lit up — the literal shape
 * of what Hora Premiada configures.
 */
export const TimeWindow: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { opacity, translateY, progress } = useReveal(delay, 26);

  const hours = [12, 14, 16, 18, 20];
  const span = 20 - 12;
  const windowLeft = ((15 - 12) / span) * 100;
  const windowWidth = (1 / span) * 100;
  const fill = interpolate(progress, [0.25, 1], [0, 1], { extrapolateLeft: "clamp" });
  const pulse = 0.85 + 0.15 * Math.sin((frame - delay) / 7);

  return (
    <div
      style={{
        ...CARD,
        width: "100%",
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: "28px 32px 22px",
      }}
    >
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 27,
          letterSpacing: 2.6,
          textTransform: "uppercase",
          color: brand.colors.blue,
          marginBottom: 20,
        }}
      >
        Janela de horário
      </div>

      <div
        style={{
          position: "relative",
          height: 62,
          borderRadius: 999,
          background: brand.blueAlpha(0.16),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${windowLeft}%`,
            width: `${windowWidth * fill}%`,
            top: 0,
            bottom: 0,
            borderRadius: 999,
            background: brand.gradient,
            boxShadow: `0 0 ${30 * pulse}px ${brand.blueAlpha(0.7 * pulse)}`,
          }}
        />
      </div>

      {/* Labels sit at their true position on the strip, so the lit band reads
          as exactly the 15h-16h slot rather than merely near it. */}
      <div style={{ position: "relative", height: 30, marginTop: 12 }}>
        {hours.map((h, i) => (
          <div
            key={h}
            style={{
              position: "absolute",
              left: `${((h - 12) / span) * 100}%`,
              transform: `translateX(${i === 0 ? "0%" : i === hours.length - 1 ? "-100%" : "-50%"})`,
              fontFamily: brand.fontFamily,
              fontWeight: h === 16 ? 700 : 600,
              fontSize: 24,
              color: h === 16 ? brand.colors.blue : brand.colors.gray,
            }}
          >
            {h}h
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
          opacity: interpolate(progress, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }),
        }}
      >
        <ClockIcon size={30} color={brand.colors.blue} strokeWidth={2.2} />
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: -0.4,
            color: brand.colors.ink,
          }}
        >
          15h — 16h
        </div>
      </div>
    </div>
  );
};

/** The reward itself, landing with a small overshoot like a card being dealt. */
export const CouponCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const { opacity, progress } = useReveal(delay, 0);
  const lift = interpolate(progress, [0, 1], [70, 0]);
  const tilt = interpolate(progress, [0, 1], [-8, -2.5]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        background: brand.colors.white,
        borderRadius: 30,
        overflow: "hidden",
        opacity,
        transform: `translateY(${lift}px) rotate(${tilt}deg)`,
        boxShadow: "0 22px 56px rgba(4,26,38,0.42)",
      }}
    >
      <div
        style={{
          width: 110,
          background: brand.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TicketIcon size={52} color={brand.colors.white} strokeWidth={2} />
      </div>
      <div
        style={{
          borderLeft: `4px dashed ${brand.blueAlpha(0.4)}`,
          padding: "20px 40px 22px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: 0.5,
            color: brand.colors.blue,
          }}
        >
          CUPOM
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 600,
            fontSize: 26,
            color: brand.colors.gray,
          }}
        >
          entregue na conexão
        </div>
      </div>
    </div>
  );
};

/** The Hora Premiada lockup, with a rule that wipes out from under it. */
export const FeatureTitle: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 540,
}) => {
  const { opacity, translateY, progress } = useReveal(delay, 34);
  const rule = interpolate(progress, [0.35, 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 34, height: 6, borderRadius: 999, background: brand.colors.blue }} />
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 3.2,
            textTransform: "uppercase",
            color: brand.colors.white,
            textShadow: "0 3px 16px rgba(0,0,0,0.5)",
          }}
        >
          Ferramenta Wispot
        </div>
      </div>
      <Img
        src={staticFile(horaPremiada.logo.color)}
        style={{ width, display: "block", filter: "drop-shadow(0 6px 26px rgba(4,26,38,0.55))" }}
      />
      <div
        style={{
          height: 8,
          borderRadius: 999,
          marginTop: 26,
          width,
          background: horaPremiada.gradient,
          transform: `scaleX(${rule})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

/** "Configura uma vez, roda sozinha" — the icon keeps turning to say so. */
export const AutoLoop: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { opacity, translateY, progress } = useReveal(delay, 26);
  const spin = interpolate(frame - delay, [0, 120], [0, 360], { extrapolateRight: "extend" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ transform: `rotate(${spin * Math.min(progress * 1.4, 1)}deg)` }}>
        <IconBadge size={84}>
          <RepeatIcon size={42} color={brand.colors.white} strokeWidth={2.2} />
        </IconBadge>
      </div>
      <div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 52,
            lineHeight: 1.08,
            letterSpacing: -0.8,
            color: brand.colors.white,
            textShadow: "0 5px 26px rgba(4,26,38,0.55)",
          }}
        >
          Configura uma vez.
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 52,
            lineHeight: 1.08,
            letterSpacing: -0.8,
            color: brand.colors.blue,
            textShadow: "0 5px 26px rgba(4,26,38,0.55)",
          }}
        >
          Roda sozinha.
        </div>
      </div>
    </div>
  );
};

/**
 * Screen capture of the platform, framed as a card floating over the shot.
 * `rate` is tuned per clip so the recording lands on its finished state just
 * before the cue ends, and then holds there.
 */
export const PlatformInset: React.FC<{
  src: string;
  rate: number;
  delay?: number;
}> = ({ src, rate, delay = 0 }) => {
  const { opacity, translateY, scale } = useReveal(delay, 30);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 30,
        overflow: "hidden",
        background: brand.colors.white,
        border: `5px solid ${brand.colors.white}`,
        boxShadow: `0 20px 54px rgba(4,26,38,0.46), 0 0 0 1.5px ${brand.blueAlpha(0.45)}`,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        playbackRate={rate}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
