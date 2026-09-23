type IconProps = { size?: number; color?: string; strokeWidth?: number };

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 40,
  color = "#fff",
  strokeWidth = 2,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    fill="none"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const WifiIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M2.5 9a13.5 13.5 0 0 1 19 0" />
    <path d="M5.8 12.4a8.8 8.8 0 0 1 12.4 0" />
    <path d="M9.1 15.8a4.1 4.1 0 0 1 5.8 0" />
    <circle cx="12" cy="19.2" r="0.9" fill={p.color ?? "#fff"} stroke="none" />
  </Svg>
);

export const WifiOffIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3 3l18 18" />
    <path d="M8.6 5.2A13.5 13.5 0 0 1 21.5 9" />
    <path d="M2.5 9a13.4 13.4 0 0 1 3-2.2" />
    <path d="M5.8 12.4a8.8 8.8 0 0 1 3.4-2.1" />
    <path d="M9.1 15.8a4.1 4.1 0 0 1 5.8 0" />
    <circle cx="12" cy="19.2" r="0.9" fill={p.color ?? "#fff"} stroke="none" />
  </Svg>
);

export const SlowIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4.2 17.5a8.6 8.6 0 1 1 15.6 0" />
    <path d="M12 13.2 8 9.6" />
    <circle cx="12" cy="13.6" r="1.3" />
  </Svg>
);

export const InterferenceIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M2.5 12c1.6-3.2 3.2-3.2 4.8 0s3.2 3.2 4.7 0 3.2-3.2 4.7 0 3.2 3.2 4.8 0" />
    <path d="M2.5 6.5c1.6-2 3.2-2 4.8 0M16.7 17.5c1.6 2 3.2 2 4.8 0" />
  </Svg>
);

export const StallIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M9.8 8.8v6.4M14.2 8.8v6.4" />
  </Svg>
);

export const KeyIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="7.8" cy="15.8" r="4" />
    <path d="M10.6 13 20 3.6M16.4 7.2l2.6 2.6M14 9.6l2 2" />
  </Svg>
);

export const LockOpenIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 7.7-1.5" />
    <path d="M12 14.6v2.4" />
  </Svg>
);

export const LayersIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3 2.8 7.8 12 12.6l9.2-4.8L12 3Z" />
    <path d="m2.8 12.2 9.2 4.8 9.2-4.8" />
    <path d="m2.8 16.4 9.2 4.8 9.2-4.8" />
  </Svg>
);

export const DevicesIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="2.8" y="4.5" width="13" height="9.5" rx="1.4" />
    <path d="M6 18h6.5M9.2 14v4" />
    <rect x="16.8" y="8.2" width="4.6" height="11.3" rx="1.2" />
  </Svg>
);

export const DoorOpenIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 21h17" />
    <path d="M6 21V3.8h9.5V21" />
    <path d="M15.5 3.8 10 5.6V21" />
    <circle cx="12" cy="12.6" r="0.7" fill={p.color ?? "#fff"} stroke="none" />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 2.8 4.6 5.8v5.4c0 4.7 3.2 8.6 7.4 10 4.2-1.4 7.4-5.3 7.4-10V5.8L12 2.8Z" />
    <path d="m8.6 12 2.4 2.4 4.6-4.8" />
  </Svg>
);

export const LoopIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8" />
    <path d="M20 4.4v5h-5" />
  </Svg>
);

export const TrendIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m3 17 6.2-6.2 4 4L21 7" />
    <path d="M15 7h6v6" />
  </Svg>
);

export const ActivityIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M2.5 12h4.2l2.6-6.5 5 13 2.7-6.5h4.5" />
  </Svg>
);

export const UserCheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="9.4" cy="7.6" r="3.8" />
    <path d="M2.8 20.5a6.6 6.6 0 0 1 13.2 0" />
    <path d="m15.8 11.4 2 2 3.6-3.8" />
  </Svg>
);

export const GearIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5" />
  </Svg>
);

export const ChatAlertIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4.2 4.5h15.6a1.6 1.6 0 0 1 1.6 1.6v9a1.6 1.6 0 0 1-1.6 1.6H9.2l-4.8 3.8v-3.8h-.2a1.6 1.6 0 0 1-1.6-1.6v-9a1.6 1.6 0 0 1 1.6-1.6Z" />
    <path d="M12 7.8v3.8" />
    <circle cx="12" cy="14" r="0.6" fill={p.color ?? "#fff"} stroke="none" />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 3.5h3.3l1.6 4.2-2.2 1.4a11 11 0 0 0 5.2 5.2l1.4-2.2 4.2 1.6V17a2 2 0 0 1-2.2 2A15.4 15.4 0 0 1 3 5.7a2 2 0 0 1 2-2.2Z" />
  </Svg>
);
