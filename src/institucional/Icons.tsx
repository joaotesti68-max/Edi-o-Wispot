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
