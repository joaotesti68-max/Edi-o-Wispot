import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

const IN_AT = 10;
const OUT_AT = 115;

/** Identifica quem fala logo na abertura e sai antes de virar poluição. */
export const NameCard: React.FC<{ name: string }> = ({ name }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - IN_AT, fps, config: { damping: 16, mass: 0.7 } });
  const opacity = interpolate(frame, [IN_AT, IN_AT + 12, OUT_AT, OUT_AT + 18], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = interpolate(enter, [0, 1], [-26, 0]);
  // A barra da marca cresce depois do card assentar.
  const barScale = interpolate(enter, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: 56,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `translateX(${shift}px)`,
        background: "rgba(6,9,12,0.55)",
        border: `1.5px solid ${brand.alpha.light30}`,
        borderRadius: 14,
        padding: "14px 26px 14px 18px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          width: 5,
          height: 34,
          background: brand.colors.primaryLight,
          borderRadius: 3,
          transform: `scaleY(${barScale})`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 34,
            color: brand.colors.white,
            letterSpacing: -0.3,
            lineHeight: 1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 19,
            color: brand.colors.primaryLight,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          ProAdvanced
        </div>
      </div>
    </div>
  );
};
