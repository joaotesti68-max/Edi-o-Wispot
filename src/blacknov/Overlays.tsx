import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../loadFont";
import type { Chunk, Clip } from "./edit";
import { at, chunksFor, pa } from "./edit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- grade: escurece a parede cinza e puxa para o azul-marinho ----------
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill
      style={{ background: pa.blue, mixBlendMode: "soft-light", opacity: 0.12 }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 85% 60% at 50% 42%, rgba(0,12,25,0) 50%, rgba(0,12,25,0.18) 80%, rgba(2,5,9,0.4) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(2,5,9,0.5) 0%, rgba(2,5,9,0) 14%, rgba(2,5,9,0) 80%, rgba(2,5,9,0.3) 100%)",
      }}
    />
  </>
);

// ---------- moldura fixa: selo Black November e logo ----------
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 88,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: pa.black,
          border: `2px solid ${pa.blue}`,
          padding: "12px 22px",
          borderRadius: 6,
          color: pa.white,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 4,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: pa.red,
            opacity: blink,
            boxShadow: `0 0 14px ${pa.red}`,
          }}
        />
        BLACK NOVEMBER
      </div>
      <Img
        src={staticFile("brand/pa-logo-white.png")}
        style={{ position: "absolute", top: 96, right: 88, width: 250 }}
      />
    </AbsoluteFill>
  );
};

// ---------- legenda palavra a palavra em caixa preta ----------
const CaptionChunk: React.FC<{ chunk: Chunk; clip: Clip }> = ({ chunk, clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - chunk.from, fps, config: { damping: 13, mass: 0.6 } });
  if (frame < chunk.from || frame >= chunk.to) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1330,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 22px",
          background: "rgba(2,5,9,0.9)",
          borderLeft: `8px solid ${pa.blue}`,
          padding: "20px 34px 24px",
          borderRadius: 10,
          transform: `scale(${interpolate(pop, [0, 1], [0.94, 1])})`,
          opacity: pop,
          boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
        }}
      >
        {chunk.words.map((word, i) => {
          const start = at(clip, word.at);
          const said = frame >= start;
          const hit = spring({ frame: frame - start, fps, config: { damping: 10, mass: 0.4 } });
          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 78,
                lineHeight: 1.12,
                textTransform: "uppercase",
                color: said ? (word.key ? pa.cyan : pa.white) : "rgba(255,255,255,0.38)",
                textShadow: said && word.key ? `0 0 26px ${pa.blue}` : "none",
                transform: `translateY(${said ? interpolate(hit, [0, 1], [4, 0]) : 0}px) scale(${said ? interpolate(hit, [0, 1], [1.04, 1]) : 1})`,
                display: "inline-block",
              }}
            >
              {word.text.replace(/[.,?]$/, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Captions: React.FC<{ clip: Clip }> = ({ clip }) => (
  <AbsoluteFill>
    {chunksFor(clip).map((c, i) => (
      <CaptionChunk key={i} chunk={c} clip={clip} />
    ))}
  </AbsoluteFill>
);

// ---------- transição: flash + faixas de glitch ----------
export const GlitchFlash: React.FC<{ seed: number; length?: number }> = ({
  seed,
  length = 7,
}) => {
  const frame = useCurrentFrame();
  if (frame >= length) return null;
  const flash = interpolate(frame, [0, 2, length], [0.3, 0.1, 0], clamp);
  const bars = Array.from({ length: 9 }, (_, i) => {
    const r = random(`${seed}-${frame}-${i}`);
    const top = random(`${seed}-${frame}-${i}-y`) * 1920;
    const h = 12 + r * 90;
    const x = (random(`${seed}-${frame}-${i}-x`) - 0.5) * 260;
    const color = i % 3 === 0 ? pa.red : i % 3 === 1 ? pa.blue : pa.white;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          top,
          left: x,
          width: 1080,
          height: h,
          background: color,
          mixBlendMode: "screen",
          opacity: 0.22 * (1 - frame / length),
        }}
      />
    );
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: pa.white, opacity: flash }} />
      {bars}
    </AbsoluteFill>
  );
};

// ---------- título em blocos no topo ----------
export const Slam: React.FC<{
  from: number;
  until?: number;
  lines: { text: string; style?: "solid" | "outline" | "box" | "alert" }[];
  top?: number;
  size?: number;
}> = ({ from, until, lines, top = 250, size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || (until !== undefined && frame >= until + 8)) return null;
  const out =
    until === undefined ? 0 : interpolate(frame, [until, until + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily, alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: 1 - out,
          transform: `translateY(${-out * 40}px)`,
        }}
      >
        {lines.map((line, i) => {
          const s = spring({
            frame: frame - from - i * 5,
            fps,
            config: { damping: 11, mass: 0.7 },
          });
          const jitter =
            frame - from - i * 5 < 6 ? (random(`${from}-${i}-${frame}`) - 0.5) * 4 : 0;
          const base: React.CSSProperties = {
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: -2,
            transform: `scale(${interpolate(s, [0, 1], [1.2, 1])}) translateX(${jitter}px)`,
            opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
            whiteSpace: "nowrap",
          };
          if (line.style === "outline")
            return (
              <div
                key={i}
                style={{
                  ...base,
                  color: "transparent",
                  WebkitTextStroke: `4px ${pa.white}`,
                  textShadow: `0 0 30px rgba(43,163,219,0.6)`,
                }}
              >
                {line.text}
              </div>
            );
          if (line.style === "box" || line.style === "alert")
            return (
              <div
                key={i}
                style={{
                  ...base,
                  fontSize: size * 0.62,
                  letterSpacing: 1,
                  color: line.style === "alert" ? pa.white : pa.black,
                  background: line.style === "alert" ? pa.red : pa.grad,
                  padding: "14px 30px 16px",
                  borderRadius: 8,
                  boxShadow: `0 0 40px ${line.style === "alert" ? "rgba(249,109,100,0.6)" : "rgba(43,163,219,0.7)"}`,
                }}
              >
                {line.text}
              </div>
            );
          return (
            <div
              key={i}
              style={{
                ...base,
                color: pa.white,
                textShadow: `0 6px 30px rgba(0,0,0,0.5)`,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- alertas (controles de acesso / monitoramento) ----------
const AlertIcon: React.FC<{ color: string; kind: "alert" | "check" }> = ({ color, kind }) => (
  <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    {kind === "alert" ? (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 10v4.5" />
        <path d="M12 17.3v.2" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M7.8 12.3l2.8 2.8 5.6-6" />
      </>
    )}
  </svg>
);

export const AlertChip: React.FC<{
  from: number;
  text: string;
  top: number;
  side: "left" | "right";
  color?: string;
  until?: number;
  icon?: "alert" | "check";
}> = ({ from, text, top, side, color = pa.red, until, icon = "alert" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || (until !== undefined && frame >= until + 8)) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 13 } });
  const out = until === undefined ? 0 : interpolate(frame, [until, until + 8], [0, 1], clamp);
  const pulse = 0.5 + 0.5 * Math.sin((frame - from) / 3);
  return (
    <div
      style={{
        position: "absolute",
        top,
        [side]: 90,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(2,5,9,0.92)",
        border: `3px solid ${color}`,
        borderRadius: 10,
        padding: "16px 28px 16px 20px",
        fontFamily,
        fontWeight: 800,
        fontSize: 44,
        color: pa.white,
        textTransform: "uppercase",
        transform: `translateX(${(1 - s) * (side === "left" ? -700 : 700)}px)`,
        opacity: 1 - out,
        boxShadow: `0 0 ${12 + pulse * 6}px ${color}55`,
      }}
    >
      <AlertIcon color={color} kind={icon} />
      {text}
    </div>
  );
};

// ---------- scanner: avaliação em andamento ----------
export const Scanner: React.FC<{ from: number; until: number }> = ({ from, until }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= until + 8) return null;
  const local = frame - from;
  const pct = Math.min(100, Math.round(interpolate(local, [0, until - from], [0, 100], clamp)));
  const out = interpolate(frame, [until, until + 8], [0, 1], clamp);
  const sweepY = 560 + ((local * 18) % 760);
  return (
    <AbsoluteFill style={{ opacity: (1 - out) * interpolate(local, [0, 6], [0, 1], clamp) }}>
      <div
        style={{
          position: "absolute",
          top: sweepY,
          left: 0,
          right: 0,
          height: 4,
          background: pa.cyan,
          boxShadow: `0 0 30px 8px ${pa.blue}`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: sweepY - 160,
          left: 0,
          right: 0,
          height: 160,
          background: "linear-gradient(180deg, rgba(43,163,219,0) 0%, rgba(43,163,219,0.16) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          fontFamily,
          fontWeight: 800,
          color: pa.white,
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 8, color: pa.cyan }}>
          AVALIANDO SEU AMBIENTE
        </div>
        <div style={{ width: 640, height: 22, border: `3px solid ${pa.blue}`, borderRadius: 4, padding: 3 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pa.grad }} />
        </div>
        <div style={{ fontSize: 34, opacity: 0.85 }}>{pct}%</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- carimbo ----------
export const Stamp: React.FC<{ from: number; text: string; top: number }> = ({
  from,
  text,
  top,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 9, mass: 0.8 } });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top,
          fontFamily,
          fontWeight: 800,
          fontSize: 110,
          color: pa.white,
          border: `10px solid ${pa.white}`,
          background: pa.grad,
          padding: "10px 44px 16px",
          borderRadius: 14,
          transform: `rotate(-7deg) scale(${interpolate(s, [0, 1], [1.4, 1])})`,
          opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
          boxShadow: `0 0 60px ${pa.blue}, 0 20px 60px rgba(0,0,0,0.6)`,
          textShadow: "0 4px 0 rgba(0,12,25,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ---------- tremida de câmera no impacto ----------
export const shake = (frame: number, at: number, amount = 18, length = 10) => {
  const d = frame - at;
  if (d < 0 || d > length) return { x: 0, y: 0 };
  const k = amount * (1 - d / length);
  return {
    x: (random(`sx-${at}-${frame}`) - 0.5) * 2 * k,
    y: (random(`sy-${at}-${frame}`) - 0.5) * 2 * k,
  };
};

export const ease = Easing.out(Easing.cubic);
