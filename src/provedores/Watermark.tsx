import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { wispot } from "./theme";
import { outroRange } from "./content";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/**
 * A marca fica fora dos blocos de propósito: como as passagens são em corte
 * seco, uma logo por bloco reapareceria a cada troca de take.
 */
export const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 16], [0, 1], ease),
    interpolate(frame, [outroRange.start - 10, outroRange.start], [1, 0], ease),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img
        src={staticFile(wispot.logo.white)}
        style={{
          position: "absolute",
          top: 58,
          left: "50%",
          width: 210,
          transform: "translateX(-50%)",
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};
