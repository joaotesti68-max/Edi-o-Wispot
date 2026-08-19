import { brand } from "./brand";

/**
 * Stand-in for the Wispot lockup: the Wi-Fi arcs that sit over the "i" in the
 * uniform wordmark, plus the name set in Montserrat. Swap in the official
 * artwork by dropping it into public/brand and rendering an <Img> here.
 */
export const WispotMark: React.FC<{
  size?: number;
  color?: string;
  accent?: string;
  withTagline?: boolean;
}> = ({ size = 56, color = brand.colors.white, accent = brand.colors.primaryLight, withTagline }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.32 }}>
      <WifiArcs size={size} color={accent} />
      <div style={{ display: "flex", flexDirection: "column", gap: size * 0.06 }}>
        <span
          style={{
            fontSize: size,
            fontWeight: 800,
            color,
            letterSpacing: -size * 0.03,
            lineHeight: 1,
          }}
        >
          wispot
        </span>
        {withTagline ? (
          <span
            style={{
              fontSize: size * 0.3,
              fontWeight: 700,
              color,
              opacity: 0.72,
              letterSpacing: size * 0.05,
              lineHeight: 1,
            }}
          >
            smart data
          </span>
        ) : null}
      </div>
    </div>
  );
};

export const WifiArcs: React.FC<{
  size?: number;
  color?: string;
  /** 0 → only the dot, 1 → every arc drawn. Lets the mark animate on. */
  progress?: number;
}> = ({ size = 56, color = brand.colors.primaryLight, progress = 1 }) => {
  // Three arcs sweeping up from a dot, matching the uniform mark.
  const arcs = [
    { r: 13, w: 5.5 },
    { r: 23, w: 6 },
    { r: 33, w: 6.5 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="61" r="6" fill={color} opacity={progress > 0 ? 1 : 0} />
      {arcs.map((arc, i) => {
        // Each arc waits its turn so the signal reads as it "connects".
        const local = Math.min(1, Math.max(0, progress * 3 - i));
        const sweep = 108 * local;
        return (
          <path
            key={i}
            d={describeArc(40, 61, arc.r, -90 - sweep / 2, -90 + sweep / 2)}
            stroke={color}
            strokeWidth={arc.w}
            strokeLinecap="round"
            opacity={local}
          />
        );
      })}
    </svg>
  );
};

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (cx: number, cy: number, r: number, from: number, to: number) => {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  const largeArc = to - from <= 180 ? 0 : 1;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${largeArc} 1 ${b.x} ${b.y}`;
};
