import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { theme } from "./theme";
import { STEPS, blockRanges, blocks, outroRange } from "./content";

const ease = { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Quais passos estão acesos no frame atual, lido dos blocos já no ar. */
const activeAt = (frame: number): number[] => {
  if (frame >= outroRange.start) return [1, 2, 3, 4, 5];
  for (let i = blockRanges.length - 1; i >= 0; i--) {
    if (frame >= blockRanges[i].start) return blocks[i].activeSteps;
  }
  return [];
};

export const StepRail: React.FC = () => {
  const frame = useCurrentFrame();
  const active = activeAt(frame);

  const opacity = Math.min(
    interpolate(frame, [6, 24], [0, 1], ease),
    interpolate(frame, [outroRange.start - 12, outroRange.start], [1, 0], ease),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 56,
          right: 56,
          display: "flex",
          gap: 10,
          opacity,
        }}
      >
        {STEPS.map((label, i) => {
          const step = i + 1;
          const on = active.includes(step);
          return (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: on ? theme.accentBright : theme.rule,
                }}
              />
              <div
                style={{
                  fontFamily: brand.fontFamily,
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: 1.4,
                  color: on ? theme.white : theme.muted,
                }}
              >
                {String(step).padStart(2, "0")}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
