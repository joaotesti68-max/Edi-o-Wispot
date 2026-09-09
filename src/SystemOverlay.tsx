import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { Mesh } from "./Mesh";
import {
  AlertIcon,
  BoxIcon,
  ChatIcon,
  LockIcon,
  NetworkIcon,
  PeopleIcon,
  RadarIcon,
  RestoreIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  TruckIcon,
} from "./Icons";
import type { IconKey, SystemNode } from "./types";

const ICONS: Record<IconKey, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alert: AlertIcon,
  server: ServerIcon,
  shield: ShieldCheckIcon,
  trending: TrendingUpIcon,
  chat: ChatIcon,
  truck: TruckIcon,
  radar: RadarIcon,
  restore: RestoreIcon,
  box: BoxIcon,
  people: PeopleIcon,
  network: NetworkIcon,
  lock: LockIcon,
};

const W = 1080;
const H = 1920;
const TILE = 196;
const RING = 118;

const captionSize = (label: string) => {
  const longest = Math.max(...label.split(" ").map((w) => w.length));
  return longest > 12 ? 30 : 34;
};

/**
 * A full-frame moment: the mesh comes up over his footage and each node
 * ignites on the word he is saying, wiring itself to the one before it. The
 * video stays visible underneath — this covers the frame, it does not cut.
 */
export const SystemOverlay: React.FC<{ nodes: SystemNode[]; durationInFrames: number }> = ({
  nodes,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha = Math.min(enter, exit);

  const px = (n: SystemNode) => ({ x: n.x * W, y: n.y * H });

  return (
    <AbsoluteFill style={{ opacity: alpha, pointerEvents: "none" }}>
      {/* the footage stays readable underneath */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,10,16,0.52) 0%, rgba(4,10,16,0.72) 45%, rgba(4,10,16,0.84) 100%)",
        }}
      />
      <Mesh opacity={0.85} />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {nodes.slice(1).map((n, i) => {
          const a = px(nodes[i]);
          const b = px(n);
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          const draw = spring({ frame: frame - n.at + 6, fps, config: { damping: 30, mass: 1 } });
          return (
            <line
              key={n.label}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={brand.colors.white}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.62}
              strokeDasharray={len}
              strokeDashoffset={interpolate(draw, [0, 1], [len, 0])}
            />
          );
        })}

        {nodes.map((n) => {
          const p = px(n);
          const local = frame - n.at;
          // one ripple crossing outward as the node lands
          const ripple = interpolate(local, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (local < 0) return null;
          return (
            <circle
              key={n.label}
              cx={p.x}
              cy={p.y}
              r={interpolate(ripple, [0, 1], [RING * 0.6, RING * 2.6])}
              fill="none"
              stroke={brand.colors.primaryLight}
              strokeWidth={interpolate(ripple, [0, 1], [6, 0.5])}
              opacity={interpolate(ripple, [0, 0.25, 1], [0, 0.55, 0])}
            />
          );
        })}
      </svg>

      {nodes.map((n) => {
        const p = px(n);
        const local = frame - n.at;
        if (local < -1) return null;
        const Icon = ICONS[n.icon];
        const pop = spring({ frame: local, fps, config: { damping: 12, mass: 0.6, stiffness: 150 } });
        const glow = interpolate(local, [0, 10, 34], [0, 1, 0.38], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: `${(p.x / W) * 100}%`,
              top: `${(p.y / H) * 100}%`,
              transform: `translate(-50%, -50%) scale(${interpolate(pop, [0, 1], [0.3, 1])})`,
              opacity: interpolate(pop, [0, 0.4], [0, 1]),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: TILE + 90,
            }}
          >
            <div
              style={{
                width: TILE,
                height: TILE,
                borderRadius: 46,
                background: "rgba(6,12,18,0.82)",
                border: `3px solid ${brand.colors.primaryLight}`,
                boxShadow: `0 0 ${30 + glow * 70}px rgba(32,163,214,${0.3 + glow * 0.55})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${interpolate(pop, [0, 1], [-14, 0])}deg)`,
              }}
            >
              <Icon size={96} color={brand.colors.white} strokeWidth={1.8} />
            </div>
            <div
              style={{
                marginTop: 16,
                fontFamily: brand.fontFamily,
                fontWeight: 800,
                fontSize: captionSize(n.label),
                lineHeight: 1.14,
                textAlign: "center",
                color: brand.colors.white,
                letterSpacing: -0.3,
                textShadow: "0 4px 18px rgba(0,0,0,0.8)",
                opacity: interpolate(
                  spring({ frame: local - 6, fps, config: { damping: 18 } }),
                  [0, 1],
                  [0, 1],
                ),
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
