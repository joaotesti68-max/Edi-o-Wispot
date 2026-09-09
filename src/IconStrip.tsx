import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import {
  AlertIcon,
  BoxIcon,
  ChatIcon,
  LockIcon,
  NetworkIcon,
  PeopleIcon,
  RadarIcon,
  RestoreIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  TruckIcon,
} from "./Icons";
import type { IconKey, IconTile } from "./types";

const ICONS: Record<IconKey, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alert: AlertIcon,
  server: ServerIcon,
  shield: ShieldCheckIcon,
  trending: TrendingUpIcon,
  chat: ChatIcon,
  truck: TruckIcon,
  radar: RadarIcon,
  restore: RestoreIcon,
  box: BoxIcon,
  people: PeopleIcon,
  network: NetworkIcon,
  lock: LockIcon,
};

const TILE = 156;

/** Sized off the longest word, since a caption may not wrap inside one. */
const captionSize = (label: string) => {
  const longest = Math.max(...label.split(" ").map((w) => w.length));
  if (longest > 12) return 19;
  if (longest > 9) return 22;
  return 25;
};
const GAP = 14;
const RING = TILE - 10;
const PERIMETER = 4 * (RING - 24) + 2 * Math.PI * 12; // rounded-rect stroke length

const Tile: React.FC<{ item: IconTile }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - item.at;
  const Icon = ICONS[item.icon];

  const pop = spring({ frame: local, fps, config: { damping: 11, mass: 0.5, stiffness: 140 } });
  const draw = spring({ frame: local - 2, fps, config: { damping: 30, mass: 1.1 } });
  // one soft pulse as it lands, then it settles
  const pulse = interpolate(local, [0, 8, 26], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(pop, [0, 1], [0.34, 1]);
  const iconIn = spring({ frame: local - 4, fps, config: { damping: 13, mass: 0.5 } });

  return (
    <div style={{ width: TILE, opacity: interpolate(pop, [0, 0.35], [0, 1]) }}>
      <div
        style={{
          width: TILE,
          height: TILE,
          position: "relative",
          transform: `scale(${scale})`,
          borderRadius: 30,
          background: `rgba(6,9,12,${0.5 + pulse * 0.12})`,
          boxShadow: `0 0 ${18 + pulse * 46}px rgba(32,163,214,${0.22 + pulse * 0.5})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* the ring draws itself around the tile as it lands */}
        <svg
          width={TILE}
          height={TILE}
          style={{ position: "absolute", inset: 0 }}
          viewBox={`0 0 ${TILE} ${TILE}`}
        >
          <rect
            x={5}
            y={5}
            width={RING}
            height={RING}
            rx={26}
            fill="none"
            stroke={brand.colors.primaryLight}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={PERIMETER}
            strokeDashoffset={interpolate(draw, [0, 1], [PERIMETER, 0])}
            transform={`rotate(-90 ${TILE / 2} ${TILE / 2})`}
          />
        </svg>

        <div
          style={{
            transform: `scale(${interpolate(iconIn, [0, 1], [0.4, 1])}) rotate(${interpolate(
              iconIn,
              [0, 1],
              [-18, 0],
            )}deg)`,
            opacity: interpolate(iconIn, [0, 1], [0, 1]),
          }}
        >
          <Icon size={68} color={brand.colors.white} strokeWidth={1.9} />
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          width: TILE,
          boxSizing: "border-box",
          padding: "0 3px",
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          // the longest word has to fit the tile: it cannot wrap mid-word
          fontSize: captionSize(item.label),
          lineHeight: 1.16,
          textAlign: "center",
          color: brand.colors.white,
          letterSpacing: -0.2,
          textShadow: "0 3px 14px rgba(0,0,0,0.55)",
          opacity: interpolate(spring({ frame: local - 7, fps, config: { damping: 18 } }), [0, 1], [0, 1]),
        }}
      >
        {item.label}
      </div>
    </div>
  );
};

/**
 * The spoken lists, as animated icons rather than text. Tiles append to the
 * right as he names each one, so nothing already on screen moves.
 */
export const IconStrip: React.FC<{ items: IconTile[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        bottom: 404,
        display: "flex",
        alignItems: "flex-start",
        gap: GAP,
      }}
    >
      {items.map((item) => (frame < item.at - 1 ? null : <Tile key={item.label} item={item} />))}
    </div>
  );
};
