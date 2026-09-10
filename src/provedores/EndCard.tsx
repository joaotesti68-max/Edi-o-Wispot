import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Eco do sinal do logotipo, no mesmo papel das ondas de fundo das peças sociais. */
const Ondas: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity }}>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920">
      {[300, 480, 660, 840, 1020].map((r) => (
        <circle
          key={r}
          cx="540"
          cy="1760"
          r={r}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity="0.14"
        />
      ))}
    </svg>
  </AbsoluteFill>
);

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  const ondas = interpolate(frame, [0, 30], [0, 1], ease);
  const logoOpacity = interpolate(frame, [2, 20], [0, 1], ease);
  const logoShift = interpolate(frame, [2, 20], [16, 0], ease);
  const ctaOpacity = interpolate(frame, [16, 34], [0, 1], ease);
  const ctaShift = interpolate(frame, [16, 34], [18, 0], ease);
  const pillOpacity = interpolate(frame, [30, 48], [0, 1], ease);
  const pillScale = interpolate(frame, [30, 48], [0.94, 1], ease);

  return (
    <AbsoluteFill
      style={{ background: wispot.cyan, alignItems: "center", justifyContent: "center" }}
    >
      <Ondas opacity={ondas} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 52,
          padding: "0 84px",
        }}
      >
        <Img
          src={staticFile(wispot.logo.white)}
          style={{ width: 470, opacity: logoOpacity, transform: `translateY(${logoShift}px)` }}
        />

        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 48,
            lineHeight: 1.26,
            color: wispot.white,
            textAlign: "center",
            letterSpacing: -0.3,
            opacity: ctaOpacity,
            transform: `translateY(${ctaShift}px)`,
          }}
        >
          Cinco passos sobre a estrutura que você já opera.
          <br />
          <span style={{ fontWeight: 800 }}>Vamos conversar?</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: pillOpacity,
            transform: `scale(${pillScale})`,
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 30,
              color: wispot.navy,
              background: wispot.white,
              borderRadius: 999,
              padding: "17px 44px",
            }}
          >
            Fale conosco
          </div>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 999,
              background: wispot.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={wispot.navy} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="19" y2="12" />
              <polyline points="13,6 19,12 13,18" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
