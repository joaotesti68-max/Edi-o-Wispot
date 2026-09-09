import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { Mesh } from "./Mesh";
import { TruckIcon } from "./Icons";

const W = 1080;
const H = 1920;

// One cubic sweeping up across the frame: below his face, and clear of the
// headline block and its icon badge in the bottom-left corner.
const P = [
  { x: 146, y: 1432 },
  { x: 520, y: 1414 },
  { x: 404, y: 936 },
  { x: 1002, y: 872 },
];

const pointAt = (t: number) => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * P[0].x + b * P[1].x + c * P[2].x + d * P[3].x,
    y: a * P[0].y + b * P[1].y + c * P[2].y + d * P[3].y,
  };
};

const SAMPLES = 90;
const path = Array.from({ length: SAMPLES + 1 }, (_, i) => pointAt(i / SAMPLES));
const d = path.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
const LENGTH = path.reduce(
  (sum, p, i) => (i === 0 ? 0 : sum + Math.hypot(p.x - path[i - 1].x, p.y - path[i - 1].y)),
  0,
);

const HALT = 0.6;
const STOPS = [0.73, 0.84, 0.95];

/**
 * The opening line — "não é preciso um caminhão parar para a operação inteira
 * ficar comprometida". The route draws itself, the truck runs it and halts,
 * and every waypoint past the halt goes dark in turn.
 */
export const RouteOverlay: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const alpha = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const draw = interpolate(frame, [4, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const t = interpolate(frame, [12, 54], [0, HALT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const truck = pointAt(t);

  const halted = frame >= 54;
  const haltRing = interpolate(frame, [54, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = halted ? Math.sin((frame - 54) / 1.6) * Math.max(0, 7 - (frame - 54) * 0.5) : 0;

  return (
    <AbsoluteFill style={{ opacity: alpha, pointerEvents: "none" }}>
      {/* lighter than the other overlays — the opening should keep him present */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,10,16,0.14) 0%, rgba(4,10,16,0.42) 46%, rgba(4,10,16,0.78) 100%)",
        }}
      />
      <Mesh opacity={0.42} />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <path
          d={d}
          fill="none"
          stroke={brand.colors.primaryLight}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${LENGTH}`}
          strokeDashoffset={interpolate(draw, [0, 1], [LENGTH, 0])}
          opacity={0.5}
        />
        {/* the stretch already run stays lit */}
        <path
          d={d}
          fill="none"
          stroke={brand.colors.white}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${LENGTH * t} ${LENGTH}`}
          opacity={0.92}
        />

        {STOPS.map((s, i) => {
          const p = pointAt(s);
          // each waypoint past the halt goes out in turn
          const off = interpolate(frame, [64 + i * 11, 76 + i * 11], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={s} opacity={interpolate(draw, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" })}>
              <circle
                cx={p.x}
                cy={p.y}
                r={interpolate(off, [0, 1], [20, 12])}
                fill={brand.colors.white}
                opacity={interpolate(off, [0, 1], [0.95, 0.18])}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={interpolate(off, [0, 1], [20, 44])}
                fill="none"
                stroke={brand.colors.white}
                strokeWidth={3}
                opacity={interpolate(off, [0, 0.4, 1], [0, 0.5, 0])}
              />
            </g>
          );
        })}

        {/* the halt */}
        <circle
          cx={truck.x}
          cy={truck.y}
          r={interpolate(haltRing, [0, 1], [58, 300])}
          fill="none"
          stroke={brand.colors.white}
          strokeWidth={interpolate(haltRing, [0, 1], [8, 0.5])}
          opacity={interpolate(haltRing, [0, 0.2, 1], [0, 0.55, 0])}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: `${(truck.x / W) * 100}%`,
          top: `${(truck.y / H) * 100}%`,
          transform: `translate(-50%, -50%) translateX(${shake}px) scale(${interpolate(
            spring({ frame: frame - 10, fps, config: { damping: 13, mass: 0.6 } }),
            [0, 1],
            [0.3, 1],
          )})`,
          width: 150,
          height: 150,
          borderRadius: 40,
          background: "rgba(6,12,18,0.86)",
          border: `3px solid ${brand.colors.white}`,
          boxShadow: `0 0 ${halted ? 70 : 26}px rgba(32,163,214,${halted ? 0.7 : 0.35})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TruckIcon size={82} color={brand.colors.white} strokeWidth={1.9} />
      </div>
    </AbsoluteFill>
  );
};
