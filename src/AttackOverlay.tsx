import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { Mesh } from "./Mesh";

const W = 1080;
const H = 1920;
const CY = 980; // clear of his face, centred in the lower half

/**
 * Stands in for the one line of the script that was never recorded — "ou um
 * ataque bloqueando o acesso aos dados". It fills the frame over his footage
 * rather than cutting away: the data grid comes up, streaks cross the full
 * width into it, the lock shuts and a shockwave crosses the whole frame.
 */
export const AttackOverlay: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha = Math.min(enter, exit);

  const HIT = 26;
  const impact = interpolate(frame, [HIT, HIT + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockIn = spring({
    frame: frame - HIT,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 180 },
  });
  const flash = interpolate(frame, [HIT, HIT + 3, HIT + 16], [0, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // the shockwave leaves the lock and crosses the whole frame
  const wave = interpolate(frame, [HIT, HIT + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows = [0, 1, 2, 3];
  const streaks = [0, 1, 2, 3, 4];

  return (
    <AbsoluteFill style={{ opacity: alpha, pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,10,16,0.5) 0%, rgba(4,10,16,0.76) 44%, rgba(4,10,16,0.88) 100%)",
        }}
      />
      <Mesh opacity={0.7} />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* the data, as rows of cells spanning the frame */}
        {rows.map((r) => {
          const y = CY - 250 + r * 132;
          const grow = spring({ frame: frame - 2 - r * 3, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <g key={r} opacity={interpolate(impact, [0, 1], [1, 0.26])}>
              {[0, 1, 2, 3, 4].map((c) => (
                <rect
                  key={c}
                  x={70 + c * 190}
                  y={y}
                  width={interpolate(grow, [0, 1], [0, 160])}
                  height={86}
                  rx={18}
                  fill="rgba(54,150,205,0.3)"
                  stroke={brand.colors.primaryLight}
                  strokeWidth={3}
                />
              ))}
            </g>
          );
        })}

        {/* the attack, crossing the full width */}
        {streaks.map((i) => {
          const t = interpolate(frame, [4 + i * 3, HIT + i * 2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = CY - 300 + i * 150;
          const x = interpolate(t, [0, 1], [W + 260, -160]);
          return (
            <g key={i} opacity={interpolate(t, [0, 0.12, 0.8, 1], [0, 1, 1, 0])}>
              <rect x={x} y={y} width={230} height={9} rx={4.5} fill={brand.colors.white} />
              <rect
                x={x + 250}
                y={y}
                width={110}
                height={9}
                rx={4.5}
                fill={brand.colors.white}
                opacity={0.4}
              />
            </g>
          );
        })}

        <rect x={0} y={0} width={W} height={H} fill={brand.colors.white} opacity={flash} />

        {/* shockwave */}
        <circle
          cx={W / 2}
          cy={CY}
          r={interpolate(wave, [0, 1], [90, 1180])}
          fill="none"
          stroke={brand.colors.white}
          strokeWidth={interpolate(wave, [0, 1], [12, 0.5])}
          opacity={interpolate(wave, [0, 0.2, 1], [0, 0.5, 0])}
        />

        {/* the lock shuts */}
        <g
          transform={`translate(${W / 2} ${CY}) scale(${interpolate(lockIn, [0, 1], [0.15, 1])}) translate(${-W / 2} ${-CY})`}
          opacity={interpolate(lockIn, [0, 0.35], [0, 1], { extrapolateLeft: "clamp" })}
        >
          <circle
            cx={W / 2}
            cy={CY}
            r={148}
            fill="rgba(6,9,12,0.9)"
            stroke={brand.colors.white}
            strokeWidth={7}
          />
          <g
            stroke={brand.colors.white}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x={W / 2 - 62} y={CY - 12} width={124} height={92} rx={18} />
            <path d={`M${W / 2 - 38} ${CY - 12} V${CY - 46} a38 38 0 0 1 76 0 V${CY - 12}`} />
          </g>
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + 210,
          textAlign: "center",
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 58,
          letterSpacing: -0.8,
          color: brand.colors.white,
          textShadow: "0 6px 26px rgba(0,0,0,0.75)",
          opacity: interpolate(
            spring({ frame: frame - HIT - 4, fps, config: { damping: 18 } }),
            [0, 1],
            [0, 1],
          ),
        }}
      >
        Acesso aos dados bloqueado
      </div>
    </AbsoluteFill>
  );
};
