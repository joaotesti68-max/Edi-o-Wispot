import { useCurrentFrame } from "remotion";

// Pro Advanced Manual de Marca 2026: azul #3696CD, degradê até #20A3D6,
// cinza #676868, branco; Montserrat. The deep tone only marks threats.
export const pa = {
  blue: "#3696cd",
  light: "#20a3d6",
  gray: "#676868",
  white: "#ffffff",
  deep: "#1c3f57",
  tint: "#e6f2fa",
  grad: "linear-gradient(150deg, #3696cd 0%, #20a3d6 100%)",
  font: "Montserrat",
  logoWhite: "brand/logo-white.png",
  logoColor: "brand/logo-color.png",
  iconWhite: "brand/icon-white.png",
  site: "proadvanced.com.br",
};

export type IconKind =
  | "laptop"
  | "phone"
  | "desktop"
  | "tablet"
  | "server"
  | "bug"
  | "coffee"
  | "home"
  | "building"
  | "clip"
  | "refresh"
  | "lost"
  | "alert"
  | "list"
  | "key"
  | "eye"
  | "lock"
  | "shield"
  | "check"
  | "x"
  | "pin"
  | "pointer"
  | "zap"
  | "mail"
  | "user"
  | "wifi";

const paths: Record<IconKind, React.ReactNode> = {
  laptop: (
    <>
      <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
      <path d="M2 19.5h20" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  desktop: (
    <>
      <rect x="2.5" y="3.5" width="19" height="13" rx="1.5" />
      <path d="M9 21h6M12 16.5V21" />
    </>
  ),
  tablet: (
    <>
      <rect x="4.5" y="2.5" width="15" height="19" rx="2" />
      <circle cx="12" cy="18" r="0.6" fill="currentColor" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="3.5" width="18" height="7" rx="1.8" />
      <rect x="3" y="13.5" width="18" height="7" rx="1.8" />
      <circle cx="17.3" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="17.3" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <path d="M6.2 7H10M6.2 17H10" />
    </>
  ),
  bug: (
    <>
      <rect x="7.5" y="7.5" width="9" height="12" rx="4.5" />
      <path d="M9.5 7.5a2.5 2.5 0 0 1 5 0M12 11v8.5M3.5 9.5l4 2M20.5 9.5l-4 2M3.5 19l4-2M20.5 19l-4-2M3 14h4.5M21 14h-4.5" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3.5v2.5M12 3.5v2.5" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  building: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="1" />
      <path d="M8.5 7h2M13.5 7h2M8.5 11h2M13.5 11h2M8.5 15h2M13.5 15h2M10.5 21v-3h3v3" />
    </>
  ),
  clip: (
    <path d="M20 11.5 12.2 19.3a5 5 0 0 1-7.1-7.1l7.8-7.8a3.3 3.3 0 0 1 4.7 4.7l-7.8 7.8a1.7 1.7 0 0 1-2.4-2.4l7.1-7.1" />
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" />
      <path d="M18.5 3v4h-4M5.5 21v-4h4" />
    </>
  ),
  lost: (
    <>
      <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
      <path d="M2 19.5h20" />
      <path d="M10.3 8.4a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1" />
      <circle cx="12" cy="13" r="0.5" fill="currentColor" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.3" r="0.7" fill="currentColor" />
    </>
  ),
  list: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="M11.2 11.8 20 3M17 6l2.5 2.5M14.5 8.5 16.5 10.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5V11c0 5 3.3 9 7.5 10.5 4.2-1.5 7.5-5.5 7.5-10.5V5.5Z" />
      <path d="M8.3 12.2l2.5 2.5 4.9-5.4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  pin: (
    <>
      <path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  pointer: (
    <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0v4.5a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3.6 14a1.6 1.6 0 0 1 2.6-1.9L9 15" />
  ),
  zap: <path d="M13 2.5 4 13.5h7l-1 8 9-11h-7Z" />,
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.7 16a5 5 0 0 1 6.6 0" />
      <circle cx="12" cy="19.3" r="1" fill="currentColor" />
    </>
  ),
};

export const Icon: React.FC<{
  kind: IconKind;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ kind, size = 48, color = pa.white, strokeWidth = 2 }) => (
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
    style={{ display: "block" }}
  >
    {paths[kind]}
  </svg>
);

// The square-tile texture from the brand manual covers, with a few tiles
// brightening and fading over time.
export const TileGrid: React.FC<{ opacity?: number; color?: string }> = ({
  opacity = 0.1,
  color = pa.white,
}) => {
  const frame = useCurrentFrame();
  const step = 54;
  const cols = Math.ceil(1080 / step) + 1;
  const rows = Math.ceil(1920 / step) + 1;
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const twinkle =
        rnd > 0.86 ? 0.5 + 0.5 * Math.sin(frame / 14 + rnd * 40) : 0;
      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={c * step + 4}
          y={r * step + 4}
          width={step - 8}
          height={step - 8}
          rx={7}
          fill={color}
          opacity={opacity * (1 + twinkle * 2.2)}
        />,
      );
    }
  }
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0 }}
      viewBox="0 0 1080 1920"
    >
      {tiles}
    </svg>
  );
};
