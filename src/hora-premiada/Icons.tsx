type IconProps = { size?: number; color?: string; strokeWidth?: number };

const stroke = (strokeWidth: number) => ({
  fill: "none" as const,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 40,
  color = "#fff",
  strokeWidth = 2,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...stroke(strokeWidth)}>
    {children}
  </svg>
);

export const ClockIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,6.6 12,12 16,14.2" />
  </Svg>
);

export const TicketIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3 8.2 V6.4 A1.4 1.4 0 0 1 4.4 5 H19.6 A1.4 1.4 0 0 1 21 6.4 V8.2 A2.2 2.2 0 0 0 21 15.8 V17.6 A1.4 1.4 0 0 1 19.6 19 H4.4 A1.4 1.4 0 0 1 3 17.6 V15.8 A2.2 2.2 0 0 0 3 8.2 Z" />
    <line x1="14.6" y1="5" x2="14.6" y2="7.6" />
    <line x1="14.6" y1="10.7" x2="14.6" y2="13.3" />
    <line x1="14.6" y1="16.4" x2="14.6" y2="19" />
  </Svg>
);

export const WifiIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M2.8 9.1 A14 14 0 0 1 21.2 9.1" />
    <path d="M6.2 12.9 A9 9 0 0 1 17.8 12.9" />
    <path d="M9.5 16.6 A4.2 4.2 0 0 1 14.5 16.6" />
    <circle cx="12" cy="19.8" r="0.9" fill={p.color ?? "#fff"} stroke="none" />
  </Svg>
);

export const BoxIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M21 8.1 L12 3.2 L3 8.1 V15.9 L12 20.8 L21 15.9 Z" />
    <polyline points="3,8.1 12,13 21,8.1" />
    <line x1="12" y1="13" x2="12" y2="20.8" />
  </Svg>
);

export const RepeatIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 12.6 A8 8 0 0 1 16.8 6.2" />
    <polyline points="17.2,2.6 17.2,6.6 13.2,6.6" />
    <path d="M20 11.4 A8 8 0 0 1 7.2 17.8" />
    <polyline points="6.8,21.4 6.8,17.4 10.8,17.4" />
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 20.3 C5.2 16 3 12.7 3 9.6 A4.4 4.4 0 0 1 12 7.4 A4.4 4.4 0 0 1 21 9.6 C21 12.7 18.8 16 12 20.3 Z" />
  </Svg>
);

export const CrossIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="8.8" y1="8.8" x2="15.2" y2="15.2" />
    <line x1="15.2" y1="8.8" x2="8.8" y2="15.2" />
  </Svg>
);

export const TrendingUpIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <polyline points="3,17 9.5,10.5 13.5,14.5 21,6.5" />
    <polyline points="15,6.5 21,6.5 21,12.5" />
  </Svg>
);

export const ChatIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 4.5 H20 A1.5 1.5 0 0 1 21.5 6 V15 A1.5 1.5 0 0 1 20 16.5 H9 L4.5 20.5 V16.5 H4 A1.5 1.5 0 0 1 2.5 15 V6 A1.5 1.5 0 0 1 4 4.5 Z" />
    <line x1="7" y1="9" x2="17" y2="9" />
    <line x1="7" y1="12.3" x2="14" y2="12.3" />
  </Svg>
);

export const SparkIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3 L13.9 9.3 L20 11.2 L13.9 13.1 L12 19.4 L10.1 13.1 L4 11.2 L10.1 9.3 Z" />
  </Svg>
);
