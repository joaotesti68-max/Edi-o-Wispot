import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, TileGrid, pa } from "./theme";
import { CARD_H, CARD_W, Cursor, MapGround, StageCard, WindowBar, ramp } from "./ui";

const Tile: React.FC<{
  x: number;
  y: number;
  icon: IconKind;
  size?: number;
  dark?: boolean;
  scale?: number;
  round?: boolean;
}> = ({ x, y, icon, size = 170, dark, scale = 1, round }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: round ? "50%" : size * 0.22,
      background: dark ? pa.deep : pa.white,
      border: dark ? "none" : `4px solid ${pa.tint}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${scale})`,
      boxShadow: "0 12px 30px rgba(28,63,87,0.18)",
    }}
  >
    <Icon kind={icon} size={size * 0.56} color={dark ? pa.white : pa.blue} />
  </div>
);

const Badge: React.FC<{ x: number; y: number; icon: IconKind; scale: number; light?: boolean }> = ({
  x,
  y,
  icon,
  scale,
  light,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - 32,
      top: y - 32,
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: light ? pa.light : pa.deep,
      border: `4px solid ${pa.white}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${scale})`,
    }}
  >
    <Icon kind={icon} size={36} strokeWidth={2.6} />
  </div>
);

const BugDot: React.FC<{ x: number; y: number; size?: number; opacity?: number }> = ({
  x,
  y,
  size = 86,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background: pa.deep,
      border: `4px solid ${pa.white}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 20px rgba(28,63,87,0.35)",
      opacity,
    }}
  >
    <Icon kind="bug" size={size * 0.58} />
  </div>
);

// The attack hits the server's shield and bounces off, then slips in
// through a team laptop and rides its trusted link to the server.
export const AttackDemo: React.FC<{ start: number; server: number; laptop: number; end: number }> = ({
  start,
  server,
  laptop,
  end,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = { x: 250, y: 300 };
  const L = { x: 710, y: 300 };
  const inLaptop = laptop + 16;

  // Bug path: drift to the shield, bounce, hover, dive into the laptop.
  const approach = ramp(frame, start + 6, server);
  const bounce = ramp(frame, server, server + 14);
  const dive = ramp(frame, laptop, inLaptop);
  let bx = interpolate(approach, [0, 1], [520, 395]);
  let by = interpolate(approach, [0, 1], [-60, 205]);
  bx = interpolate(bounce, [0, 1], [bx, 500]);
  by = interpolate(bounce, [0, 1], [by, 120]) + (frame > server + 14 ? Math.sin(frame / 5) * 10 : 0);
  bx = interpolate(dive, [0, 1], [bx, L.x]);
  by = interpolate(dive, [0, 1], [by, L.y]);

  const shieldFlash = frame >= server && frame < server + 10 ? 1 - (frame - server) / 10 : 0;
  const link = ramp(frame, inLaptop + 2, inLaptop + 18);
  const breach = inLaptop + 34;
  const serverHit = frame >= breach;

  return (
    <StageCard start={start} end={end}>
      <svg width={CARD_W} height={CARD_H} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={L.x}
          y1={L.y}
          x2={L.x + (S.x - L.x) * link}
          y2={S.y}
          stroke={frame >= inLaptop ? pa.deep : pa.tint}
          strokeWidth={8}
          strokeDasharray="18 14"
          strokeLinecap="round"
        />
        {frame >= inLaptop + 18
          ? [0, 10, 20].map((o) => {
              const t = ((frame - inLaptop - 18 + o) % 30) / 30;
              return (
                <circle key={o} cx={L.x + (S.x - L.x) * t} cy={S.y} r={12} fill={pa.deep} />
              );
            })
          : null}
        <circle
          cx={S.x}
          cy={S.y}
          r={150}
          fill={`rgba(54,150,205,${0.08 + shieldFlash * 0.3})`}
          stroke={pa.blue}
          strokeWidth={8 + shieldFlash * 8}
          strokeDasharray="30 16"
          strokeLinecap="round"
          transform={`rotate(${frame * 1.5} ${S.x} ${S.y})`}
          opacity={ramp(frame, start + 4, start + 14)}
        />
      </svg>
      <Tile
        x={S.x}
        y={S.y}
        icon="server"
        dark={serverHit}
        scale={spring({ frame: frame - start - 4, fps, config: { damping: 12 } })}
      />
      <Tile
        x={L.x}
        y={L.y}
        icon="laptop"
        dark={frame >= inLaptop}
        scale={
          spring({ frame: frame - start - 9, fps, config: { damping: 12 } }) *
          (frame >= inLaptop && frame < inLaptop + 10 ? 1.08 : 1)
        }
      />
      {frame >= inLaptop ? (
        <Badge
          x={L.x + 70}
          y={L.y - 75}
          icon="bug"
          scale={spring({ frame: frame - inLaptop, fps, config: { damping: 8 } })}
          light
        />
      ) : null}
      {serverHit ? (
        <Badge
          x={S.x + 70}
          y={S.y - 75}
          icon="alert"
          scale={spring({ frame: frame - breach, fps, config: { damping: 8 } })}
          light
        />
      ) : null}
      {frame < inLaptop ? <BugDot x={bx} y={by} /> : null}
      <Sfx at={server} src="audio/sfx/whoosh.wav" volume={0.2} />
      <Sfx at={inLaptop} volume={0.3} />
      <Sfx at={breach} volume={0.3} />
    </StageCard>
  );
};

const PINS: { icon: IconKind; x: number; y: number }[] = [
  { icon: "coffee", x: 190, y: 200 },
  { icon: "home", x: 480, y: 130 },
  { icon: "building", x: 770, y: 210 },
];

// One laptop hopping from the café to home to the office, online at each.
export const MapDemo: React.FC<{ start: number; stops: number[]; end: number }> = ({
  start,
  stops,
  end,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dock = (i: number) => ({ x: PINS[i].x, y: PINS[i].y + 150 });
  let pos = { x: 480, y: 470 };
  stops.forEach((s, i) => {
    const t = ramp(frame, s - 10, s + 4);
    const d = dock(i);
    pos = { x: interpolate(t, [0, 1], [pos.x, d.x]), y: interpolate(t, [0, 1], [pos.y, d.y]) };
  });
  const arrived = stops.map((s) => frame >= s + 4);
  const current = arrived.lastIndexOf(true);
  return (
    <StageCard start={start} end={end}>
      <MapGround width={CARD_W} height={CARD_H} />
      <svg width={CARD_W} height={CARD_H} style={{ position: "absolute", inset: 0 }}>
        {stops.slice(1).map((s, i) => {
          const a = dock(i);
          const b = dock(i + 1);
          const t = ramp(frame, s - 10, s + 4);
          return t > 0 ? (
            <line
              key={s}
              x1={a.x}
              y1={a.y}
              x2={a.x + (b.x - a.x) * t}
              y2={a.y + (b.y - a.y) * t}
              stroke={pa.blue}
              strokeWidth={6}
              strokeDasharray="4 16"
              strokeLinecap="round"
            />
          ) : null;
        })}
      </svg>
      {PINS.map((p, i) => {
        const s = spring({ frame: frame - start - 6 - i * 5, fps, config: { damping: 10 } });
        const on = i === current;
        return (
          <div
            key={p.icon}
            style={{
              position: "absolute",
              left: p.x - 70,
              top: p.y - 70,
              width: 140,
              height: 140,
              transform: `scale(${s * (on ? 1.1 : 1)})`,
            }}
          >
            <Tile x={70} y={70} icon={p.icon} size={140} round />
            {on ? (
              <div style={{ position: "absolute", left: 92, top: -46 }}>
                <div
                  style={{
                    transform: `scale(${spring({ frame: frame - stops[i] - 4, fps, config: { damping: 8 } })})`,
                    opacity: 0.6 + 0.4 * Math.sin(frame / 4),
                  }}
                >
                  <Icon kind="wifi" size={78} color={pa.blue} strokeWidth={2.6} />
                </div>
              </div>
            ) : null}
            {i <= current ? <Sfx at={stops[i] + 4} volume={0.22} /> : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: pos.x - 62,
          top: pos.y - 62,
          width: 124,
          height: 124,
          borderRadius: 32,
          background: pa.grad,
          border: `5px solid ${pa.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 14px 30px rgba(28,63,87,0.35)",
          transform: `scale(${spring({ frame: frame - start - 2, fps, config: { damping: 11 } })})`,
        }}
      >
        <Icon kind="laptop" size={74} />
      </div>
    </StageCard>
  );
};

const ORBIT: IconKind[] = ["laptop", "phone", "desktop", "tablet", "laptop", "phone", "desktop", "tablet"];

// Full-screen cutaway: devices spiral out around the company's systems and
// connect to them; on "endpoints" every device at the edge lights up.
export const OrbitDemo: React.FC<{ start: number; endpoints: number; end: number }> = ({
  start,
  endpoints,
  end,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame >= end) return null;
  const CX = 540;
  const CY = 900;
  const R = 390;
  const reveal = interpolate(frame, [start, start + 12], [0, 120], {
    extrapolateRight: "clamp",
  });
  const rot = (frame - start) * 0.35;
  const edge = ramp(frame, endpoints, endpoints + 24);
  const nodes = ORBIT.map((icon, i) => {
    const appear = start + 10 + i * 5;
    const p = spring({ frame: frame - appear, fps, config: { damping: 13 } });
    const a = ((-90 + i * 45 + rot - (1 - p) * 120) * Math.PI) / 180;
    return { icon, appear, p, x: CX + Math.cos(a) * R * p, y: CY + Math.sin(a) * R * p };
  });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${reveal}% at 50% 47%)` }}>
      <AbsoluteFill style={{ background: pa.grad }} />
      <TileGrid opacity={0.07} />
      <Sfx at={start} src="audio/sfx/whoosh.wav" volume={0.3} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={pa.white}
          strokeWidth={6}
          strokeDasharray="22 18"
          strokeLinecap="round"
          pathLength={1000}
          opacity={edge}
          transform={`rotate(${rot} ${CX} ${CY})`}
        />
        {nodes.map((n, i) => (
          <line
            key={`l${i}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            stroke={pa.white}
            strokeWidth={5}
            opacity={0.5 * n.p}
          />
        ))}
        {nodes.map((n, i) => {
          if (frame < n.appear + 10) return null;
          const t = ((frame + i * 7) % 28) / 28;
          return (
            <circle
              key={`p${i}`}
              cx={n.x + (CX - n.x) * t}
              cy={n.y + (CY - n.y) * t}
              r={9}
              fill={pa.white}
            />
          );
        })}
        {frame >= endpoints
          ? nodes.map((n, i) => {
              const t = ((frame - endpoints + i * 3) % 30) / 30;
              return (
                <circle
                  key={`r${i}`}
                  cx={n.x}
                  cy={n.y}
                  r={80 + t * 70}
                  fill="none"
                  stroke={pa.white}
                  strokeWidth={5}
                  opacity={1 - t}
                />
              );
            })
          : null}
      </svg>
      {nodes.map((n, i) => {
        const lit = frame >= endpoints + i * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x - 72,
              top: n.y - 72,
              width: 144,
              height: 144,
              borderRadius: 36,
              background: lit ? pa.deep : pa.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${n.p})`,
              boxShadow: "0 16px 36px rgba(28,63,87,0.3)",
            }}
          >
            <Icon kind={n.icon} size={84} color={lit ? pa.white : pa.blue} />
            {i % 2 === 0 ? <Sfx at={n.appear} volume={0.14} /> : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: CX - 130,
          top: CY - 130,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: pa.white,
          border: `10px solid ${pa.light}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${spring({ frame: frame - start - 4, fps, config: { damping: 11 } })})`,
          boxShadow: "0 24px 60px rgba(28,63,87,0.35)",
        }}
      >
        <Icon kind="server" size={130} color={pa.blue} />
      </div>
      <Sfx at={endpoints} volume={0.35} />
    </AbsoluteFill>
  );
};

const MailRow: React.FC<{ y: number; active?: boolean; children?: React.ReactNode }> = ({
  y,
  active,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 30,
      right: 30,
      top: y,
      height: 110,
      borderRadius: 22,
      background: active ? pa.white : "#f3f8fc",
      border: active ? `4px solid ${pa.blue}` : "none",
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "0 24px",
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: active ? pa.grad : "#d5e6f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {active ? <Icon kind="mail" size={36} /> : null}
    </div>
    {children ?? (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ width: "45%", height: 14, borderRadius: 7, background: "#d5e6f2" }} />
        <div style={{ width: "75%", height: 12, borderRadius: 6, background: "#e3eef6" }} />
      </div>
    )}
  </div>
);

// Attachment clicked → update postponed → laptop gone → the damage spreads
// from that one device to the servers, the machines and the clients.
export const RiskDemo: React.FC<{
  start: number;
  update: number;
  lost: number;
  spread: number;
  end: number;
}> = ({ start, update, lost, spread, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = frame < update ? 0 : frame < lost ? 1 : frame < spread ? 2 : 3;
  const phaseStart = [start, update, lost, spread][phase];
  const swap = spring({ frame: frame - phaseStart, fps, config: { damping: 16 } });
  const content: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: `scale(${phase === 0 ? 1 : interpolate(swap, [0, 1], [0.92, 1])})`,
    opacity: phase === 0 ? 1 : swap,
  };

  let body: React.ReactNode = null;
  if (phase === 0) {
    const click = start + 24;
    const opened = frame >= click + 2;
    body = (
      <div style={content}>
        <WindowBar title="Caixa de entrada" />
        <MailRow y={110} />
        <MailRow y={236} active>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: 30, color: pa.deep }}>Financeiro</span>
            <span style={{ fontWeight: 700, fontSize: 24, color: pa.gray }}>Fatura em atraso</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              borderRadius: 999,
              background: opened ? pa.deep : pa.tint,
              color: opened ? pa.white : pa.deep,
              fontWeight: 800,
              fontSize: 26,
            }}
          >
            <Icon kind="clip" size={30} color={opened ? pa.white : pa.blue} />
            fatura.pdf
          </div>
        </MailRow>
        <MailRow y={362} />
        {opened
          ? [-50, 0, 50].map((deg, k) => {
              const t = ramp(frame, click + 2, click + 18);
              const a = ((deg - 90) * Math.PI) / 180;
              return (
                <BugDot
                  key={deg}
                  x={760 + Math.cos(a) * 170 * t}
                  y={290 + Math.sin(a) * 150 * t}
                  size={70 + k * 6}
                  opacity={t > 0 ? 1 : 0}
                />
              );
            })
          : null}
        <Cursor
          keys={[
            { at: start + 2, x: 880, y: 520 },
            { at: click, x: 790, y: 300, click: true },
            { at: click + 20, x: 820, y: 470 },
          ]}
        />
      </div>
    );
  } else if (phase === 1) {
    const click = update + 22;
    const shrink = ramp(frame, click + 4, click + 14);
    const days = Math.round(interpolate(frame, [click + 10, click + 30], [0, 214], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }));
    body = (
      <div style={{ ...content, background: pa.tint }}>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 70,
            width: 680,
            height: 360,
            borderRadius: 32,
            background: pa.white,
            boxShadow: "0 18px 40px rgba(28,63,87,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            transform: `scale(${1 - shrink})`,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: pa.grad,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon kind="refresh" size={60} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 38, color: pa.deep }}>Atualização disponível</span>
          <div style={{ display: "flex", gap: 22 }}>
            <div
              style={{
                padding: "16px 40px",
                borderRadius: 999,
                background: pa.grad,
                color: pa.white,
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              Instalar
            </div>
            <div
              style={{
                padding: "12px 40px",
                borderRadius: 999,
                border: `4px solid ${pa.gray}`,
                color: pa.gray,
                fontWeight: 800,
                fontSize: 28,
                background: frame >= click ? "#eef2f5" : pa.white,
              }}
            >
              Depois
            </div>
          </div>
        </div>
        {frame >= click + 10 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 190,
              display: "flex",
              justifyContent: "center",
              transform: `scale(${spring({ frame: frame - click - 10, fps, config: { damping: 10 } })})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: pa.deep,
                borderRadius: 999,
                padding: "22px 44px 22px 26px",
                color: pa.white,
                fontWeight: 800,
                fontSize: 40,
              }}
            >
              <Icon kind="alert" size={56} color={pa.light} />
              Sem atualizar há {days} dias
            </div>
          </div>
        ) : null}
        <Cursor
          keys={[
            { at: update + 2, x: 860, y: 520 },
            { at: click, x: 620, y: 395, click: true },
            { at: click + 14, x: 760, y: 500 },
          ]}
        />
      </div>
    );
  } else if (phase === 2) {
    const gone = ramp(frame, lost + 10, lost + 22);
    body = (
      <div style={content}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, height: 24, background: pa.tint }} />
        <div style={{ position: "absolute", left: 120, top: 280 }}>
          <Icon kind="coffee" size={120} color={pa.gray} strokeWidth={1.8} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 190,
            width: 300,
            height: 210,
            borderRadius: 26,
            border: `6px dashed ${pa.blue}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: gone,
            fontWeight: 800,
            fontSize: 120,
            color: pa.blue,
          }}
        >
          <span style={{ transform: `scale(${1 + 0.08 * Math.sin(frame / 4)})` }}>?</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 410 + gone * 760,
            top: 170,
            transform: `rotate(${gone * 25}deg)`,
            opacity: 1 - gone * 0.3,
          }}
        >
          <Icon kind="laptop" size={320} color={pa.blue} strokeWidth={1.6} />
        </div>
        {gone > 0 && gone < 1
          ? [0, 1, 2].map((k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 330 + gone * 640 - k * 60,
                  top: 240 + k * 50,
                  width: 140,
                  height: 8,
                  borderRadius: 4,
                  background: pa.tint,
                }}
              />
            ))
          : null}
        <Sfx at={lost + 10} src="audio/sfx/whoosh.wav" volume={0.3} />
      </div>
    );
  } else {
    const SRC = { x: 140, y: 280 };
    const SRV = { x: 430, y: 280 };
    const targets = [
      { icon: "desktop" as IconKind, x: 430, y: 95 },
      { icon: "desktop" as IconKind, x: 430, y: 465 },
      { icon: "user" as IconKind, x: 800, y: 110 },
      { icon: "user" as IconKind, x: 800, y: 280 },
      { icon: "user" as IconKind, x: 800, y: 450 },
    ];
    const hit = (k: number) => spread + 12 + k * 5;
    body = (
      <div style={content}>
        <svg width={CARD_W} height={CARD_H} style={{ position: "absolute", inset: 0 }}>
          {[{ from: SRC, to: SRV, at: spread + 4 }, ...targets.map((t, k) => ({ from: SRV, to: t, at: hit(k) - 6 }))].map(
            (e, k) => {
              const t = ramp(frame, e.at, e.at + 8);
              return (
                <g key={k}>
                  <line x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke={pa.tint} strokeWidth={8} />
                  <line
                    x1={e.from.x}
                    y1={e.from.y}
                    x2={e.from.x + (e.to.x - e.from.x) * t}
                    y2={e.from.y + (e.to.y - e.from.y) * t}
                    stroke={pa.deep}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                </g>
              );
            },
          )}
        </svg>
        <Tile x={SRC.x} y={SRC.y} icon="laptop" size={150} dark />
        <Tile x={SRV.x} y={SRV.y} icon="server" size={150} dark={frame >= spread + 12} />
        {targets.map((t, k) => (
          <div key={k}>
            <Tile
              x={t.x}
              y={t.y}
              icon={t.icon}
              size={130}
              round={t.icon === "user"}
              dark={frame >= hit(k)}
              scale={frame >= hit(k) && frame < hit(k) + 6 ? 1.1 : 1}
            />
            {frame >= hit(k) ? (
              <Badge
                x={t.x + 55}
                y={t.y - 55}
                icon="alert"
                scale={spring({ frame: frame - hit(k), fps, config: { damping: 8 } })}
                light
              />
            ) : null}
          </div>
        ))}
        <Sfx at={spread + 12} volume={0.3} />
      </div>
    );
  }

  return (
    <StageCard start={start} end={end}>
      {body}
    </StageCard>
  );
};
