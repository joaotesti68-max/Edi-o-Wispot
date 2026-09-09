import { interpolate, random, useCurrentFrame } from "remotion";
import { brand } from "./brand";

const W = 1080;
const H = 1920;
const COUNT = 58;

type Dot = { x: number; y: number; r: number; phase: number; drift: number };

const dots: Dot[] = Array.from({ length: COUNT }, (_, i) => ({
  x: random(`x${i}`) * W,
  y: random(`y${i}`) * H,
  r: 2 + random(`r${i}`) * 3.4,
  phase: random(`p${i}`) * Math.PI * 2,
  drift: 10 + random(`d${i}`) * 26,
}));

/** Nearby pairs, so the field reads as one fabric rather than confetti. */
const links: [number, number][] = [];
for (let i = 0; i < COUNT; i++) {
  for (let j = i + 1; j < COUNT; j++) {
    const dx = dots[i].x - dots[j].x;
    const dy = dots[i].y - dots[j].y;
    if (Math.hypot(dx, dy) < 250) links.push([i, j]);
  }
}

/** The drifting field that fills the frame behind a full-screen moment. */
export const Mesh: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();

  const at = (d: Dot) => ({
    x: d.x + Math.sin(frame / 46 + d.phase) * d.drift,
    y: d.y + Math.cos(frame / 58 + d.phase) * d.drift * 0.7,
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
    >
      {links.map(([i, j], k) => {
        const a = at(dots[i]);
        const b = at(dots[j]);
        return (
          <line
            key={k}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={brand.colors.primaryLight}
            strokeWidth={1.1}
            opacity={0.2}
          />
        );
      })}
      {dots.map((d, i) => {
        const p = at(d);
        const twinkle = interpolate(Math.sin(frame / 22 + d.phase), [-1, 1], [0.28, 0.85]);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={d.r} fill={brand.colors.primaryLight} opacity={twinkle} />
        );
      })}
    </svg>
  );
};
