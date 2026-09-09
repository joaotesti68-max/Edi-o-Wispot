type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (strokeWidth: number) => ({
  fill: "none" as const,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const AlertIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7.5" x2="12" y2="13" />
    <circle cx="12" cy="16.3" r="0.9" fill={color} stroke="none" />
  </svg>
);

export const ServerIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <rect x="3" y="3.5" width="18" height="7" rx="1.8" />
    <rect x="3" y="13.5" width="18" height="7" rx="1.8" />
    <circle cx="17.3" cy="7" r="0.9" fill={color} stroke="none" />
    <circle cx="17.3" cy="17" r="0.9" fill={color} stroke="none" />
    <line x1="6.2" y1="7" x2="10" y2="7" />
    <line x1="6.2" y1="17" x2="10" y2="17" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <path d="M12 2.5 L4.5 5.5 V11 C4.5 16 7.8 20 12 21.5 C16.2 20 19.5 16 19.5 11 V5.5 Z" />
    <path d="M8.3 12.2 L10.8 14.7 L15.7 9.3" />
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <polyline points="3,17 9.5,10.5 13.5,14.5 21,6.5" />
    <polyline points="15,6.5 21,6.5 21,12.5" />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <path d="M4 4.5 H20 A1.5 1.5 0 0 1 21.5 6 V15 A1.5 1.5 0 0 1 20 16.5 H9 L4.5 20.5 V16.5 H4 A1.5 1.5 0 0 1 2.5 15 V6 A1.5 1.5 0 0 1 4 4.5 Z" />
    <line x1="7" y1="9" x2="17" y2="9" />
    <line x1="7" y1="12.3" x2="14" y2="12.3" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <path d="M2.5 6.5 H14 V16 H2.5 Z" />
    <path d="M14 9.5 H17.6 L21.5 13 V16 H14 Z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17.5" cy="18" r="2" />
  </svg>
);

export const RadarIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.6" />
    <line x1="12" y1="12" x2="18.4" y2="7.4" />
    <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
  </svg>
);

export const RestoreIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <path d="M3.8 12 A8.2 8.2 0 1 1 6.6 18.1" />
    <polyline points="3.2,7.2 3.8,12 8.6,11.4" />
    <polyline points="12,7.8 12,12.4 15.4,14.2" />
  </svg>
);

export const BoxIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <path d="M12 2.8 L20.5 7 V17 L12 21.2 L3.5 17 V7 Z" />
    <polyline points="3.5,7 12,11.2 20.5,7" />
    <line x1="12" y1="11.2" x2="12" y2="21.2" />
  </svg>
);

export const PeopleIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19.5 C3 15.9 5.7 14 9 14 C12.3 14 15 15.9 15 19.5" />
    <path d="M16.2 5.4 A3.2 3.2 0 0 1 16.2 11.4" />
    <path d="M17.4 14.3 C19.8 14.9 21.4 16.6 21.4 19.5" />
  </svg>
);

export const NetworkIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <circle cx="12" cy="4.6" r="2.2" />
    <circle cx="4.8" cy="18.4" r="2.2" />
    <circle cx="19.2" cy="18.4" r="2.2" />
    <line x1="12" y1="6.8" x2="12" y2="12" />
    <path d="M12 12 L6.2 16.6" />
    <path d="M12 12 L17.8 16.6" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 40, color = "#fff", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base(strokeWidth)}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
    <path d="M8 10.5 V7.6 A4 4 0 0 1 16 7.6 V10.5" />
    <line x1="12" y1="14.2" x2="12" y2="16.8" />
  </svg>
);
