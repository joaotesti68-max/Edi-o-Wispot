import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HowTo } from "./edit";
import { FUNCIONA_V2, toSceneFrame } from "./edit";
import { Badge, TalkPart } from "./TalkScene";
import { Icon, Sfx, Stars, WifiArcs, wq, wsp } from "./theme";

// "Funciona assim" (IMG_9962). Every beat is keyed to a word in the take,
// in source seconds. Only her voice is used: the phone shows the Wi-Fi login
// and the branded survey, topic chips join it, then the live dashboard.
const words = {
  connect: 2.4, // "ao acessar o Wi-Fi gratuito"
  tap: 3.32,
  survey: 4.2, // "o seu cliente pode responder"
  stars: 5.84, // "pesquisa rápida"
  choose: 6.9, // "perguntas que você escolhe"
  brand: 9.16, // "identidade da sua marca"
};

// Same, in the re-recorded take (FUNCIONA_V2).
const words2 = {
  camera: 3.15, // "Você pode perguntar sobre"
  topics: [4.5, 5.82, 6.7], // atendimento, produtos, experiência
  live: 8.0, // "As respostas aparecem em tempo real"
  panel: 10.14, // "em um painel fácil de acompanhar"
};

type Beats = {
  connect: number;
  tap: number;
  survey: number;
  stars: number;
  choose: number;
  brand: number;
  camera: number;
  topics: number[];
  live: number;
  panel: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const StepLabel: React.FC<{ b: Beats }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { at: b.connect, text: "Conecta no Wi-Fi grátis" },
    { at: b.survey, text: "Responde uma pesquisa rápida" },
    { at: b.live, text: "Respostas em tempo real" },
  ];
  if (frame < b.connect) return null;
  const current = steps.filter((s) => frame >= s.at).length - 1;
  const step = steps[current];
  const s = spring({ frame: frame - step.at - 4, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 350,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: wsp.white,
          color: wsp.gray,
          fontWeight: 800,
          fontSize: 46,
          padding: "14px 40px 14px 14px",
          borderRadius: 999,
          boxShadow: "0 16px 44px rgba(11,60,90,0.25)",
          transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-5, 0])}deg)`,
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: wq.orange,
            color: wsp.white,
            display: "grid",
            placeItems: "center",
            fontSize: 40,
          }}
        >
          {current + 1}
        </div>
        {step.text}
      </div>
    </div>
  );
};

// Finger tap: a ring that grows and fades at (x, y) inside the phone screen.
const Tap: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 6, at, at + 14], [0, 0.6, 1], clamp);
  if (frame < at - 6 || frame > at + 14) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "rgba(81,77,75,0.25)",
        border: `4px solid ${wsp.white}`,
        transform: `scale(${0.5 + t})`,
        opacity: 1 - Math.max(0, t - 0.6) * 2.5,
      }}
    />
  );
};

const ConnectScreen: React.FC<{ tap: number }> = ({ tap }) => {
  const frame = useCurrentFrame();
  const arcs = [0, 1, 2].map((i) =>
    interpolate((frame + i * 6) % 36, [0, 18], [0.2, 1], clamp),
  ) as [number, number, number];
  const connected = frame >= tap + 4;
  const press = interpolate(frame, [tap - 2, tap + 2, tap + 6], [1, 0.92, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        background: wsp.tint,
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        padding: 40,
      }}
    >
      <WifiArcs size={220} color={wsp.blue} progress={connected ? [1, 1, 1] : arcs} strokeWidth={2.6} />
      <div style={{ fontWeight: 800, fontSize: 44, color: wsp.gray, textAlign: "center" }}>
        Wi-Fi grátis
      </div>
      <div style={{ fontWeight: 700, fontSize: 28, color: wsp.gray, opacity: 0.7 }}>
        Sua Loja · Visitantes
      </div>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: connected ? wsp.blueDeep : wsp.grad,
          color: wsp.white,
          fontWeight: 800,
          fontSize: 34,
          padding: "22px 60px",
          borderRadius: 999,
          transform: `scale(${press})`,
        }}
      >
        {connected ? <Icon kind="check" size={40} /> : null}
        {connected ? "Conectado" : "Conectar"}
      </div>
      <Tap at={tap} x={208} y={690} />
    </AbsoluteFill>
  );
};

// Local frames: stars fill at `stars`, the venue header pulses at `brand`,
// the comment types and is sent just before `end`.
const SurveyScreen: React.FC<{ stars: number; brand: number; end: number }> = ({
  stars: starsAt,
  brand,
  end,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stars = interpolate(frame, [starsAt, starsAt + 18], [0, 5], clamp);
  const typeFrom = starsAt + 26;
  const sendAt = end - 16;
  const sent = frame >= sendAt + 2;
  const pulse = spring({ frame: frame - brand, fps, config: { damping: 8 } });
  const header = frame >= brand ? 1 + 0.08 * Math.sin(pulse * Math.PI) : 1;
  return (
    <AbsoluteFill style={{ background: wsp.white }}>
      {/* the venue's own colours and logo on the survey */}
      <div
        style={{
          background: wq.orange,
          padding: "70px 34px 34px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          transform: `scale(${header})`,
          transformOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            background: wsp.white,
            color: wq.orange,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 30,
          }}
        >
          SL
        </div>
        <div style={{ fontWeight: 800, fontSize: 36, color: wsp.white }}>Sua Loja</div>
      </div>
      <div style={{ padding: "44px 36px", display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ fontWeight: 700, fontSize: 26, color: wq.orange, letterSpacing: "0.06em" }}>
          PERGUNTA 1 DE 3
        </div>
        <div style={{ fontWeight: 800, fontSize: 44, lineHeight: 1.2, color: wsp.gray }}>
          Como foi o seu atendimento hoje?
        </div>
        <Stars filled={stars} size={64} gap={8} />
        <div
          style={{
            marginTop: 30,
            border: `3px solid ${wq.orangeSoft}`,
            borderRadius: 22,
            padding: "22px 24px",
            fontWeight: 700,
            fontSize: 28,
            color: wsp.gray,
            opacity: interpolate(frame, [typeFrom - 8, typeFrom], [0.4, 1], clamp),
          }}
        >
          {"Atendimento ótimo!".slice(
            0,
            Math.round(interpolate(frame, [typeFrom, typeFrom + 30], [0, 18], clamp)),
          )}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            textAlign: "center",
            background: sent ? wsp.blueDeep : wq.orange,
            color: wsp.white,
            fontWeight: 800,
            fontSize: 34,
            padding: "22px 0",
            borderRadius: 999,
          }}
        >
          {sent ? "Obrigado!" : "Enviar"}
        </div>
      </div>
      <Tap at={starsAt + 14} x={330} y={520} />
      <Tap at={sendAt} x={226} y={830} />
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ b: Beats }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < b.connect || frame >= b.live + 30) return null;
  const enter = spring({ frame: frame - b.connect - 2, fps, config: { damping: 14 } });
  // makes room on the left for the topic chips, then leaves for the dashboard
  const side = spring({ frame: frame - b.camera, fps, config: { damping: 16 } });
  const leave = spring({ frame: frame - b.live, fps, config: { damping: 16 } });
  const swap = interpolate(frame, [b.survey - 6, b.survey + 4], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        top: 480,
        width: 500,
        height: 1000,
        borderRadius: 70,
        background: wsp.gray,
        padding: 14,
        boxShadow: "0 40px 90px rgba(11,60,90,0.4)",
        transform: `translateY(${interpolate(enter, [0, 1], [1400, 0])}px) translateX(${side * 200 + leave * -1300}px) rotate(${interpolate(enter, [0, 1], [10, 0]) - leave * 12}deg)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 56,
          overflow: "hidden",
          background: wsp.white,
        }}
      >
        <AbsoluteFill style={{ opacity: 1 - swap }}>
          <Sequence from={b.connect} layout="none">
            <ConnectScreen tap={b.tap - b.connect} />
          </Sequence>
        </AbsoluteFill>
        {frame >= b.survey - 6 ? (
          <AbsoluteFill
            style={{ opacity: swap, transform: `translateX(${(1 - swap) * 200}px)` }}
          >
            <Sequence from={b.survey} layout="none">
              <SurveyScreen
                stars={b.stars - b.survey}
                brand={b.brand - b.survey}
                end={b.camera - b.survey}
              />
            </Sequence>
          </AbsoluteFill>
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            width: 150,
            height: 36,
            marginLeft: -75,
            borderRadius: 999,
            background: wsp.gray,
          }}
        />
      </div>
    </div>
  );
};

// Topic chips beside the phone, one per word she says.
const Topics: React.FC<{ b: Beats }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < b.topics[0] || frame >= b.live) return null;
  const items = ["Atendimento", "Produtos", "Experiência"];
  const out = interpolate(frame, [b.live - 8, b.live], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 720,
        left: 34,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 90,
      }}
    >
      {items.map((text, i) => {
        const at = b.topics[i];
        const s = spring({ frame: frame - at, fps, config: { damping: 11, mass: 0.7 } });
        return (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: i % 2 === 0 ? wsp.white : wq.orange,
              color: i % 2 === 0 ? wsp.gray : wsp.white,
              fontWeight: 800,
              fontSize: 40,
              padding: "14px 30px 14px 16px",
              borderRadius: 999,
              boxShadow: "0 16px 40px rgba(11,60,90,0.3)",
              marginLeft: i === 1 ? 36 : 0,
              opacity: frame >= at ? 1 : 0,
              transform: `scale(${s * out}) rotate(${[-5, 4, -3][i]}deg)`,
            }}
          >
            {frame >= at ? <Sfx at={at} volume={0.3} /> : null}
            <Icon kind="help" size={46} color={i % 2 === 0 ? wq.orange : wsp.white} />
            {text}
          </div>
        );
      })}
    </div>
  );
};

const responses = [
  { at: 16, stars: 5, text: "Atendimento ótimo!" },
  { at: 30, stars: 4, text: "Faltou o tamanho M" },
  { at: 44, stars: 5, text: "Voltarei com certeza" },
];

const Dashboard: React.FC<{ b: Beats }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - b.live;
  if (local < 0) return null;
  const enter = spring({ frame: local - 6, fps, config: { damping: 14 } });
  const count = Math.round(interpolate(local, [10, 70], [96, 127], clamp));
  const score = interpolate(local, [10, 60], [3.9, 4.8], clamp);
  const bars = [
    { label: "Atendimento", v: 0.92 },
    { label: "Produtos", v: 0.78 },
    { label: "Experiência", v: 0.88 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 470,
        width: 940,
        transform: `translateX(${interpolate(enter, [0, 1], [1200, 0])}px)`,
      }}
    >
      <div
        style={{
          background: wsp.white,
          borderRadius: 40,
          padding: "34px 40px 40px",
          boxShadow: "0 30px 80px rgba(11,60,90,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Img src={staticFile(wq.logoOrange)} style={{ height: 66 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 800,
              fontSize: 30,
              color: wsp.blueDeep,
              background: wsp.tint,
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: wsp.blue,
                opacity: 0.4 + 0.6 * Math.abs(Math.sin(local / 6)),
              }}
            />
            ao vivo
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
          {[
            { label: "Satisfação", value: score.toFixed(1).replace(".", ","), star: true },
            { label: "Respostas hoje", value: String(count), star: false },
          ].map((k) => (
            <div
              key={k.label}
              style={{ flex: 1, background: wsp.tint, borderRadius: 28, padding: "22px 28px" }}
            >
              <div style={{ fontWeight: 700, fontSize: 28, color: wsp.gray, opacity: 0.75 }}>
                {k.label}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: 800,
                  fontSize: 76,
                  color: wsp.blueDeep,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {k.value}
                {k.star ? <Icon kind="star" size={58} color={wq.orange} /> : null}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 30 }}>
          {bars.map((b, i) => {
            const g = spring({ frame: local - 14 - i * 5, fps, config: { damping: 15 } });
            return (
              <div key={b.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: 28,
                    color: wsp.gray,
                    marginBottom: 8,
                  }}
                >
                  <span>{b.label}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {Math.round(b.v * 100 * g)}%
                  </span>
                </div>
                <div style={{ height: 22, borderRadius: 999, background: wsp.tint }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${b.v * 100 * g}%`,
                      borderRadius: 999,
                      background: i === 0 ? wq.orange : wsp.grad,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* new answers drop in as they arrive */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 30 }}>
        {responses.map((r, i) => {
          if (local < r.at) return null;
          const s = spring({ frame: local - r.at, fps, config: { damping: 12 } });
          return (
            <div
              key={r.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: wsp.white,
                borderRadius: 28,
                padding: "20px 28px",
                boxShadow: "0 16px 40px rgba(11,60,90,0.28)",
                transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                opacity: s,
                marginLeft: i % 2 === 0 ? 0 : 60,
              }}
            >
              <Sfx at={b.live + r.at} volume={0.28} />
              <Stars filled={r.stars} size={38} gap={4} />
              <div style={{ fontWeight: 800, fontSize: 34, color: wsp.gray }}>“{r.text}”</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Caption: React.FC<{ b: Beats }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = [
    { from: b.choose, to: b.brand - 2, text: "Perguntas que você escolhe" },
    { from: b.brand, to: b.camera, text: "Com a identidade da sua marca" },
    { from: b.panel, to: b.panel + 300, text: "Num painel fácil de acompanhar" },
  ];
  return (
    <>
      {lines.map((l) => {
        if (frame < l.from || frame >= l.to) return null;
        const s = spring({ frame: frame - l.from, fps, config: { damping: 14 } });
        const out = interpolate(frame, [l.to - 8, l.to], [1, 0], clamp);
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: 90,
              right: 90,
              top: 1560,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.15,
              color: wsp.white,
              opacity: s * out,
              transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </>
  );
};

export const HowItWorks: React.FC<{ scene: HowTo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (at: number) => toSceneFrame(scene, at);
  const f2 = (at: number) => toSceneFrame(scene, at, FUNCIONA_V2);
  const b: Beats = {
    connect: f(words.connect),
    tap: f(words.tap),
    survey: f(words.survey),
    stars: f(words.stars),
    choose: f(words.choose),
    brand: f(words.brand),
    camera: f2(words2.camera),
    topics: words2.topics.map(f2),
    live: f2(words2.live),
    panel: f2(words2.panel),
  };
  const head = spring({ frame: frame - 2, fps, config: { damping: 13 } });

  return (
    <AbsoluteFill style={{ background: wsp.grad, fontFamily: wsp.font, overflow: "hidden" }}>
      <Img
        src={staticFile(wsp.wifiSymbol)}
        style={{
          position: "absolute",
          left: -260,
          bottom: -200,
          width: 1600,
          opacity: 0.08,
          transform: `rotate(${-8 + frame * 0.02}deg)`,
        }}
      />
      {/* her takes, hidden: only the voice is used */}
      <AbsoluteFill style={{ opacity: 0 }}>
        {scene.parts.map((part, i) => (
          <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
            {part.src ? (
              <Audio
                src={staticFile(part.src)}
                trimBefore={part.srcStart}
                trimAfter={part.srcStart + part.durationInFrames}
              />
            ) : (
              <TalkPart src={scene.src} part={part} index={i} />
            )}
          </Sequence>
        ))}
      </AbsoluteFill>

      <StepLabel b={b} />
      <Phone b={b} />
      <Topics b={b} />
      <Caption b={b} />
      <Dashboard b={b} />

      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          transform: `translateY(${interpolate(head, [0, 1], [-300, 0])}px)`,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 84,
            color: wsp.white,
            letterSpacing: "-0.02em",
          }}
        >
          Funciona assim
        </div>
        <div
          style={{
            width: interpolate(head, [0, 1], [0, 300]),
            height: 12,
            borderRadius: 999,
            background: wq.orange,
          }}
        />
      </div>

      <Badge animateIn={false} />
      <Img
        src={staticFile(wsp.logoWhite)}
        style={{ position: "absolute", bottom: 70, right: 60, width: 170, opacity: 0.85 }}
      />
      <Sfx at={2} />
      <Sfx at={b.connect - 4} src="audio/sfx/whoosh.wav" volume={0.25} />
      <Sfx at={b.live - 4} src="audio/sfx/whoosh.wav" volume={0.3} />
    </AbsoluteFill>
  );
};
