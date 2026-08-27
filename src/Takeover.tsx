import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import { ScaleIcon } from "./Icons";

export type TakeoverBeat = {
  /** Frame do bloco em que este tempo entra. */
  at: number;
  kicker: string;
  headline: string;
  /** Vídeo de ambiente que roda atrás deste tempo, em public/. */
  clip: string;
};

export type TakeoverWindow = {
  from: number;
  /**
   * Frame do bloco em que sai. Um valor além da duração do bloco mantém a
   * tela cheia até o fim, e a transição leva direto ao bloco seguinte em vez
   * de voltar ao João por um instante.
   */
  to: number;
  beats: TakeoverBeat[];
};

const FADE = 10;
const BEAT_FADE = 9;

/**
 * Vídeo de ambiente de um tempo. Vai dentro de uma Sequence para que o clipe
 * comece do zero quando o tempo entra, em vez de continuar do tempo do bloco.
 */
const Backdrop: React.FC<{ clip: string; opacity: number; span: number }> = ({
  clip,
  opacity,
  span,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        src={staticFile(clip)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(2px) saturate(0.82)",
          transform: `scale(${interpolate(frame, [0, span], [1.04, 1.14], {
            extrapolateRight: "clamp",
          })})`,
        }}
      />
    </AbsoluteFill>
  );
};

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

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Fundo: travessia cruzada. As duas cenas se sobrepõem por um instante, que é
 * o que faz a troca de ambiente não piscar.
 */
const beatOpacity = (frame: number, beat: TakeoverBeat, next?: TakeoverBeat) =>
  next
    ? interpolate(frame, [beat.at, beat.at + BEAT_FADE, next.at, next.at + BEAT_FADE], [0, 1, 1, 0], CLAMP)
    : interpolate(frame, [beat.at, beat.at + BEAT_FADE], [0, 1], CLAMP);

/**
 * Texto: um sai antes do outro entrar. Cruzar dois textos deixa os dois
 * ilegíveis no meio da travessia.
 */
const beatTextOpacity = (frame: number, beat: TakeoverBeat, next?: TakeoverBeat) =>
  next
    ? interpolate(frame, [beat.at, beat.at + BEAT_FADE, next.at - BEAT_FADE, next.at], [0, 1, 1, 0], CLAMP)
    : interpolate(frame, [beat.at, beat.at + BEAT_FADE], [0, 1], CLAMP);

/**
 * Estoura o elemento de prazo em tela cheia, sobre o vídeo de ambiente em
 * transparência. A fala do João continua rodando por baixo: o que troca é a
 * imagem, não o áudio.
 */
export const Takeover: React.FC<{ takeover: TakeoverWindow; duration: number }> = ({
  takeover,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = takeoverProgress(frame, takeover);
  if (progress <= 0) return null;

  const local = frame - takeover.from;
  const span = Math.min(takeover.to, duration) - takeover.from;
  const enter = spring({ frame: local, fps, config: { damping: 18, mass: 0.8 } });

  // A barra atravessa a tela cheia inteira, para o trecho não ficar parado.
  const fill = interpolate(local, [FADE, span - 12], [0.12, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: progress }}>
      {/* Base opaca: o objetivo é substituir a imagem, então o João não pode
          ficar fantasmando por trás. */}
      <AbsoluteFill style={{ background: "#0c1c28" }} />

      {takeover.beats.map((beat, i) => {
        const next = takeover.beats[i + 1];
        const until = next ? next.at + BEAT_FADE : Math.min(takeover.to, duration);
        const opacity = beatOpacity(frame, beat, next);
        if (opacity <= 0) return null;
        return (
          <Sequence
            key={`bg-${beat.clip}`}
            from={beat.at}
            durationInFrames={Math.max(1, until - beat.at)}
          >
            <Backdrop clip={beat.clip} opacity={opacity * 0.62} span={until - beat.at} />
          </Sequence>
        );
      })}

      {/* Tinta da marca por cima, leve o bastante para o ambiente aparecer. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(160deg, rgba(15,42,60,0.46) 0%, rgba(28,63,87,0.34) 42%, rgba(12,28,40,0.66) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          transform: `scale(${interpolate(enter, [0, 1], [0.93, 1])})`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 44, width: "100%" }}>
          {/* Os tempos acompanham as duas frases da abertura: o texto vira
              quando ele vira, em vez de ficar 7s parado. */}
          <div style={{ position: "relative", minHeight: 380 }}>
            {takeover.beats.map((beat, i) => {
              // O último tempo só entra: quem tira ele da tela é o fim do bloco.
              const opacity = beatTextOpacity(frame, beat, takeover.beats[i + 1]);
              const rise = interpolate(frame, [beat.at, beat.at + BEAT_FADE], [16, 0], CLAMP);
              if (opacity <= 0) return null;
              return (
                <div
                  key={beat.headline}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity,
                    transform: `translateY(${rise}px)`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 30,
                    justifyContent: "flex-end",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <ScaleIcon size={38} color={brand.colors.primaryLight} strokeWidth={2.2} />
                    <div
                      style={{
                        fontFamily: brand.fontFamily,
                        fontWeight: 700,
                        fontSize: 29,
                        letterSpacing: 2.3,
                        textTransform: "uppercase",
                        color: brand.colors.primaryLight,
                      }}
                    >
                      {beat.kicker}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: brand.fontFamily,
                      fontWeight: 800,
                      fontSize: 88,
                      lineHeight: 1.05,
                      letterSpacing: -1.4,
                      color: brand.colors.white,
                      textShadow: "0 6px 32px rgba(0,0,0,0.5)",
                    }}
                  >
                    {beat.headline}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "relative", height: 22 }}>
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
