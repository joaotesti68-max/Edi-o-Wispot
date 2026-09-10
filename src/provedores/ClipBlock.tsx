import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";
import { Analytics, Ecossistema, Instalacao } from "./Mockups";
import { ReportCard } from "./ReportCard";
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

  const chipOpacity = interpolate(frame, [4, 18], [0, 1], ease);
  const chipShift = interpolate(frame, [4, 18], [16, 0], ease);
  // Enquanto a cobertura está no ar ela é o assunto: o texto sai da frente.
  const cobertura = block.broll
    ? interpolate(
        frame,
        [
          block.broll.at,
          block.broll.at + 5,
          block.broll.at + block.broll.durationInFrames - 5,
          block.broll.at + block.broll.durationInFrames,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;
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


      {block.accents ? (
        <div
          style={{
            position: "absolute",
            top: 252,
            left: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          {block.accents.map((a) => {
            const entra = interpolate(frame, [a.at, a.at + 12], [0, 1], ease);
            return (
              <div
                key={a.t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "rgba(0,24,36,0.62)",
                  border: `1.5px solid rgba(0,170,227,0.55)`,
                  borderRadius: 999,
                  padding: "12px 26px",
                  opacity: entra,
                  transform: `translateX(${interpolate(entra, [0, 1], [-22, 0])}px)`,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 999, background: wispot.cyan }} />
                <div
                  style={{
                    fontFamily,
                    fontWeight: 600,
                    fontSize: 27,
                    color: wispot.white,
                    letterSpacing: 0.2,
                  }}
                >
                  {a.t}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {block.broll ? (
        <Sequence from={block.broll.at} durationInFrames={block.broll.durationInFrames} layout="none">
          <Cobertura broll={block.broll} />
        </Sequence>
      ) : null}

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
            opacity: chipOpacity * (1 - cobertura),
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
            opacity: headlineOpacity * (1 - cobertura),
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

/** Entra e sai depressa: a fala não para, então a imagem não pode demorar. */
const Cobertura: React.FC<{ broll: NonNullable<Block["broll"]> }> = ({ broll }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = Math.min(
    interpolate(frame, [0, 5], [0, 1], ease),
    interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], ease),
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {broll.kind === "video" ? (
        <OffthreadVideo
          src={staticFile(broll.src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : broll.kind === "instalacao" ? (
        <Instalacao />
      ) : broll.kind === "analytics" ? (
        <Analytics />
      ) : broll.kind === "ecossistema" ? (
        <Ecossistema />
      ) : (
        <ReportCard />
      )}
    </AbsoluteFill>
  );
};
