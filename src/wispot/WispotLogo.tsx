import { brand } from "./brand";

// Recreated from the wordmark embroidered on the presenter's shirt
// (lowercase "wispot", wifi arcs over the i, "smart data" tagline) —
// swap for the official logo file once it's confirmed usable.
export const WispotLogo: React.FC<{
  size?: number;
  color?: string;
  showTagline?: boolean;
}> = ({ size = 64, color = brand.colors.white, showTagline = true }) => {
  const wordmarkFontSize = size;
  const iconSize = size * 0.62;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.06 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: size * 0.02 }}>
        <span
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: wordmarkFontSize,
            color,
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          w
        </span>
        <div style={{ position: "relative", width: iconSize * 0.62, height: wordmarkFontSize * 0.98 }}>
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            style={{ position: "absolute", left: "50%", top: -iconSize * 0.66, transform: "translateX(-50%)" }}
          >
            <path
              d="M4 10.5 C7 6.5 17 6.5 20 10.5"
              fill="none"
              stroke={color}
              strokeWidth={2.1}
              strokeLinecap="round"
            />
            <path
              d="M7 14 C9 11.4 15 11.4 17 14"
              fill="none"
              stroke={color}
              strokeWidth={2.1}
              strokeLinecap="round"
            />
            <circle cx="12" cy="18.2" r="1.7" fill={color} />
          </svg>
        </div>
        <span
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: wordmarkFontSize,
            color,
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          spot
        </span>
      </div>
      {showTagline ? (
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: wordmarkFontSize * 0.22,
            color,
            letterSpacing: size * 0.045,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          smart data
        </div>
      ) : null}
    </div>
  );
};
