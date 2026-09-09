import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

const W = 640;
const H = 300;

/**
 * Stands in for the one line of the script that was never recorded — "ou um
 * ataque bloqueando o acesso aos dados" — as an animation over his footage
 * rather than a cut away from it: the data stack goes up, the attack streaks
 * in, and the lock shuts.
 */
export const AttackOverlay: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });
  const exit = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha = Math.min(interpolate(enter, [0, 1], [0, 1]), exit);

  // the lock lands at frame 26 and the stack dims behind it
  const impact = interpolate(frame, [24, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockIn = spring({ frame: frame - 24, fps, config: { damping: 10, mass: 0.6, stiffness: 170 } });
  const flash = interpolate(frame, [24, 27, 38], [0, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bars = [0, 1, 2].map((i) => {
    const s = spring({ frame: frame - 2 - i * 3, fps, config: { damping: 15, mass: 0.6 } });
    return { grow: s, dim: interpolate(impact, [0, 1], [1, 0.34]) };
  });

  // three streaks crossing right to left into the stack
  const darts = [0, 1, 2].map((i) => {
    const t = interpolate(frame, [8 + i * 4, 26 + i * 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x: interpolate(t, [0, 1], [W + 90, W / 2 + 42]), o: interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0]), y: 96 + i * 54 };
  });

  return (
    <AbsoluteFill style={{ opacity: alpha, pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 62% 26% at 50% 68%, rgba(4,10,16,0.74) 0%, rgba(4,10,16,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 470,
          transform: `translateX(-50%) scale(${interpolate(enter, [0, 1], [0.88, 1])})`,
        }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* data stack */}
          {bars.map((b, i) => {
            const y = 62 + i * 62;
            const w = interpolate(b.grow, [0, 1], [0, 300]);
            return (
              <g key={i} opacity={b.dim}>
                <rect
                  x={W / 2 - 150}
                  y={y}
                  width={w}
                  height={46}
                  rx={12}
                  fill="rgba(54,150,205,0.34)"
                  stroke={brand.colors.primaryLight}
                  strokeWidth={3}
                />
                <circle
                  cx={W / 2 - 150 + 28}
                  cy={y + 23}
                  r={6}
                  fill={brand.colors.white}
                  opacity={interpolate(b.grow, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" })}
                />
              </g>
            );
          })}

          {/* the attack */}
          {darts.map((d, i) => (
            <g key={i} opacity={d.o}>
              <rect x={d.x} y={d.y} width={120} height={7} rx={3.5} fill={brand.colors.white} />
              <rect
                x={d.x + 128}
                y={d.y}
                width={54}
                height={7}
                rx={3.5}
                fill={brand.colors.white}
                opacity={0.45}
              />
            </g>
          ))}

          {/* impact flash across the stack */}
          <rect
            x={W / 2 - 168}
            y={44}
            width={336}
            height={200}
            rx={20}
            fill={brand.colors.white}
            opacity={flash}
          />

          {/* the lock shuts */}
          <g
            transform={`translate(${W / 2} 148) scale(${interpolate(lockIn, [0, 1], [0.2, 1])}) translate(${-W / 2} -148)`}
            opacity={interpolate(lockIn, [0, 0.4], [0, 1], { extrapolateLeft: "clamp" })}
          >
            <circle cx={W / 2} cy={148} r={70} fill="rgba(6,9,12,0.82)" stroke={brand.colors.white} strokeWidth={4} />
            <g
              stroke={brand.colors.white}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x={W / 2 - 30} y={140} width={60} height={44} rx={9} />
              <path d={`M${W / 2 - 18} 140 V126 a18 18 0 0 1 36 0 V140`} />
            </g>
          </g>
        </svg>

        <div
          style={{
            marginTop: 6,
            textAlign: "center",
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: -0.5,
            color: brand.colors.white,
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            opacity: interpolate(
              spring({ frame: frame - 28, fps, config: { damping: 18 } }),
              [0, 1],
              [0, 1],
            ),
          }}
        >
          Acesso aos dados bloqueado
        </div>
      </div>
    </AbsoluteFill>
  );
};
