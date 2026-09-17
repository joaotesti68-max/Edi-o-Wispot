import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import { WifiIcon } from "./WispotMark";
import type { Clip } from "./content";

/**
 * Tela cheia por cima de um bloco cuja imagem não pode ir ao ar — no caso, o
 * take em que ela fala fora do eixo da câmera quase o tempo todo. O áudio
 * continua correndo por baixo, e a legenda segue por cima, então o bloco não
 * perde nada além da imagem.
 *
 * O bloco tem duas fases, e a virada é o que ela está dizendo. Enquanto fala
 * dos clientes que se conectam, quem está no ar é a imagem de apoio: alguém
 * usando o celular no Wi-Fi de um estabelecimento. Quando ela passa para o que
 * a rede entende desse público, a imagem se dissolve no degradê da marca e
 * entra a lista.
 */

/** Quantos quadros a imagem de apoio leva para se dissolver no degradê. */
const VIDEO_FADE = 26;

export const CoverCard: React.FC<{ cover: NonNullable<Clip["cover"]> }> = ({ cover }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const video = cover.video;
  const videoOut = video
    ? interpolate(frame, [video.until - VIDEO_FADE, video.until], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ background: brand.gradient }}>
      {/* Fecha os cantos, como nos cards da série, para o branco não competir
          com o azul aberto. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 38%, transparent 28%, ${brand.alpha(
            brand.colors.gray,
            0.34,
          )} 100%)`,
        }}
      />

      {/* O símbolo fica por baixo da lista no degradê, para a tela não ficar
          só texto depois que a imagem sai. */}
      <Rings opacity={videoOut * 0.5} frame={frame} />

      {video && videoOut < 1 ? <SupportFootage src={video.src} opacity={1 - videoOut} /> : null}

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
 * Imagem de apoio. O arquivo é 1280×720 na horizontal, então entra por
 * `objectFit: cover` — o recorte central é o que enquadra o rosto e o celular,
 * conferido ao longo dos 8 s do clipe.
 *
 * Por cima, um véu azul discreto e o mesmo degradê de topo e base dos blocos
 * gravados: é o que põe a imagem na paleta da peça sem apagar a luz quente do
 * café, e o que segura a legenda legível embaixo.
 */
const SupportFootage: React.FC<{ src: string; opacity: number }> = ({ src, opacity }) => (
  <AbsoluteFill style={{ opacity }}>
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill style={{ background: brand.alpha(brand.colors.blue, 0.2) }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 26%, transparent 54%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.84) 100%)",
      }}
    />
  </AbsoluteFill>
);

/**
 * O ponto de Wi-Fi e as ondas saindo dele. São três, defasadas em um terço do
 * ciclo, para a pulsação ser contínua em vez de piscar toda vez que a onda
 * reinicia.
 */
const Rings: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const CYCLE = 44;
  const CENTER_X = 540;
  const CENTER_Y = 600;
  if (opacity <= 0) return null;

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
