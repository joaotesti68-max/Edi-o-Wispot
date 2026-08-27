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
import { ScaleIcon } from "./Icons";

export type TakeoverWindow = { from: number; to: number };

const FADE = 10;

/**
 * Quanto o takeover está cobrindo a tela, de 0 a 1. Fica aqui para que o
 * BlockView possa sumir com os overlays normais na mesma curva.
 */
export const takeoverProgress = (frame: number, takeover?: TakeoverWindow) => {
  if (!takeover) return 0;
  return interpolate(
    frame,
    [takeover.from, takeover.from + FADE, takeover.to - FADE, takeover.to],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

/**
 * Estoura o elemento de prazo em tela cheia, sobre o vídeo de ambiente em
 * transparência. Serve para cobrir os trechos em que o João desvia o olhar
 * da câmera: em vez de disfarçar, troca o assunto da tela.
 */
export const Takeover: React.FC<{ takeover: TakeoverWindow }> = ({ takeover }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = takeoverProgress(frame, takeover);
  if (progress <= 0) return null;

  const local = frame - takeover.from;
  const enter = spring({ frame: local, fps, config: { damping: 18, mass: 0.8 } });
  const fill = interpolate(local, [FADE, FADE + 46], [0, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: progress }}>
      {/* Base opaca: o objetivo é cobrir o desvio de olhar, então o João não
          pode ficar fantasmando por trás. */}
      <AbsoluteFill style={{ background: "#0c1c28" }} />

      {/* Ambiente de cartório em transparência: dá contexto e movimento sem
          competir com a leitura. */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("videos/ambiente-cartorio.mp4")}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.55,
            filter: "blur(2px) saturate(0.8)",
            transform: `scale(${interpolate(local, [0, 90], [1.06, 1.14])})`,
          }}
        />
      </AbsoluteFill>

      {/* Tinta da marca por cima, leve o bastante para o ambiente aparecer. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(160deg, rgba(15,42,60,0.52) 0%, rgba(28,63,87,0.4) 45%, rgba(12,28,40,0.62) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 44, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ScaleIcon size={40} color={brand.colors.primaryLight} strokeWidth={2.2} />
            <div
              style={{
                fontFamily: brand.fontFamily,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 2.4,
                textTransform: "uppercase",
                color: brand.colors.primaryLight,
              }}
            >
              Adequação obrigatória
            </div>
          </div>

          <div
            style={{
              fontFamily: brand.fontFamily,
              fontWeight: 800,
              fontSize: 92,
              lineHeight: 1.04,
              letterSpacing: -1.4,
              color: brand.colors.white,
              textShadow: "0 6px 32px rgba(0,0,0,0.45)",
            }}
          >
            Segurança da informação em cartórios
          </div>

          <div style={{ position: "relative", height: 22, marginTop: 10 }}>
            <div
              style={{ position: "absolute", inset: 0, background: brand.alpha.primary30, borderRadius: 11 }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: `${fill * 100}%`,
                background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.primaryLight})`,
                borderRadius: 11,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -12,
                right: 0,
                width: 8,
                height: 46,
                borderRadius: 4,
                background: brand.colors.white,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: brand.fontFamily,
              fontWeight: 700,
              fontSize: 28,
              color: brand.colors.white,
              opacity: 0.85,
            }}
          >
            <span>Provimento CNJ 213/2026</span>
            <span>fim do prazo</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
