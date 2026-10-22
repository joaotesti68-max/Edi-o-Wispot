import type { StickerKind } from "./edit";

// Wispot brand manual: azul #25A8E0, degradê até #0B91C1, cinza #514D4B,
// branco; Montserrat. No black.
export const wsp = {
  blue: "#25a8e0",
  blueDeep: "#0b91c1",
  gray: "#514d4b",
  white: "#ffffff",
  tint: "#e4f3fb",
  grad: "linear-gradient(150deg, #25a8e0 0%, #0b91c1 100%)",
  font: "Montserrat",
  logoBlue: "wispot/logo-blue.png",
  logoWhite: "wispot/logo-white.png",
  wifiSymbol: "wispot/wifi-symbol.png",
  site: "wispot.com.br",
};

const paths: Record<StickerKind, React.ReactNode> = {
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 13l2.2 2.2L15.5 10.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5V11c0 5 3.3 9 7.5 10.5 4.2-1.5 7.5-5.5 7.5-10.5V5.5Z" />
      <path d="M8.3 12.2l2.5 2.5 4.9-5.4" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
      <path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.8 12.3l2.8 2.8 5.6-6" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M7.1 7.1a7 7 0 0 0 0 9.8M16.9 7.1a7 7 0 0 1 0 9.8" />
      <path d="M4.2 4.2a11 11 0 0 0 0 15.6M19.8 4.2a11 11 0 0 1 0 15.6" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3.5 10v4a1 1 0 0 0 1 1H7l9 4.5v-15L7 9H4.5a1 1 0 0 0-1 1Z" />
      <path d="M19.5 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M7 15l1.5 5" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4Z" />
      <path d="M9.5 14.5l5-5" />
      <circle cx="9.7" cy="9.7" r="0.6" fill="currentColor" />
      <circle cx="14.3" cy="14.3" r="0.6" fill="currentColor" />
    </>
  ),
  poll: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 9h8M8 13h5M8 17h6.5" />
    </>
  ),
  chat: (
    <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5Z" />
  ),
  play: <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />,
};

export const Icon: React.FC<{
  kind: StickerKind;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ kind, size = 48, color = wsp.white, strokeWidth = 2.2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    color={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths[kind]}
  </svg>
);

// The three Wi-Fi arcs from the Wispot mark, drawn so each arc can animate.
export const WifiArcs: React.FC<{
  size: number;
  color?: string;
  progress?: [number, number, number];
  strokeWidth?: number;
}> = ({ size, color = wsp.white, progress = [1, 1, 1], strokeWidth = 3 }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 24 18" fill="none">
    {[
      "M9.2 14.2a4 4 0 0 1 5.6 0",
      "M5.8 10.8a8.8 8.8 0 0 1 12.4 0",
      "M2.4 7.4a13.6 13.6 0 0 1 19.2 0",
    ].map((d, i) => (
      <path
        key={d}
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress[i]}
      />
    ))}
    <circle cx="12" cy="16.6" r="1.4" fill={color} opacity={progress[0]} />
  </svg>
);
