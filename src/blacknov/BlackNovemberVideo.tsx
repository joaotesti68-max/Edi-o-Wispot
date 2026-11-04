import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../loadFont";
import type { Clip } from "./edit";
import {
  END,
  FPS,
  INTRO,
  at,
  clipStarts,
  clips,
  endStart,
  pa,
  totalDurationInFrames,
} from "./edit";
import {
  AlertChip,
  Captions,
  GlitchFlash,
  Grade,
  Hud,
  Scanner,
  Slam,
  Stamp,
  shake,
} from "./Overlays";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fundo "cyber": grade fina em perspectiva + brilho azul.
const CyberBackdrop: React.FC<{ glow?: number }> = ({ glow = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: pa.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 50%, rgba(43,163,219,${0.32 * glow}) 0%, rgba(4,80,137,${0.18 * glow}) 45%, rgba(2,5,9,0) 75%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -540,
          right: -540,
          bottom: -200,
          height: 900,
          backgroundImage:
            "linear-gradient(rgba(43,163,219,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(43,163,219,0.35) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${(frame * 3) % 90}px`,
          transform: "perspective(600px) rotateX(62deg)",
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(180deg, transparent 0%, black 70%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- abertura ----------
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 16, fps, config: { damping: 14 } });
  const sh = shake(frame, 2, 26, 12);
  const sh2 = shake(frame, 9, 16, 9);
  const glitchy = frame < 14 || (frame > 30 && frame < 34);
  const split = glitchy ? 6 + random(`i-${frame}`) * 14 : 4;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <CyberBackdrop glow={interpolate(frame, [0, 6, 45], [0.2, 1.2, 0.9], clamp)} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)`,
        }}
      >
        <Slam
          from={2}
          top={680}
          size={158}
          lines={[{ text: "BLACK" }, { text: "NOVEMBER", style: "outline" }]}
        />
        <div
          style={{
            position: "absolute",
            top: 1180,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: 18,
            color: pa.cyan,
            opacity: interpolate(frame, [12, 18], [0, 1], clamp),
            textShadow: `${split}px 0 0 rgba(249,109,100,0.6), ${-split}px 0 0 rgba(43,163,219,0.8)`,
          }}
        >
          CIBERSEGURANÇA
        </div>
      </AbsoluteFill>
      <Img
        src={staticFile("brand/pa-logo-white.png")}
        style={{
          position: "absolute",
          bottom: 230,
          left: 540 - 190,
          width: 380,
          opacity: logo,
          transform: `translateY(${(1 - logo) * 40}px)`,
        }}
      />
      <GlitchFlash seed={0} length={6} />
    </AbsoluteFill>
  );
};

// ---------- trecho falado ----------
type Punch = { at: number; amount: number };

const ClipOverlays: React.FC<{ clip: Clip }> = ({ clip }) => {
  const f = (s: number) => at(clip, s);
  switch (clip.id) {
    case "oferta":
      return (
        <>
          <Slam
            from={f(2.0)}
            until={f(4.0)}
            top={300}
            size={112}
            lines={[{ text: "BLACK FRIDAY", style: "outline" }]}
          />
          <Slam
            from={f(4.1)}
            top={250}
            size={118}
            lines={[{ text: "DIAGNÓSTICO" }, { text: "100% GRATUITO", style: "box" }]}
          />
        </>
      );
    case "atencao":
      return (
        <>
          <AlertChip
            from={f(1.2)}
            until={f(3.05)}
            text="Tudo funcionando"
            top={270}
            side="left"
            color={pa.blue}
            icon="check"
          />
          <AlertChip from={f(3.22)} text="Controles de acesso" top={270} side="left" />
          <AlertChip from={f(4.26)} text="Monitoramento" top={400} side="right" />
        </>
      );
    case "avaliacao":
      return (
        <>
          <Scanner from={f(1.5)} until={f(3.8)} />
          <AlertChip from={f(3.84)} text="Riscos" top={270} side="left" />
          <AlertChip
            from={f(5.0)}
            text="Oportunidades"
            top={400}
            side="right"
            color={pa.blue}
            icon="check"
          />
        </>
      );
    case "cta":
      return (
        <>
          <Slam
            from={f(1.84)}
            until={f(4.9)}
            top={230}
            size={150}
            lines={[{ text: "BLACK" }, { text: "NOVEMBER", style: "outline" }]}
          />
          <Stamp from={f(5.48)} text="SEM CUSTO" top={300} />
        </>
      );
    default:
      return null;
  }
};

const punches: Record<string, Punch[]> = {
  oferta: [{ at: 5.32, amount: 0.1 }],
  atencao: [{ at: 5.84, amount: 0.12 }],
  avaliacao: [{ at: 3.84, amount: 0.08 }],
  cta: [{ at: 5.48, amount: 0.1 }],
};

const shakes: Record<string, number[]> = {
  oferta: [2.0, 4.64],
  atencao: [5.84],
  avaliacao: [3.84],
  cta: [1.84, 5.48],
};

const TalkScene: React.FC<{ clip: Clip; index: number }> = ({ clip, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 18 } });
  const punch = (punches[clip.id] ?? []).reduce((acc, p) => {
    const s = spring({ frame: frame - at(clip, p.at), fps, config: { damping: 12 } });
    return acc + p.amount * s;
  }, 0);
  const scale =
    clip.zoom *
    interpolate(settle, [0, 1], [1.08, 1]) *
    interpolate(frame, [0, clip.durationInFrames], [1, 1.03]) *
    (1 + punch);
  const sh = (shakes[clip.id] ?? []).reduce(
    (acc, s) => {
      const v = shake(frame, at(clip, s), 14, 8);
      return { x: acc.x + v.x, y: acc.y + v.y };
    },
    { x: 0, y: 0 },
  );
  // "atenção": pisca vermelho
  const alarm =
    clip.id === "atencao"
      ? interpolate(frame - at(clip, 5.84), [0, 3, 14], [0, 0.35, 0], clamp)
      : 0;
  return (
    <AbsoluteFill style={{ background: pa.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${sh.x}px, ${sh.y}px) scale(${scale})`,
          transformOrigin: "50% 36%",
        }}
      >
        <OffthreadVideo
          src={staticFile(clip.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.2) saturate(0.8) brightness(0.84)",
          }}
        />
      </AbsoluteFill>
      <Grade />
      <AbsoluteFill style={{ background: pa.red, opacity: alarm, mixBlendMode: "screen" }} />
      <ClipOverlays clip={clip} />
      <Captions clip={clip} />
      <GlitchFlash seed={index + 1} />
    </AbsoluteFill>
  );
};

// ---------- encerramento ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const icon = spring({ frame: frame - 2, fps, config: { damping: 10 } });
  const logo = spring({ frame: frame - 12, fps, config: { damping: 14 } });
  const l1 = spring({ frame: frame - 22, fps, config: { damping: 13 } });
  const l2 = spring({ frame: frame - 30, fps, config: { damping: 10 } });
  const l3 = spring({ frame: frame - 42, fps, config: { damping: 14 } });
  const sh = shake(frame, 1, 22, 10);
  const rings = [0, 20, 40, 60].map((d) => {
    const p = ((frame - d + 80) % 80) / 80;
    return (
      <div
        key={d}
        style={{
          position: "absolute",
          top: 470 - 120 - p * 220,
          left: 540 - 120 - p * 220,
          width: 240 + p * 440,
          height: 240 + p * 440,
          borderRadius: "50%",
          border: `3px solid ${pa.blue}`,
          opacity: (1 - p) * 0.6 * icon,
        }}
      />
    );
  });
  const rise = (s: number): React.CSSProperties => ({
    opacity: s,
    transform: `translateY(${(1 - s) * 50}px)`,
  });
  return (
    <AbsoluteFill style={{ fontFamily, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <CyberBackdrop />
      {rings}
      <Img
        src={staticFile("brand/pa-icon-white.png")}
        style={{
          position: "absolute",
          top: 470 - 130,
          left: 540 - 130,
          width: 260,
          transform: `scale(${icon}) rotate(${(1 - icon) * -90 + frame * 0.4}deg)`,
          filter: `drop-shadow(0 0 30px ${pa.blue})`,
        }}
      />
      <Img
        src={staticFile("brand/pa-logo-white.png")}
        style={{
          position: "absolute",
          top: 720,
          left: 540 - 300,
          width: 600,
          ...rise(logo),
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", color: pa.white, fontWeight: 800 }}>
        <div style={{ position: "absolute", top: 960, fontSize: 52, textAlign: "center", lineHeight: 1.15, ...rise(l1) }}>
          DIAGNÓSTICO DE
          <br />
          CIBERSEGURANÇA
        </div>
        <div
          style={{
            position: "absolute",
            top: 1120,
            fontSize: 86,
            color: pa.black,
            background: pa.grad,
            padding: "8px 40px 14px",
            borderRadius: 10,
            boxShadow: `0 0 50px ${pa.blue}`,
            opacity: l2,
            transform: `scale(${interpolate(l2, [0, 1], [1.6, 1])}) rotate(-3deg)`,
          }}
        >
          GRATUITO
        </div>
        <div style={{ position: "absolute", top: 1330, fontSize: 40, letterSpacing: 2, ...rise(l3) }}>
          Solicite até 30/11
        </div>
        <div
          style={{
            position: "absolute",
            top: 1400,
            fontSize: 50,
            color: pa.cyan,
            borderBottom: `4px solid ${pa.blue}`,
            paddingBottom: 6,
            ...rise(l3),
          }}
        >
          proadvanced.com.br
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 150,
            fontSize: 30,
            letterSpacing: 12,
            color: "rgba(255,255,255,0.6)",
            opacity: l3,
          }}
        >
          BLACK NOVEMBER 2026
        </div>
      </AbsoluteFill>
      <GlitchFlash seed={99} length={8} />
    </AbsoluteFill>
  );
};

// ---------- montagem ----------
const BlackNovemberVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const talkLength = endStart - INTRO;
  const progress = interpolate(frame, [INTRO, endStart], [0, 1], clamp);
  const music = (f: number) =>
    interpolate(
      f,
      [0, INTRO - 4, INTRO + 6, endStart - 50, endStart, totalDurationInFrames - 20, totalDurationInFrames],
      [0.55, 0.55, 0.13, 0.13, 0.5, 0.5, 0],
      clamp,
    );
  return (
    <AbsoluteFill style={{ background: pa.black }}>
      <Audio src={staticFile("audio/black-november/trilha.mp3")} volume={music} />
      <Sequence durationInFrames={INTRO}>
        <Intro />
      </Sequence>
      {clips.map((clip, i) => (
        <Sequence key={clip.id} from={clipStarts[i]} durationInFrames={clip.durationInFrames}>
          <TalkScene clip={clip} index={i} />
        </Sequence>
      ))}
      <Sequence from={INTRO} durationInFrames={talkLength}>
        <Hud progress={progress} />
      </Sequence>
      <Sequence from={endStart} durationInFrames={END}>
        <EndCard />
      </Sequence>

      {/* efeitos sonoros */}
      <Sequence from={1}>
        <Audio src={staticFile("audio/black-november/impacto.wav")} volume={0.9} />
      </Sequence>
      {clipStarts.map((s, i) => (
        <Sequence key={`g${i}`} from={s} durationInFrames={10}>
          <Audio src={staticFile("audio/black-november/glitch.wav")} volume={0.35} />
        </Sequence>
      ))}
      {clips.map((clip, i) =>
        (shakes[clip.id] ?? []).map((s) => (
          <Sequence key={`w${i}-${s}`} from={clipStarts[i] + at(clip, s) - 3} durationInFrames={20}>
            <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.25} />
          </Sequence>
        )),
      )}
      <Sequence from={endStart - 48} durationInFrames={50}>
        <Audio src={staticFile("audio/black-november/riser.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={endStart}>
        <Audio src={staticFile("audio/black-november/impacto.wav")} volume={0.8} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BlackNovemberComposition: React.FC = () => (
  <Composition
    id="BlackNovember"
    component={BlackNovemberVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
