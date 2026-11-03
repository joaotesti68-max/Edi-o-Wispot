import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Caption } from "./edit";
import { s } from "./edit";
import { bn } from "./theme";

// 0 → 1 spring that starts at `at` seconds into the current Sequence.
export const useIn = (at: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - s(at), fps, config: { damping, mass: 0.7 } });
};

// 1 → 0 over 8 frames starting at `at` seconds.
export const useOut = (at: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [s(at), s(at) + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
};

// --- captions -------------------------------------------------------------
// One short phrase at a time, under the chin. Key phrases get the LP's blue <mark>.
export const Captions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cur = captions.find((c) => t >= c.from && t < c.to);
  if (!cur) return null;
  const local = frame - s(cur.from);
  const pop = interpolate(local, [0, 5], [0.86, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1040,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          transform: `scale(${pop})`,
          fontFamily: bn.text,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.15,
          color: bn.white,
          textAlign: "center",
          background: cur.mark ? bn.blue : "transparent",
          padding: cur.mark ? "4px 22px 8px" : 0,
          borderRadius: 14,
          textShadow: cur.mark ? "none" : "0 4px 18px rgba(0,0,0,.75), 0 2px 4px rgba(0,0,0,.6)",
          boxShadow: cur.mark ? "0 14px 40px rgba(37,168,224,.35)" : "none",
        }}
      >
        {cur.text}
      </span>
    </div>
  );
};

// --- giant BLACK / NOVEMBER (LP hero type) --------------------------------
const MaskLine: React.FC<{ at: number; color: string; children: string }> = ({
  at,
  color,
  children,
}) => {
  const p = useIn(at, 18);
  return (
    <span style={{ display: "block", overflow: "hidden", padding: "0.04em 0 0.03em" }}>
      <span
        style={{
          display: "inline-block",
          color,
          transform: `translateY(${interpolate(p, [0, 1], [105, 0])}%)`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

export const Giant: React.FC<{
  at: number;
  out?: number;
  top: number;
  size: number;
  sticker?: number;
}> = ({ at, out = 999, top, size, sticker }) => {
  const o = useOut(out);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top,
        opacity: o,
        fontFamily: bn.title,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,.45))",
      }}
    >
      <MaskLine at={at} color={bn.white}>
        BLACK
      </MaskLine>
      <MaskLine at={at + 0.12} color={bn.blue}>
        NOVEMBER
      </MaskLine>
      {sticker !== undefined && (
        <div style={{ position: "absolute", left: size * 3.35, top: -size * 0.2 }}>
          <Sticker at={sticker} size={size * 1.05} />
        </div>
      )}
    </div>
  );
};

// --- rotating "+3" seal ---------------------------------------------------
export const Sticker: React.FC<{ at: number; size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, 11);
  const text = "18 meses · 3 grátis · 21 pagando 18 · ";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bn.white,
        display: "grid",
        placeItems: "center",
        transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-40, 10])}deg)`,
        boxShadow: "0 18px 50px rgba(0,0,0,.35)",
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: `rotate(${frame * 1.2}deg)`,
        }}
      >
        <defs>
          <path id="bn-c" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
        </defs>
        <text
          style={{
            fontFamily: bn.text,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.14em",
            fill: bn.ink,
            textTransform: "uppercase",
          }}
        >
          <textPath href="#bn-c" textLength={458} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <b
        style={{
          fontFamily: bn.title,
          fontWeight: 700,
          fontSize: size * 0.34,
          letterSpacing: "-0.03em",
          color: bn.blue,
        }}
      >
        +3
      </b>
    </div>
  );
};

// --- shared card shell (white body, blue header, perforation like the LP coupon)
const Card: React.FC<{
  at: number;
  out?: number;
  top?: number;
  kicker: string;
  children: React.ReactNode;
  header: React.ReactNode;
}> = ({ at, out = 999, top = 1250, kicker, header, children }) => {
  const p = useIn(at, 15);
  const o = useOut(out);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        opacity: o * Math.min(1, p * 1.4),
        transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px)`,
        borderRadius: 30,
        overflow: "visible",
        boxShadow: "0 30px 80px rgba(0,0,0,.45)",
      }}
    >
      <div
        style={{
          background: bn.gradient,
          color: bn.white,
          padding: "30px 40px 34px",
          borderRadius: "30px 30px 0 0",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: bn.text,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.92,
          }}
        >
          {kicker}
        </div>
        <div style={{ fontFamily: bn.title, fontWeight: 700, fontSize: 64, lineHeight: 1.05, marginTop: 8 }}>
          {header}
        </div>
        {/* perforation */}
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            bottom: -2,
            borderBottom: `4px dashed rgba(255,255,255,.75)`,
          }}
        />
        <div style={{ position: "absolute", left: -18, bottom: -18, width: 36, height: 36, borderRadius: "50%", background: bn.ink }} />
        <div style={{ position: "absolute", right: -18, bottom: -18, width: 36, height: 36, borderRadius: "50%", background: bn.ink }} />
      </div>
      <div
        style={{
          background: bn.white,
          color: bn.ink,
          padding: "28px 40px 32px",
          borderRadius: "0 0 30px 30px",
          fontFamily: bn.text,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1.3,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Reveal: React.FC<{ at: number; children: React.ReactNode; inline?: boolean }> = ({
  at,
  children,
  inline,
}) => {
  const p = useIn(at, 13);
  return (
    <span
      style={{
        display: inline ? "inline-block" : "block",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        transformOrigin: "left center",
      }}
    >
      {children}
    </span>
  );
};

// Hook take: coupon fills in as she says "18 meses ... 3 grátis".
export const CouponCard: React.FC<{ at: number; plus: number }> = ({ at, plus }) => (
  <Card
    at={at}
    kicker="Cupom Black November"
    header={
      <>
        <Reveal at={at} inline>
          18 meses
        </Reveal>{" "}
        <Reveal at={plus} inline>
          + 3 grátis
        </Reveal>
      </>
    }
  >
    <Reveal at={plus + 0.15}>
      Você garante <span style={{ color: bn.blueDeep }}>21 meses</span> de Wispot pagando 18.
    </Reveal>
  </Card>
);

// Offer take: 21 counts up, then "pagando só 18".
export const MonthsCard: React.FC<{ at: number; pay: number; out: number }> = ({ at, pay, out }) => {
  const frame = useCurrentFrame();
  const n = Math.round(
    interpolate(frame, [s(at), s(at) + 18], [18, 21], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
  return (
    <Card
      at={at}
      out={out}
      kicker="Black November Wispot"
      header={
        <span style={{ fontSize: 120, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
          {n} <span style={{ fontSize: 64 }}>meses</span>
        </span>
      }
    >
      de Wi-Fi inteligente{" "}
      <Reveal at={pay} inline>
        pagando apenas <span style={{ color: bn.blueDeep, fontSize: 44 }}>18</span>
      </Reveal>
    </Card>
  );
};

// Offer take, second half: the revenue line.
export const RevenueTag: React.FC<{ at: number }> = ({ at }) => {
  const p = useIn(at, 14);
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [s(at) + 4, s(at) + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1250,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${interpolate(p, [0, 1], [90, 0])}px)`,
        background: "rgba(5,6,8,.82)",
        border: `2px solid ${bn.blue}`,
        borderRadius: 30,
        padding: "34px 40px",
        display: "flex",
        alignItems: "center",
        gap: 34,
        boxShadow: "0 30px 80px rgba(0,0,0,.45)",
      }}
    >
      <svg width="170" height="120" viewBox="0 0 170 120">
        <path
          d="M8 108 L52 74 L86 88 L160 14"
          fill="none"
          stroke={bn.blue}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        <path
          d="M122 12 L162 12 L162 52"
          fill="none"
          stroke={bn.blue}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={draw > 0.85 ? 1 : 0}
        />
      </svg>
      <div style={{ fontFamily: bn.title, fontWeight: 700, fontSize: 62, lineHeight: 1.02, color: bn.white }}>
        Nova fonte
        <br />
        <span style={{ color: bn.blue }}>de receita</span>
      </div>
    </div>
  );
};

// Audience take: one chip per segment she names.
export const Chips: React.FC<{ items: { text: string; at: number }[]; out: number }> = ({ items, out }) => {
  const o = useOut(out);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1250,
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        opacity: o,
      }}
    >
      {items.map((it) => (
        <Chip key={it.text} {...it} />
      ))}
    </div>
  );
};

const Chip: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const p = useIn(at, 12);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        background: bn.white,
        color: bn.ink,
        fontFamily: bn.text,
        fontWeight: 800,
        fontSize: 42,
        padding: "18px 30px",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 16px 40px rgba(0,0,0,.35)",
      }}
    >
      <Img src={staticFile("wispot/wifi-symbol.png")} style={{ height: 30 }} />
      {text}
    </div>
  );
};

export const BigLine: React.FC<{ at: number; top: string; bottom: string }> = ({ at, top, bottom }) => (
  <div
    style={{
      position: "absolute",
      left: 70,
      right: 70,
      top: 1250,
      fontFamily: bn.title,
      fontWeight: 700,
      fontSize: 104,
      lineHeight: 0.95,
      letterSpacing: "-0.03em",
      textTransform: "uppercase",
      filter: "drop-shadow(0 10px 30px rgba(0,0,0,.55))",
    }}
  >
    <MaskLine at={at} color={bn.white}>
      {top}
    </MaskLine>
    <MaskLine at={at + 0.1} color={bn.blue}>
      {bottom}
    </MaskLine>
  </div>
);

// Urgency take: deadline card, then CTA pill.
export const DeadlineCard: React.FC<{ at: number; cta: number }> = ({ at, cta }) => {
  const p = useIn(cta, 12);
  const frame = useCurrentFrame();
  const pulse = 1 + 0.035 * Math.sin(((frame - s(cta)) / 30) * Math.PI * 2.2) * (frame > s(cta) + 10 ? 1 : 0);
  return (
    <>
      <Card
        at={at}
        kicker="Oferta válida até"
        header={<span style={{ fontSize: 110, letterSpacing: "-0.03em" }}>30/11</span>}
      >
        Para novos contratos de 18 meses.
      </Card>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1660,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, p * 1.4),
          transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${pulse})`,
        }}
      >
        <CtaPill>Garanta já</CtaPill>
      </div>
    </>
  );
};

export const CtaPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: bn.blue,
      color: bn.white,
      fontFamily: bn.text,
      fontWeight: 800,
      fontSize: 44,
      padding: "24px 56px",
      borderRadius: 999,
      boxShadow: "0 18px 50px rgba(37,168,224,.45)",
      display: "flex",
      alignItems: "center",
      gap: 18,
    }}
  >
    {children}
    <span aria-hidden>→</span>
  </div>
);

export const AttentionTag: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const p = useIn(at, 9);
  const o = useOut(out);
  const frame = useCurrentFrame();
  const shake = Math.sin(frame * 1.9) * interpolate(frame, [s(at), s(at) + 14], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1270,
        display: "flex",
        justifyContent: "center",
        opacity: o * Math.min(1, p * 1.5),
        transform: `scale(${p}) rotate(${-3 + shake}deg)`,
      }}
    >
      <div
        style={{
          background: bn.white,
          color: bn.ink,
          fontFamily: bn.title,
          fontWeight: 700,
          fontSize: 88,
          letterSpacing: "-0.02em",
          padding: "14px 44px 20px",
          borderRadius: 22,
          boxShadow: "0 20px 60px rgba(0,0,0,.4)",
        }}
      >
        ATENÇÃO<span style={{ color: bn.blue }}>!</span>
      </div>
    </div>
  );
};
