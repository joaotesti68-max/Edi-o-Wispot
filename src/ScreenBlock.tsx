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
import { source, type Block } from "./content";
import { Wordmark } from "./Wordmark";

export const ScreenBlock: React.FC<{ block: Block }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada suave só nos primeiros frames; o resto fica estável para não
  // competir com a leitura da tela.
  const cardIn = spring({ frame, fps, config: { damping: 22, mass: 0.9 } });
  const cardScale = interpolate(cardIn, [0, 1], [0.985, 1]);
  const cardOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const captionIn = spring({ frame: frame - 10, fps, config: { damping: 18, mass: 0.8 } });

  const visibleBlur = (block.blur ?? []).filter(
    (r) => frame >= (r.from ?? 0) && frame < (r.to ?? Infinity),
  );

  return (
    <AbsoluteFill style={{ background: brand.groundGradient }}>
      {/* brilho sutil atrás do card */}
      <div
        style={{
          position: "absolute",
          top: "-18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 1500,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(37,168,224,0.38), rgba(37,168,224,0))`,
        }}
      />

      {/* cabeçalho */}
      <div
        style={{
          position: "absolute",
          top: 46,
          left: 76,
          right: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Wordmark height={54} variant="white" />
        {block.caption ? (
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
              opacity: captionIn,
              transform: `translateY(${interpolate(captionIn, [0, 1], [10, 0])}px)`,
            }}
          >
            {block.caption}
          </div>
        ) : null}
      </div>

      {/* card do screencast */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: 1680,
            aspectRatio: `${source.width} / ${source.usableHeight}`,
            borderRadius: 20,
            overflow: "hidden",
            background: "#ffffff",
            border: "1px solid rgba(255,255,255,0.24)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.45), 0 0 0 1px rgba(37,168,224,0.25)",
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
          }}
        >
          <OffthreadVideo
            src={staticFile(block.video)}
            style={{
              position: "absolute",
              // `top` em porcentagem resolve contra a altura do contêiner;
              // `margin-top` resolveria contra a largura.
              top: `-${(source.cropTop / source.usableHeight) * 100}%`,
              left: 0,
              width: "100%",
              // O vídeo é maior que o card e sobe, deixando de fora a cromo do
              // navegador e a barra da Pro Advanced em cima e a faixa preta
              // embaixo.
              height: `${(source.height / source.usableHeight) * 100}%`,
              objectFit: "fill",
              display: "block",
            }}
          />

          {visibleBlur.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${r.top}%`,
                left: `${r.left}%`,
                width: `${r.width}%`,
                height: `${r.height}%`,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
