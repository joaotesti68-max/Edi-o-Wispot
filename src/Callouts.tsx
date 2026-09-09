import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import type { Callout } from "./types";

const CHIP_HEIGHT = 64;
const GAP = 12;

/**
 * Chips that land as he names each item, so a spoken list also reads as one.
 * The stack is anchored at the bottom, so each new chip arrives in place and
 * pushes the earlier ones up.
 */
export const Callouts: React.FC<{ items: Callout[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        bottom: 372,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {items.map((item) => {
        const local = frame - item.at;
        if (local < -1) return null;
        const enter = spring({ frame: local, fps, config: { damping: 15, mass: 0.5 } });
        const height = interpolate(enter, [0, 1], [0, CHIP_HEIGHT + GAP]);
        const opacity = interpolate(enter, [0, 0.5, 1], [0, 1, 1]);
        const shift = interpolate(enter, [0, 1], [-28, 0]);

        return (
          <div key={item.label} style={{ height, overflow: "hidden" }}>
            <div
              style={{
                height: CHIP_HEIGHT,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 26px 0 18px",
                borderRadius: 14,
                background: "rgba(6,9,12,0.62)",
                border: `1.5px solid rgba(54,150,205,0.55)`,
                opacity,
                transform: `translateX(${shift}px)`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: brand.colors.primaryLight,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: brand.fontFamily,
                  fontWeight: 700,
                  fontSize: 34,
                  color: brand.colors.white,
                  whiteSpace: "nowrap",
                  letterSpacing: -0.2,
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
