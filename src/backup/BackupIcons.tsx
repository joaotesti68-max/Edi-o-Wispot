type IconProps = { size?: number; color?: string; strokeWidth?: number };

const wrap = (strokeWidth: number) => ({
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
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...wrap(strokeWidth)}>
    {children}
  </svg>
);

export const BuildingIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 21h17" />
    <path d="M5.5 21V4.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1V21" />
    <path d="M14.5 10h3.5a1 1 0 0 1 1 1v10" />
    <path d="M8 7.5h3.5M8 11h3.5M8 14.5h3.5" />
  </Svg>
);

export const RackIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="4" y="2.8" width="16" height="18.4" rx="1.6" />
    <path d="M7 6.4h10M7 10h10M7 13.6h10M7 17.2h6" />
  </Svg>
);

export const CloudUpIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6.8 18.5h10.4a3.7 3.7 0 0 0 .5-7.36 5.4 5.4 0 0 0-10.4-1.3A3.9 3.9 0 0 0 6.8 18.5Z" />
    <path d="M12 16.2v-5.4M9.8 12.6 12 10.4l2.2 2.2" />
  </Svg>
);

export const BoltIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M13.2 2.5 5.5 13.4h5.4l-.8 8.1 7.9-11.1h-5.6l.8-7.9Z" />
  </Svg>
);

export const ThermoIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M10 13.6V5.2a2 2 0 1 1 4 0v8.4a4.2 4.2 0 1 1-4 0Z" />
    <path d="M12 9.2v7.2" />
  </Svg>
);

export const UptimeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 6.8V12l3.4 2.1" />
  </Svg>
);

export const CopyIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3.4" y="3.4" width="12" height="12" rx="2" />
    <path d="M8.6 20.6h10a2 2 0 0 0 2-2v-10" />
  </Svg>
);

export const MediaIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6.2" rx="7.4" ry="3" />
    <path d="M4.6 6.2v11.6c0 1.66 3.31 3 7.4 3s7.4-1.34 7.4-3V6.2" />
    <path d="M4.6 12c0 1.66 3.31 3 7.4 3s7.4-1.34 7.4-3" />
  </Svg>
);

export const OffsiteIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3 20.6h18" />
    <path d="M5.4 20.6v-9l4.2-3.2v12.2" />
    <rect x="13" y="7.6" width="6" height="13" rx="1.2" />
    <path d="M15.4 11h1.2M15.4 14.2h1.2M15.4 17.4h1.2" />
  </Svg>
);

export const FlameIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 2.8s5.2 4.1 5.2 9.2a5.2 5.2 0 1 1-10.4 0c0-2 1-3.6 1.9-4.6.3 1.3 1 2.1 1.8 2.1 1.1 0 1.7-1.2 1.5-6.7Z" />
  </Svg>
);

export const ThiefIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3.6" y="10.4" width="16.8" height="10.2" rx="2" />
    <path d="M7.6 10.4V7.2a4.4 4.4 0 0 1 8.8 0v3.2" />
    <path d="M12 14.4v2.4" />
  </Svg>
);

export const BugIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="7.4" y="7.6" width="9.2" height="11.4" rx="4.6" />
    <path d="M9.4 6.2 8.2 4.4M14.6 6.2l1.2-1.8" />
    <path d="M7.4 11.4H4.2M7.4 15.4H4.2M16.6 11.4h3.2M16.6 15.4h3.2" />
  </Svg>
);

export const HardwareIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3.4" y="7.4" width="17.2" height="9.2" rx="1.8" />
    <path d="M7 11h6M7 13.6h3.6" />
    <circle cx="17.4" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <path d="M7.4 7.4V5M16.6 7.4V5M7.4 19v-2.4M16.6 19v-2.4" />
  </Svg>
);

export const ShieldIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 2.6 4.4 5.6v5.6c0 5 3.3 9.1 7.6 10.6 4.3-1.5 7.6-5.6 7.6-10.6V5.6Z" />
    <path d="M8.4 12.2 10.9 14.7 15.8 9.4" />
  </Svg>
);

export const AlertIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3.4 21 19.6H3Z" />
    <path d="M12 9.6v4.2" />
    <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M7.4 3.6 9.6 8 7.8 9.9a12 12 0 0 0 6.3 6.3l1.9-1.8 4.4 2.2v3a2 2 0 0 1-2.2 2C11.5 21 3 12.5 2.4 5.8A2 2 0 0 1 4.4 3.6Z" />
  </Svg>
);
