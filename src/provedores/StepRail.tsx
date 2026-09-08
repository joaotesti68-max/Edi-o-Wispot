import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";
import { STEPS, blockRanges, blocks, outroRange } from "./content";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Passos acesos no frame atual, lidos do bloco que está no ar. */
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
  const maxActive = active.length ? Math.max(...active) : 0;

  const opacity = Math.min(
    interpolate(frame, [8, 26], [0, 1], ease),
    interpolate(frame, [outroRange.start - 12, outroRange.start], [1, 0], ease),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 182,
          left: 60,
          right: 60,
          display: "flex",
          gap: 10,
          opacity,
        }}
      >
        {STEPS.map((label, i) => {
          const step = i + 1;
          const on = active.includes(step);
          const done = step < maxActive;
          return (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: on ? wispot.cyan : done ? "rgba(0,170,227,0.45)" : wispot.rule,
                }}
              />
              <div
                style={{
                  fontFamily,
                  fontWeight: on ? 700 : 600,
                  fontSize: 18,
                  letterSpacing: 1.2,
                  color: on ? wispot.white : wispot.muted,
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
