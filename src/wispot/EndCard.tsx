import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { WispotLogo } from "./WispotLogo";

// Deliberately not a centered logo-on-gradient card (that's the
// ProAdvanced pattern) — this reads more like a product screen: hero
// headline top, a "next episode" notification toast, browser-bar CTA.
export const EndCard: React.FC<{
  tagline: string;
  teaserLabel: string;
  teaserText: string;
}> = ({ tagline, teaserLabel, teaserText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const taglineIn = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const taglineOpacity = interpolate(taglineIn, [0, 1], [0, 1]);
  const taglineShift = interpolate(taglineIn, [0, 1], [-18, 0]);

  const logoIn = spring({ frame: frame - 10, fps, config: { damping: 15, mass: 0.7 } });
  const logoOpacity = interpolate(logoIn, [0, 1], [0, 1]);
  const logoScale = interpolate(logoIn, [0, 1], [0.86, 1]);

  const teaserIn = spring({ frame: frame - 26, fps, config: { damping: 15, mass: 0.7 } });
  const teaserOpacity = interpolate(teaserIn, [0, 1], [0, 1]);
  const teaserShift = interpolate(teaserIn, [0, 1], [40, 0]);

  const ctaIn = spring({ frame: frame - 44, fps, config: { damping: 16 } });
  const ctaOpacity = interpolate(ctaIn, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: brand.gradient }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 96px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 64,
          right: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 64,
        }}
      >
        <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineShift}px)` }}>
          <div
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 22,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: 1,
              marginBottom: 18,
            }}
          >
            {"// feature da semana"}
          </div>
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.14,
              color: brand.colors.white,
              letterSpacing: -0.8,
            }}
          >
            {tagline}
          </div>
        </div>

        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, transformOrigin: "left center" }}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <WispotLogo size={110} />
          </div>
        </div>

        <div
          style={{
            opacity: teaserOpacity,
            transform: `translateY(${teaserShift}px)`,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 18,
            padding: "26px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: brand.colors.white }} />
            <div
              style={{
                fontFamily: brand.fontFamily,
                fontWeight: 700,
                fontSize: 20,
                color: brand.colors.white,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {teaserLabel}
            </div>
          </div>
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1.32,
              color: brand.colors.white,
            }}
          >
            {teaserText}
          </div>
        </div>

        {brand.cta ? (
          <div
            style={{
              opacity: ctaOpacity,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 12,
              padding: "16px 20px",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 26,
                color: brand.colors.white,
                letterSpacing: 0.3,
              }}
            >
              {brand.cta}
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
