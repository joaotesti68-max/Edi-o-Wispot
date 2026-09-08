import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { theme } from "./theme";
import { STEPS } from "./content";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [2, 18], [0, 1], ease);
  const logoShift = interpolate(frame, [2, 18], [14, 0], ease);
  const ctaOpacity = interpolate(frame, [14, 30], [0, 1], ease);
  const siteOpacity = interpolate(frame, [26, 42], [0, 1], ease);

  return (
    <AbsoluteFill
      style={{
        background: theme.ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 34%, rgba(54,150,205,0.20) 0%, rgba(7,10,13,0) 58%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 46,
          padding: "0 80px",
        }}
      >
        <Img
          src={staticFile(brand.logo.white)}
          style={{ width: 480, opacity: logoOpacity, transform: `translateY(${logoShift}px)` }}
        />

        <div style={{ display: "flex", gap: 10, opacity: ctaOpacity }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  fontFamily: brand.fontFamily,
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: 1.4,
                  color: theme.accentBright,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              {i < STEPS.length - 1 ? (
                <div style={{ width: 18, height: 2, background: theme.rule }} />
              ) : null}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1.2,
            color: theme.white,
            textAlign: "center",
            letterSpacing: -0.4,
            opacity: ctaOpacity,
          }}
        >
          Vamos conversar sobre o que dá pra agregar?
        </div>

        <div
          style={{
            opacity: siteOpacity,
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 0.4,
            color: theme.white,
            border: `2px solid ${theme.accent}`,
            borderRadius: 999,
            padding: "15px 42px",
          }}
        >
          {brand.site}
        </div>
      </div>
    </AbsoluteFill>
  );
};
