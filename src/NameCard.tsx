import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

const IN_AT = 8;
const OUT_AT = 96;

export const NameCard: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - IN_AT, fps, config: { damping: 16, mass: 0.7 } });
  const opacity = interpolate(frame, [IN_AT, IN_AT + 10, OUT_AT, OUT_AT + 12], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = interpolate(enter, [0, 1], [-40, 0]);
  const barScale = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        left: 60,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "22px 34px 22px 26px",
        borderRadius: 20,
        background: "rgba(6,9,12,0.58)",
        border: "1.5px solid rgba(54,150,205,0.55)",
        backdropFilter: "blur(14px)",
        opacity,
        transform: `translateX(${shift}px)`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 68,
          borderRadius: 3,
          background: brand.colors.primaryLight,
          transform: `scaleY(${barScale})`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 52,
            lineHeight: 1,
            color: brand.colors.white,
            letterSpacing: -0.6,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 24,
            lineHeight: 1,
            color: "rgba(255,255,255,0.78)",
            letterSpacing: 0.4,
          }}
        >
          {role}
        </div>
      </div>
      <Img src={staticFile(brand.logo.iconWhite)} style={{ width: 44, marginLeft: 10, opacity: 0.9 }} />
    </div>
  );
};
