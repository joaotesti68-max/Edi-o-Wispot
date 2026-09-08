import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";
import type { Block } from "./content";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Salto de escala usado para disfarçar a emenda de um corte de silêncio. */
const CUT_ZOOM = 0.09;

export const ClipBlock: React.FC<{ block: Block }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Cada emenda alterna entre o enquadramento aberto e o fechado: sem isso o
  // corte apareceria como salto, já que o plano é fixo o vídeo inteiro.
  const passedCuts = block.cuts.filter((c) => frame >= c).length;
  const drift = interpolate(frame, [0, durationInFrames], [0, 0.04], {
    extrapolateRight: "clamp",
  });
  const scale = block.zoom + (passedCuts % 2 === 1 ? CUT_ZOOM : 0) + drift;

  const logoOpacity = interpolate(frame, [0, 14], [0, 1], ease);
  const chipOpacity = interpolate(frame, [4, 18], [0, 1], ease);
  const chipShift = interpolate(frame, [4, 18], [16, 0], ease);
  const headlineOpacity = interpolate(frame, [10, 26], [0, 1], ease);
  const headlineShift = interpolate(frame, [10, 26], [20, 0], ease);

  return (
    <AbsoluteFill style={{ background: wispot.ink }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 42%" }}
      >
        <OffthreadVideo
          src={staticFile(block.video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: wispot.scrim }} />

      <Img
        src={staticFile(wispot.logo.white)}
        style={{
          position: "absolute",
          top: 58,
          left: "50%",
          width: 210,
          transform: "translateX(-50%)",
          opacity: logoOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 296,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div
          style={{
            background: wispot.cyan,
            borderRadius: 999,
            padding: "12px 30px",
            fontFamily,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 0.3,
            color: wispot.white,
            opacity: chipOpacity,
            transform: `translateY(${chipShift}px)`,
          }}
        >
          {block.chip}
        </div>

        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 56,
            lineHeight: 1.24,
            color: wispot.white,
            letterSpacing: -0.4,
            textShadow: "0 4px 26px rgba(0,12,20,0.5)",
            opacity: headlineOpacity,
            transform: `translateY(${headlineShift}px)`,
          }}
        >
          {block.headline.map((part, i) => (
            <span
              key={i}
              style={{
                fontWeight: part.bold ? 800 : 400,
                ...(part.underline
                  ? {
                      borderBottom: `5px solid ${wispot.cyan}`,
                      paddingBottom: 4,
                    }
                  : {}),
              }}
            >
              {part.t}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
