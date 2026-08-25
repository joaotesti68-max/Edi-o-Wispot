import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../shared/brand";
import { theme } from "./theme";
import { scaleX, slideY } from "./motion";
import { ClockIcon } from "./Icons";

const useReveal = (atFrame: number, shift = 20) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame - atFrame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - progress, 3);
  return { opacity: eased, ...slideY(interpolate(eased, [0, 1], [shift, 0])) };
};

export const EndCard: React.FC = () => {
  const logo = useReveal(0, 16);
  const rule = useReveal(10, 0);
  const cta = useReveal(14);
  const site = useReveal(24);

  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <AbsoluteFill style={{ background: theme.panelBackground }} />
      <AbsoluteFill style={{ background: theme.panelGlow }} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: `0 ${theme.gutter}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 50,
            width: "100%",
          }}
        >
          <Img src={staticFile(brand.logo.white)} style={{ width: 660, ...logo }} />

          <div
            style={{
              width: 180,
              height: 2,
              background: theme.color.primaryLight,
              opacity: rule.opacity,
              ...scaleX(rule.opacity),
            }}
          />

          <div style={{ textAlign: "center", ...cta }}>
            <div
              style={{
                ...theme.type.headline,
                fontSize: 60,
                color: theme.color.white,
              }}
            >
              Comece seu diagnóstico
            </div>
            <div
              style={{
                marginTop: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                ...theme.type.body,
                color: theme.color.muted,
              }}
            >
              <ClockIcon size={30} color={theme.color.primaryLight} strokeWidth={2} />
              Antes que o prazo feche
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              background: theme.color.white,
              color: theme.color.ink,
              borderRadius: 999,
              padding: "20px 50px",
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: -0.2,
              ...site,
            }}
          >
            {brand.site}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
