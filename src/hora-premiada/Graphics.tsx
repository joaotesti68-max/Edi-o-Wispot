import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import { useReveal, IconBadge } from "./Ui";
import { ClockIcon, RepeatIcon, TicketIcon } from "./Icons";

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
        width: "100%",
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "rgba(12,19,22,0.62)",
        border: `1.5px solid ${brand.blueAlpha(0.45)}`,
        backdropFilter: "blur(10px)",
        borderRadius: 28,
        padding: "26px 30px 20px",
      }}
    >
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 2.6,
          textTransform: "uppercase",
          color: brand.blueAlpha(0.95),
          marginBottom: 20,
        }}
      >
        Janela de horário
      </div>

      <div
        style={{
          position: "relative",
          height: 62,
          borderRadius: 16,
          background: "rgba(255,255,255,0.12)",
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
            background: brand.gradient,
            boxShadow: `0 0 ${34 * pulse}px ${brand.blueAlpha(0.85 * pulse)}`,
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
              fontWeight: 600,
              fontSize: 24,
              color: h === 16 ? brand.colors.white : "rgba(255,255,255,0.55)",
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
          gap: 14,
          marginTop: 18,
          opacity: interpolate(progress, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }),
        }}
      >
        <ClockIcon size={30} color={brand.colors.blue} strokeWidth={2.2} />
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 34,
            color: brand.colors.white,
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
        borderRadius: 24,
        overflow: "hidden",
        opacity,
        transform: `translateY(${lift}px) rotate(${tilt}deg)`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          width: 108,
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
          borderLeft: `4px dashed ${brand.blueAlpha(0.45)}`,
          padding: "20px 38px 22px 30px",
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
            letterSpacing: 1,
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

/** Feature-name reveal with a gradient rule that wipes out from the left. */
export const FeatureTitle: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const { opacity, translateY, progress } = useReveal(delay, 34);
  const rule = interpolate(progress, [0.35, 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 3.4,
          textTransform: "uppercase",
          color: brand.blueAlpha(0.95),
          marginBottom: 10,
        }}
      >
        Ferramenta Wispot
      </div>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1,
          letterSpacing: -2,
          color: brand.colors.white,
          textShadow: "0 6px 34px rgba(0,0,0,0.5)",
        }}
      >
        Hora Premiada
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          marginTop: 18,
          background: brand.gradient,
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
        gap: 26,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ transform: `rotate(${spin * Math.min(progress * 1.4, 1)}deg)` }}>
        <IconBadge size={82} tone="solid">
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
            textShadow: "0 5px 26px rgba(0,0,0,0.45)",
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
            textShadow: "0 5px 26px rgba(0,0,0,0.45)",
          }}
        >
          Roda sozinha.
        </div>
      </div>
    </div>
  );
};
