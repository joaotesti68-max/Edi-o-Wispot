import { brand } from "./brand";

/**
 * Reconstrução do lockup Wispot: os arcos de Wi-Fi sobre o "i" do wordmark do
 * uniforme, com o nome em Montserrat. O manual só autoriza duas versões da
 * logomarca — branca (#ffffff) e azul (#25a8e0) — então `color` fica restrito a
 * essas duas. Chegando o vetor oficial, basta trocar o corpo por um <Img>.
 */
export const WispotMark: React.FC<{
  size?: number;
  variant?: "white" | "blue";
  withTagline?: boolean;
}> = ({ size = 56, variant = "white", withTagline }) => {
  const color = variant === "white" ? brand.colors.white : brand.colors.blue;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.32 }}>
      <WifiArcs size={size} color={color} />
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
              opacity: 0.78,
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
  /** 0 → só o ponto, 1 → todos os arcos. Permite animar a entrada da marca. */
  progress?: number;
}> = ({ size = 56, color = brand.colors.white, progress = 1 }) => {
  const arcs = [
    { r: 13, w: 5.5 },
    { r: 23, w: 6 },
    { r: 33, w: 6.5 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="61" r="6" fill={color} opacity={progress > 0 ? 1 : 0} />
      {arcs.map((arc, i) => {
        // Cada arco espera a sua vez, para o sinal "conectar" na entrada.
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
