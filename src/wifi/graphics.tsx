import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { Chip, Rise, theme, useEnter } from "../backup/ui";
import {
  ActivityIcon,
  ChatAlertIcon,
  DevicesIcon,
  DoorOpenIcon,
  GearIcon,
  InterferenceIcon,
  KeyIcon,
  LayersIcon,
  LockOpenIcon,
  LoopIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SlowIcon,
  StallIcon,
  TrendIcon,
  UserCheckIcon,
  WifiIcon,
  WifiOffIcon,
} from "./WifiIcons";
import type { GraphicKey } from "./content";

type IconC = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;

const card: React.CSSProperties = {
  background: theme.panel,
  border: `1.5px solid ${theme.panelBorder}`,
  borderRadius: 26,
  backdropFilter: "blur(16px)",
};

const label: React.CSSProperties = {
  fontFamily: brand.fontFamily,
  fontWeight: 700,
  color: theme.white,
  letterSpacing: -0.3,
};

const eyebrow: React.CSSProperties = {
  fontFamily: brand.fontFamily,
  fontWeight: 700,
  fontSize: 24,
  letterSpacing: 3.4,
  color: theme.primaryLight,
  textTransform: "uppercase",
};

const fade = (v: number) => interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" });

/* ── abertura: o sinal que cai e a reclamação ──────────────────────────── */

const SignalBars: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  // Signal keeps dropping out: 4 bars → 1 bar in a jittery loop.
  const level = t < 10 ? 4 : [4, 3, 1, 2, 1, 3, 1, 1, 2, 1][Math.floor(t / 7) % 10];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 50 }}>
      {[1, 2, 3, 4].map((b) => (
        <div
          key={b}
          style={{
            width: 12,
            height: 12 + b * 9.5,
            borderRadius: 3,
            background: b <= level ? (level <= 1 ? theme.danger : theme.white) : "rgba(255,255,255,0.18)",
          }}
        />
      ))}
    </div>
  );
};

const Unstable: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const dropped = Math.floor((frame - delay) / 7) % 10 >= 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <Rise delay={delay} distance={22}>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 24, padding: "22px 30px" }}>
          {dropped ? (
            <WifiOffIcon size={46} color={theme.danger} strokeWidth={2.1} />
          ) : (
            <WifiIcon size={46} color={theme.white} strokeWidth={2.1} />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ ...label, fontSize: 32 }}>Wi-Fi Corporativo</div>
            <div style={{ ...label, fontSize: 24, color: dropped ? theme.danger : theme.muted }}>
              {dropped ? "Conexão instável" : "Conectado"}
            </div>
          </div>
          <div style={{ width: 20 }} />
          <SignalBars delay={delay} />
        </div>
      </Rise>
      {/* "…ou já virou motivo de reclamação?" */}
      <Chip icon={ChatAlertIcon} label="“A internet caiu de novo!”" delay={76} tone="danger" compact />
    </div>
  );
};

/* ── WLAN mal configurada ──────────────────────────────────────────────── */

const WlanIssues: React.FC<{ delay: number }> = ({ delay }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
    <Chip icon={WifiOffIcon} label="Quedas de conexão" delay={delay} tone="danger" compact />
    <Chip icon={SlowIcon} label="Lentidão no horário de pico" delay={delay + 33} tone="danger" compact />
    <Chip icon={InterferenceIcon} label="Interferência entre equipamentos" delay={delay + 60} tone="danger" compact />
  </div>
);

const Stalled: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const blink = Math.sin((frame - delay) / 3) > -0.2;
  return (
    <div style={{ display: "flex", opacity: blink ? 1 : 0.55 }}>
      <Chip icon={StallIcon} label="Operação parada" delay={delay} tone="danger" />
    </div>
  );
};

/* ── mockup: riscos (ele lê no papel) ──────────────────────────────────── */

const RiskRow: React.FC<{ icon: IconC; text: string; delay: number }> = ({ icon: Icon, text, delay }) => (
  <Rise delay={delay} distance={30}>
    <div
      style={{
        ...card,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "26px 32px",
        borderColor: `${theme.danger}55`,
      }}
    >
      <div
        style={{
          width: 74,
          height: 74,
          borderRadius: 20,
          background: `${theme.danger}24`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={40} color={theme.danger} strokeWidth={2.1} />
      </div>
      <div style={{ ...label, fontSize: 44 }}>{text}</div>
    </div>
  </Rise>
);

const Risks: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  // "transformam a rede em uma porta aberta…" lands at ~132; the list steps back.
  const door = useEnter(delay + 130, 14, 0.7);
  const listDim = interpolate(door, [0, 1], [1, 0.12]);
  const pulse = 0.5 + 0.5 * Math.sin((frame - delay - 130) / 4);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, opacity: listDim }}>
        <Rise delay={delay} distance={16}>
          <div style={eyebrow}>Riscos na rede sem fio</div>
        </Rise>
        <RiskRow icon={KeyIcon} text="Senhas fracas" delay={delay + 1} />
        <RiskRow icon={WifiIcon} text="Redes abertas" delay={delay + 25} />
        <RiskRow icon={LayersIcon} text="Sem segmentação" delay={delay + 45} />
        <RiskRow icon={DevicesIcon} text="Dispositivos sem controle" delay={delay + 78} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          transform: `translateY(-50%) scale(${interpolate(door, [0, 1], [0.8, 1])})`,
          opacity: fade(door),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
          padding: "64px 40px",
          borderRadius: 36,
          background: "rgb(38,10,7)",
          border: `2.5px solid ${theme.danger}`,
          boxShadow: `0 0 ${60 + 50 * pulse}px ${theme.danger}66`,
        }}
      >
        <div style={{ display: "flex", gap: 30 }}>
          <DoorOpenIcon size={130} color={theme.danger} strokeWidth={1.7} />
          <LockOpenIcon size={130} color={theme.danger} strokeWidth={1.7} />
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 66,
            lineHeight: 1.08,
            color: theme.white,
            textAlign: "center",
            letterSpacing: -1,
          }}
        >
          Uma porta aberta
          <br />
          <span style={{ color: theme.danger }}>pra invasão</span>
        </div>
      </div>
    </div>
  );
};

/* ── "não é só internet lenta" ─────────────────────────────────────────── */

const NotJustSlow: React.FC<{ delay: number }> = ({ delay }) => (
  // "segurança" / "continuidade" / "produtividade"
  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
    <Chip icon={ShieldCheckIcon} label="Segurança" delay={delay} compact />
    <Chip icon={LoopIcon} label="Continuidade" delay={delay + 12} compact />
    <Chip icon={TrendIcon} label="Produtividade" delay={delay + 32} compact />
  </div>
);

/* ── mockup: rede estruturada, segmentada e monitorada ─────────────────── */

const SEGMENTS = [
  { name: "Corporativo", color: theme.primaryLight },
  { name: "Visitantes", color: "#9b8cff" },
  { name: "Dispositivos", color: theme.success },
];

const NetworkDiagram: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const core = useEnter(delay + 4, 15, 0.7);
  // "segmentada" ~42, "monitorada" ~65
  const seg = useEnter(delay + 40, 16, 0.7);
  const mon = useEnter(delay + 63, 16, 0.7);
  const W = 924;
  const H = 520;
  const cx = W / 2;
  const cy = 118;
  const leaves = SEGMENTS.map((s, i) => ({ ...s, x: 160 + i * 302, y: 400 }));

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {leaves.map((l, i) => {
          const len = 400;
          const drawn = interpolate(frame - delay - 40 - i * 5, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const packet = ((frame - delay + i * 11) % 36) / 36;
          return (
            <g key={l.name}>
              <path
                d={`M${cx} ${cy + 60} C ${cx} ${cy + 180}, ${l.x} ${l.y - 190}, ${l.x} ${l.y - 64}`}
                stroke={l.color}
                strokeWidth={4}
                fill="none"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - drawn)}
                opacity={0.85}
              />
              {drawn >= 1 ? (
                <circle
                  cx={cx + (l.x - cx) * packet}
                  cy={cy + 60 + (l.y - 64 - cy - 60) * packet}
                  r={7}
                  fill={l.color}
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* Access point */}
      <div
        style={{
          position: "absolute",
          left: cx - 72,
          top: cy - 60,
          width: 144,
          height: 144,
          borderRadius: 40,
          background: theme.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 16px 60px ${theme.primary}88`,
          opacity: fade(core),
          transform: `scale(${interpolate(core, [0, 1], [0.6, 1])})`,
        }}
      >
        <WifiIcon size={78} color={theme.white} strokeWidth={2} />
      </div>

      {/* Monitoring ring around the AP */}
      {[0, 1].map((r) => {
        const phase = ((frame - delay - 63 + r * 14) % 28) / 28;
        return (
          <div
            key={r}
            style={{
              position: "absolute",
              left: cx - 72,
              top: cy - 60,
              width: 144,
              height: 144,
              borderRadius: 40,
              border: `3px solid ${theme.primaryLight}`,
              opacity: fade(mon) * (1 - phase) * 0.8,
              transform: `scale(${1 + phase * 0.7})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: cx + 96,
          top: cy - 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 20px",
          borderRadius: 999,
          background: "rgba(58,212,164,0.16)",
          border: `1.5px solid ${theme.success}88`,
          opacity: fade(mon),
          transform: `translateX(${interpolate(mon, [0, 1], [-20, 0])}px)`,
        }}
      >
        <ActivityIcon size={28} color={theme.success} strokeWidth={2.2} />
        <div style={{ ...label, fontSize: 26 }}>Monitorada 24/7</div>
      </div>

      {leaves.map((l, i) => (
        <div
          key={l.name}
          style={{
            position: "absolute",
            left: l.x - 136,
            top: l.y - 64,
            width: 272,
            padding: "22px 0",
            borderRadius: 22,
            background: theme.panel,
            border: `2px solid ${l.color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: interpolate(seg, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(seg, [0, 1], [24 + i * 8, 0])}px)`,
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: l.color }} />
          <div style={{ ...label, fontSize: 32 }}>{l.name}</div>
        </div>
      ))}
    </div>
  );
};

const Benefit: React.FC<{ icon: IconC; text: string; delay: number }> = ({ icon: Icon, text, delay }) => (
  <Rise delay={delay} distance={26}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "20px 28px",
        borderRadius: 20,
        background: "rgba(58,212,164,0.12)",
        border: `1.5px solid ${theme.success}66`,
      }}
    >
      <Icon size={40} color={theme.success} strokeWidth={2.1} />
      <div style={{ ...label, fontSize: 40 }}>{text}</div>
    </div>
  </Rise>
);

const Structured: React.FC<{ delay: number }> = ({ delay }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
    <Rise delay={delay} distance={16}>
      <div style={eyebrow}>Rede sem fio bem estruturada</div>
    </Rise>
    <NetworkDiagram delay={delay} />
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* "estabilidade" ~102, "capacidade de crescer" ~135, "controle real" ~163 */}
      <Benefit icon={ShieldCheckIcon} text="Estabilidade" delay={delay + 100} />
      <Benefit icon={TrendIcon} text="Capacidade de crescer" delay={delay + 133} />
      <Benefit icon={UserCheckIcon} text="Controle de quem acessa o quê" delay={delay + 161} />
    </div>
  </div>
);

/* ── mockup: o que a Pro Advanced entrega ──────────────────────────────── */

const ServiceRow: React.FC<{ n: string; icon: IconC; text: string; delay: number }> = ({
  n,
  icon: Icon,
  text,
  delay,
}) => (
  <Rise delay={delay} distance={30}>
    <div style={{ ...card, display: "flex", alignItems: "center", gap: 28, padding: "34px 36px" }}>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 34,
          color: theme.primaryLight,
          width: 50,
        }}
      >
        {n}
      </div>
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 22,
          background: `${theme.primary}33`,
          border: `1.5px solid ${theme.primaryLight}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={46} color={theme.white} strokeWidth={2} />
      </div>
      <div style={{ ...label, fontSize: 44, lineHeight: 1.12 }}>{text}</div>
    </div>
  </Rise>
);

const Services: React.FC<{ delay: number }> = ({ delay }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 26, width: "100%" }}>
    <Rise delay={delay} distance={16}>
      <Img src={staticFile(brand.logo.white)} style={{ width: 380, marginBottom: 20 }} />
    </Rise>
    {/* "segmentação de acesso" ~5, "monitoramento contínuo" ~41, "gestão completa…" ~69 */}
    <ServiceRow n="01" icon={LayersIcon} text="Segmentação de acesso" delay={delay + 4} />
    <ServiceRow n="02" icon={ActivityIcon} text="Monitoramento contínuo" delay={delay + 39} />
    <ServiceRow n="03" icon={GearIcon} text="Gestão completa da infraestrutura de TI" delay={delay + 67} />
  </div>
);

/* ── chamada final ─────────────────────────────────────────────────────── */

const Cta: React.FC<{ delay: number }> = ({ delay }) => (
  <Rise delay={delay} distance={26} style={{ display: "flex" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "22px 34px",
        borderRadius: 999,
        background: theme.white,
        width: "fit-content",
      }}
    >
      <PhoneIcon size={34} color={brand.colors.ink} strokeWidth={2.2} />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 38,
          color: brand.colors.ink,
          letterSpacing: -0.5,
        }}
      >
        Fale conosco
      </div>
    </div>
  </Rise>
);

export const Graphic: React.FC<{ graphic: GraphicKey; delay: number }> = ({ graphic, delay }) => {
  switch (graphic) {
    case "unstable":
      return <Unstable delay={delay} />;
    case "wlanIssues":
      return <WlanIssues delay={delay} />;
    case "stalled":
      return <Stalled delay={delay} />;
    case "risks":
      return <Risks delay={delay} />;
    case "notJustSlow":
      return <NotJustSlow delay={delay} />;
    case "structured":
      return <Structured delay={delay} />;
    case "services":
      return <Services delay={delay} />;
    case "cta":
      return <Cta delay={delay} />;
    default:
      return null;
  }
};
