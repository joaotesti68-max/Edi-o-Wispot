type IconProps = { size?: number; color?: string; strokeWidth?: number };

const stroke = (strokeWidth: number) => ({
  fill: "none" as const,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Grade 24x24, traço aberto — mesmo desenho do ícone do logotipo. */
const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 40,
  color = "#fff",
  strokeWidth = 1.9,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...stroke(strokeWidth)}>
    {children}
  </svg>
);

/** Cadeado dentro de um anel — eco direto da marca ProAdvanced. */
export const SealLockIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <circle cx="12" cy="12" r="6.6" strokeDasharray="1.6 2.2" />
    <rect x="9.4" y="11.4" width="5.2" height="4.4" rx="1" />
    <path d="M10.5 11.4V10.1a1.5 1.5 0 0 1 3 0v1.3" />
  </Svg>
);

export const ScanIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 8V5.4A1.9 1.9 0 0 1 5.4 3.5H8" />
    <path d="M16 3.5h2.6a1.9 1.9 0 0 1 1.9 1.9V8" />
    <path d="M20.5 16v2.6a1.9 1.9 0 0 1-1.9 1.9H16" />
    <path d="M8 20.5H5.4a1.9 1.9 0 0 1-1.9-1.9V16" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
  </Svg>
);

export const AccessIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="8.2" cy="12" r="3.4" />
    <line x1="11.6" y1="12" x2="20.5" y2="12" />
    <line x1="17.6" y1="12" x2="17.6" y2="15.4" />
    <line x1="20.5" y1="12" x2="20.5" y2="16.4" />
  </Svg>
);

export const BackupIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6.3" rx="7" ry="2.8" />
    <path d="M5 6.3v5.4c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6.3" />
    <path d="M5 11.7v5.4c0 1.55 3.13 2.8 7 2.8 1.1 0 2.14-.1 3.05-.28" />
    <path d="M17.6 17.2l1.9 1.9 2.4-2.7" />
  </Svg>
);

export const UsersIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="9.4" cy="8.6" r="3.3" />
    <path d="M3.6 19.6c0-3.2 2.6-5.4 5.8-5.4s5.8 2.2 5.8 5.4" />
    <path d="M16.2 6.1a3.3 3.3 0 0 1 0 6.2" />
    <path d="M17.6 14.6c1.8.6 2.9 2.2 2.9 4.3" />
  </Svg>
);

export const MonitorPulseIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="2.8" y="4.2" width="18.4" height="12.4" rx="1.9" />
    <line x1="8.4" y1="20.3" x2="15.6" y2="20.3" />
    <line x1="12" y1="16.6" x2="12" y2="20.3" />
    <polyline points="6.4,10.9 8.9,10.9 10.4,8.1 12.5,13.4 14.1,10.9 17.6,10.9" />
  </Svg>
);

export const DocCheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6.3 2.9h7.1l4.3 4.3v13.9H6.3z" />
    <polyline points="13.4,2.9 13.4,7.2 17.7,7.2" />
    <polyline points="9.1,14.1 11.1,16.1 15.1,11.7" />
  </Svg>
);

export const GavelIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="10.4" y="2.4" width="9.4" height="4.6" rx="1.2" transform="rotate(45 15.1 4.7)" />
    <line x1="11.3" y1="8.3" x2="5.6" y2="14" />
    <rect x="3.2" y="14.3" width="6.4" height="3.2" rx="1.1" transform="rotate(45 6.4 15.9)" />
    <line x1="12.9" y1="21.1" x2="21.3" y2="21.1" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <polyline points="12,6.6 12,12 16,14.1" />
  </Svg>
);
