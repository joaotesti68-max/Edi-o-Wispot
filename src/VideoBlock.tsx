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

export const VideoBlock: React.FC<{ clip: Clip }> = ({ clip }) => {
  return (
    <AbsoluteFill style={{ background: brand.colors.gray }}>
      <OffthreadVideo
        src={staticFile(clip.video)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Scrim />

      {clip.kicker ? <Kicker text={clip.kicker} /> : null}
      {clip.ribbon ? <QuestionRibbon text={clip.ribbon} /> : null}
      {clip.nameCard ? <NameCard name={clip.nameCard.name} role={clip.nameCard.role} /> : null}

      <Watermark />
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
        "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, transparent 26%, transparent 62%, rgba(0,0,0,0.78) 100%)",
    }}
  />
);

const Kicker: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 0.6 } });
  const exit = interpolate(frame, [110, 128], [0, 1], {
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
 * Lembrete compacto da pergunta, para quem cai no meio da resposta. Recolhe
 * assim que a resposta engata.
 */
const QuestionRibbon: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 2, fps, config: { damping: 200, mass: 0.6 } });
  const exit = interpolate(frame, [132, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(enter, 1 - exit),
        transform: `translateY(${(1 - enter) * -30}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "18px 32px",
          borderRadius: 28,
          background: brand.colors.white,
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: brand.colors.blue,
            color: brand.colors.white,
            fontSize: 30,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ?
        </span>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: brand.colors.gray,
            lineHeight: 1.2,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const NameCard: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 26, fps, config: { damping: 200, mass: 0.7 } });
  const exit = interpolate(frame, [150, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 188,
        opacity: Math.min(enter, 1 - exit),
        transform: `translateX(${(1 - enter) * -40}px)`,
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div style={{ width: 8, height: 92, borderRadius: 999, background: brand.colors.blue }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 58, fontWeight: 800, color: brand.colors.white, lineHeight: 1 }}>
          {name}
        </span>
        <span style={{ fontSize: 32, fontWeight: 700, color: brand.colors.white, opacity: 0.82, lineHeight: 1 }}>
          {role}
        </span>
      </div>
    </div>
  );
};

const Watermark: React.FC = () => (
  <div style={{ position: "absolute", right: 56, bottom: 70, opacity: 0.92 }}>
    <WispotMark height={84} variant="white" />
  </div>
);
