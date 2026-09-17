import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { WifiIcon } from "./WispotMark";
import type { Clip } from "./content";

/**
 * Tela cheia por cima de um bloco cuja imagem não pode ir ao ar — no caso, o
 * take em que ela fala fora do eixo da câmera quase o tempo todo. O áudio
 * continua correndo por baixo, e a legenda segue por cima, então o bloco não
 * perde nada além da imagem.
 *
 * O motivo não é enfeite: ele ilustra o que ela está dizendo. Primeiro os
 * aparelhos se conectando ao ponto de Wi-Fi, um a um, enquanto ela fala de
 * clientes que se conectam; depois eles recuam e entra a lista do que a rede
 * passa a enxergar.
 */

const CENTER_X = 540;
const CENTER_Y = 620;

/** Onde cada aparelho aparece em volta do ponto, e em que quadro ele entra. */
const DEVICES = [
  { angle: -104, radius: 330, at: 14 },
  { angle: -32, radius: 300, at: 30 },
  { angle: 40, radius: 345, at: 46 },
  { angle: 106, radius: 296, at: 62 },
  { angle: 160, radius: 338, at: 78 },
  { angle: -168, radius: 292, at: 94 },
  { angle: 74, radius: 214, at: 110 },
  { angle: -66, radius: 222, at: 126 },
];

export const CoverCard: React.FC<{ cover: NonNullable<Clip["cover"]> }> = ({ cover }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quando a lista entra, o motivo recua para segundo plano em vez de sumir:
  // o ponto de Wi-Fi continua sendo o assunto da frase.
  const firstItem = cover.items[0]?.at ?? Infinity;
  const recede = interpolate(frame, [firstItem - 14, firstItem + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: brand.gradient }}>
      {/* Fecha os cantos, como nos cards da série, para o branco não competir
          com o azul aberto. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 34%, transparent 28%, ${brand.alpha(
            brand.colors.gray,
            0.34,
          )} 100%)`,
        }}
      />

      <Motif frame={frame} fps={fps} dim={recede} />

      <div
        style={{
          position: "absolute",
          top: 1010,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        {cover.items.map((item) => {
          const enter = spring({
            frame: frame - item.at,
            fps,
            config: { damping: 200, mass: 0.6 },
          });
          if (enter <= 0) return null;

          return (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "20px 42px",
                borderRadius: 26,
                background: brand.colors.white,
                boxShadow: "0 16px 40px rgba(0,0,0,0.20)",
                opacity: enter,
                transform: `translateY(${(1 - enter) * 26}px)`,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: brand.colors.blue,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 46, fontWeight: 700, color: brand.colors.gray }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * O ponto de Wi-Fi no meio, as ondas saindo dele e os aparelhos que vão
 * chegando. As ondas são três, defasadas em um terço do ciclo, para a pulsação
 * ser contínua em vez de piscar toda vez que a onda reinicia.
 */
const Motif: React.FC<{ frame: number; fps: number; dim: number }> = ({ frame, fps, dim }) => {
  const CYCLE = 44;
  const opacity = 1 - dim * 0.66;

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2].map((i) => {
          const phase = ((frame + (i * CYCLE) / 3) % CYCLE) / CYCLE;
          return (
            <circle
              key={i}
              cx={CENTER_X}
              cy={CENTER_Y}
              r={130 + phase * 300}
              fill="none"
              stroke={brand.colors.white}
              strokeWidth={4}
              opacity={(1 - phase) * 0.5}
            />
          );
        })}

        {DEVICES.map((device) => {
          const enter = spring({
            frame: frame - device.at,
            fps,
            config: { damping: 200, mass: 0.7 },
          });
          if (enter <= 0) return null;

          const rad = (device.angle * Math.PI) / 180;
          const x = CENTER_X + Math.cos(rad) * device.radius;
          const y = CENTER_Y + Math.sin(rad) * device.radius;
          // A linha é desenhada do centro para fora junto com a entrada, para o
          // aparelho parecer se conectar e não só aparecer.
          const lx = CENTER_X + Math.cos(rad) * device.radius * enter;
          const ly = CENTER_Y + Math.sin(rad) * device.radius * enter;

          return (
            <g key={device.angle} opacity={enter}>
              <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={lx}
                y2={ly}
                stroke={brand.colors.white}
                strokeWidth={3}
                opacity={0.42}
              />
              <circle cx={x} cy={y} r={16} fill={brand.colors.white} />
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          top: CENTER_Y,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: "translateY(-50%)",
        }}
      >
        <WifiIcon height={150} variant="white" />
      </div>
    </AbsoluteFill>
  );
};
