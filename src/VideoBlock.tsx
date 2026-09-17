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
import { WifiIcon, WispotMark } from "./WispotMark";
import type { Clip } from "./content";
import { captions } from "./captions";

export const VideoBlock: React.FC<{ clip: Clip }> = ({ clip }) => {
  return (
    <AbsoluteFill style={{ background: brand.colors.gray }}>
      <OffthreadVideo
        src={staticFile(clip.video)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Scrim />

      {clip.kicker ? <Kicker text={clip.kicker} /> : null}
      {clip.chips ? <Chips items={clip.chips} /> : null}
      {clip.brandMark ? <BrandMark window={clip.brandMark} /> : null}

      <Captions clipId={clip.id} />

      {/* A marca d'água sai do bloco em que a logomarca sobe inteira: duas
          assinaturas ao mesmo tempo é uma a mais. */}
      {clip.brandMark ? null : <Watermark />}
    </AbsoluteFill>
  );
};

/**
 * Escurece topo e base para os elementos brancos lerem sobre a imagem. Preto
 * neutro de propósito: o manual pede contraste preservado, e uma tinta azul
 * aqui competiria com a própria cor da marca nas tarjas.
 */
const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, transparent 26%, transparent 54%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.84) 100%)",
    }}
  />
);

/** Tema do vídeo, na abertura. Recolhe antes do corte para o primeiro bloco. */
const Kicker: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 5, fps, config: { damping: 200, mass: 0.6 } });
  const exit = interpolate(frame, [durationInFrames - 40, durationInFrames - 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 108,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(enter, 1 - exit),
        transform: `translateY(${(1 - enter) * -26}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 34px",
          borderRadius: 999,
          background: brand.colors.blue,
        }}
      >
        <WifiIcon height={38} variant="white" />
        <span
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: brand.colors.white,
            letterSpacing: 1,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * Enumeração que se acumula na faixa livre acima da cabeça dela. Os itens
 * entram um a um e ficam de pé até o fim do bloco: a lista inteira no ar é o
 * ponto, e o item do meio dura menos de um segundo na fala.
 */
const Chips: React.FC<{ items: NonNullable<Clip["chips"]> }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = interpolate(frame, [durationInFrames - 28, durationInFrames - 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 152,
        left: 56,
        right: 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        opacity: 1 - exit,
      }}
    >
      {items.map((item) => {
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
              gap: 18,
              padding: "14px 30px",
              borderRadius: 22,
              background: brand.colors.white,
              opacity: enter,
              transform: `translateX(${(1 - enter) * -34}px)`,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                background: brand.colors.blue,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 38, fontWeight: 700, color: brand.colors.gray }}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * A logomarca sobe no bloco em que ela diz o nome da empresa. Vai numa tarja
 * branca, e não solta sobre a imagem: o azul da marca sobre a vegetação do
 * fundo perderia contraste.
 */
const BrandMark: React.FC<{ window: NonNullable<Clip["brandMark"]> }> = ({ window }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - window.from, fps, config: { damping: 200, mass: 0.8 } });
  const exit = interpolate(frame, [window.to - 16, window.to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, 1 - exit);
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${(1 - enter) * -24 + exit * -16}px)`,
      }}
    >
      <div
        style={{
          padding: "36px 62px",
          borderRadius: 30,
          background: brand.colors.white,
          boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
        }}
      >
        <WispotMark height={104} variant="color" />
      </div>
    </div>
  );
};

/**
 * Legendas queimadas. Ficam numa faixa reservada só para elas, acima da marca
 * d'água.
 */
const Captions: React.FC<{ clipId: string }> = ({ clipId }) => {
  const frame = useCurrentFrame();
  const lines = captions[clipId] ?? [];
  const current = lines.find((l) => frame >= l.from && frame < l.to);
  if (!current) return null;

  const pop = interpolate(frame - current.from, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 196,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          maxWidth: 900,
          textAlign: "center",
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.2,
          color: brand.colors.white,
          letterSpacing: -0.5,
          textWrap: "balance",
          textShadow: "0 3px 18px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)",
          opacity: pop,
          transform: `translateY(${(1 - pop) * 10}px)`,
        }}
      >
        {current.text}
      </span>
    </div>
  );
};

const Watermark: React.FC = () => (
  <div style={{ position: "absolute", right: 56, bottom: 70, opacity: 0.92 }}>
    <WispotMark height={84} variant="white" />
  </div>
);
