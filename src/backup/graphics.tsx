import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { Chip, Rise, theme, useEnter } from "./ui";
import {
  BoltIcon,
  BuildingIcon,
  BugIcon,
  CloudUpIcon,
  CopyIcon,
  FlameIcon,
  HardwareIcon,
  MediaIcon,
  OffsiteIcon,
  PhoneIcon,
  RackIcon,
  ShieldIcon,
  ThermoIcon,
  ThiefIcon,
  UptimeIcon,
} from "./BackupIcons";
import type { GraphicKey } from "./content";

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
  fontSize: 22,
  letterSpacing: 3.4,
  color: theme.primaryLight,
  textTransform: "uppercase",
};

const Badge: React.FC<{ text: string; delay: number; size?: number }> = ({
  text,
  delay,
  size = 40,
}) => {
  const v = useEnter(delay, 13, 0.6);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        padding: `${size * 0.45}px ${size * 0.8}px`,
        borderRadius: 999,
        background: theme.primary,
        fontFamily: brand.fontFamily,
        fontWeight: 800,
        fontSize: size,
        color: theme.white,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        opacity: interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(v, [0, 1], [0.7, 1])})`,
        boxShadow: `0 10px 40px ${theme.primary}66`,
      }}
    >
      {text}
    </div>
  );
};

/* ── "todas as cópias dentro da empresa" ───────────────────────────────── */

const SinglePoint: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin((frame - delay) / 5);
  const v = useEnter(delay, 15, 0.6);

  return (
    <Rise delay={delay} style={{ display: "flex" }}>
      <div
        style={{
          ...card,
          display: "flex",
          alignItems: "center",
          gap: 30,
          padding: "28px 40px",
          width: "fit-content",
        }}
      >
        <div style={{ position: "relative", width: 86, height: 86, flexShrink: 0 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              background: `${theme.danger}22`,
              border: `1.5px solid ${theme.danger}88`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BuildingIcon size={46} color={theme.danger} strokeWidth={2} />
          </div>
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: 28,
              border: `2px solid ${theme.danger}`,
              opacity: 0.18 + 0.4 * pulse,
              transform: `scale(${1 + 0.06 * pulse})`,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.09)",
                  border: "1.5px solid rgba(255,255,255,0.26)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: interpolate(v, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(v, [0, 1], [0.7, 1])})`,
                }}
              >
                <CopyIcon size={30} color={theme.white} strokeWidth={2} />
              </div>
            ))}
          </div>
          <div style={{ ...label, fontSize: 30, color: theme.muted }}>
            3 cópias · 1 único lugar
          </div>
        </div>
      </div>
    </Rise>
  );
};

/* ── "estrutura padrão Tier 3" (ele falando de frente) ─────────────────── */

const Tier3: React.FC<{ delay: number }> = ({ delay }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
    <Chip icon={OffsiteIcon} label="Data center próprio" delay={delay} compact />
    <Badge text="PADRÃO TIER 3" delay={delay + 24} size={36} />
  </div>
);

/* ── mockup: o data center por dentro ──────────────────────────────────── */

const Rack: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const v = useEnter(delay, 17, 0.8);
  const units = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div
      style={{
        width: 316,
        padding: 20,
        borderRadius: 22,
        background: "rgba(4,10,15,0.7)",
        border: `1.5px solid ${theme.primary}55`,
        display: "flex",
        flexDirection: "column",
        gap: 9,
        opacity: interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(v, [0, 1], [0.9, 1])})`,
      }}
    >
      {units.map((u) => {
        const appear = interpolate(frame - delay - u * 3, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const blink = Math.sin((frame - delay) / 4 + u * 1.7) > 0.1;
        return (
          <div
            key={u}
            style={{
              height: 44,
              borderRadius: 10,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 11px",
              opacity: appear,
            }}
          >
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  style={{ width: 34, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.22)" }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  background: blink ? theme.success : "rgba(58,212,164,0.25)",
                  boxShadow: blink ? `0 0 10px ${theme.success}` : "none",
                }}
              />
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  background: !blink ? theme.primaryLight : "rgba(32,163,214,0.25)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DataCenter: React.FC<{ delay: number }> = ({ delay }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 44, width: "100%" }}>
    <Rise delay={delay} distance={16}>
      <div style={eyebrow}>Data center Pro Advanced</div>
    </Rise>

    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <Rack delay={delay} />

      {/* No Tier 3 badge here: the shot before this one already carries it, and
          two of them crossing over in the transition read as a wobble. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 26, flex: 1 }}>
        {/* Each line lights up as he names it. */}
        <Chip icon={BoltIcon} label="Energia redundante" delay={delay + 17} />
        <Chip icon={ThermoIcon} label="Controle de temperatura" delay={delay + 41} />
        <Chip icon={UptimeIcon} label="Alta disponibilidade" delay={delay + 67} />
      </div>
    </div>
  </div>
);

/* ── "também aplicamos a regra 3-2-1" ──────────────────────────────────── */

const NumberTile: React.FC<{ n: string; delay: number; highlight: boolean }> = ({
  n,
  delay,
  highlight,
}) => {
  const v = useEnter(delay, 13, 0.55);
  return (
    <div
      style={{
        width: 112,
        height: 112,
        borderRadius: 26,
        background: highlight ? theme.primary : "rgba(11,19,27,0.78)",
        border: `2px solid ${highlight ? theme.primaryLight : theme.panelBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: brand.fontFamily,
        fontWeight: 800,
        fontSize: 70,
        color: theme.white,
        opacity: interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(v, [0, 1], [0.6, 1])})`,
      }}
    >
      {n}
    </div>
  );
};

const Rule321Badge: React.FC<{ delay: number }> = ({ delay }) => {
  const v = useEnter(delay + 12, 16, 0.7);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {["3", "2", "1"].map((n, i) => (
        <NumberTile key={n} n={n} delay={delay + i * 5} highlight={i === 2} />
      ))}
      <div
        style={{
          ...label,
          fontSize: 32,
          color: theme.muted,
          marginLeft: 14,
          opacity: interpolate(v, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        a regra do
        <br />
        backup seguro
      </div>
    </div>
  );
};

const Rule321: React.FC<{ delay: number }> = ({ delay }) => {
  const rows = [
    { n: "3", text: "cópias dos dados", icon: CopyIcon, at: 19, highlight: false },
    { n: "2", text: "tipos de mídia", icon: MediaIcon, at: 47, highlight: false },
    { n: "1", text: "fora da empresa", icon: OffsiteIcon, at: 71, highlight: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
      <Rise delay={delay} distance={16}>
        <div style={eyebrow}>Regra 3 · 2 · 1</div>
      </Rise>

      {rows.map((row) => {
        const tone = row.highlight ? theme.primaryLight : theme.white;
        return (
          <Rise key={row.n} delay={delay + row.at} distance={30}>
            <div
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "30px 36px",
                borderColor: row.highlight ? `${theme.primaryLight}99` : theme.panelBorder,
                background: row.highlight ? "rgba(32,163,214,0.16)" : theme.panel,
              }}
            >
              <div
                style={{
                  fontFamily: brand.fontFamily,
                  fontWeight: 800,
                  fontSize: 104,
                  lineHeight: 0.9,
                  color: tone,
                  width: 86,
                  textAlign: "center",
                  letterSpacing: -3,
                }}
              >
                {row.n}
              </div>
              <div style={{ width: 2, height: 64, background: "rgba(255,255,255,0.16)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <row.icon size={44} color={tone} strokeWidth={2} />
                <div style={{ ...label, fontSize: 44 }}>{row.text}</div>
              </div>
            </div>
          </Rise>
        );
      })}
    </div>
  );
};

/* ── o que pode dar errado na sede ─────────────────────────────────────── */

const Threats: React.FC<{ delay: number }> = ({ delay }) => {
  // Order and timing follow the take: "uma falha, roubo, incêndio, ataque cibernético".
  const items = [
    { icon: HardwareIcon, text: "Falha de equipamento", at: 0 },
    { icon: ThiefIcon, text: "Roubo", at: 13 },
    { icon: FlameIcon, text: "Incêndio", at: 34 },
    { icon: BugIcon, text: "Ataque cibernético", at: 54 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%" }}>
      {items.map((item) => (
        <Chip
          key={item.text}
          icon={item.icon}
          label={item.text}
          delay={delay + item.at}
          tone="danger"
          compact
        />
      ))}
    </div>
  );
};

const Preserved: React.FC<{ delay: number }> = ({ delay }) => (
  <Rise delay={delay} distance={22}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 30px",
        borderRadius: 20,
        background: "rgba(58,212,164,0.15)",
        border: `1.5px solid ${theme.success}77`,
      }}
    >
      <ShieldIcon size={40} color={theme.success} strokeWidth={2.1} />
      <div style={{ ...label, fontSize: 34 }}>Cópia preservada e pronta para recuperação</div>
    </div>
  </Rise>
);

/* ── card: hosting e colocation ────────────────────────────────────────── */

const Services: React.FC<{ delay: number }> = ({ delay }) => {
  const items = [
    { icon: CloudUpIcon, title: "Hosting", sub: "Hospedagem de ambientes" },
    { icon: RackIcon, title: "Colocation", sub: "Seus equipamentos" },
  ];

  return (
    <div style={{ display: "flex", gap: 18, width: "100%" }}>
      {items.map((item, i) => (
        <Rise key={item.title} delay={delay + i * 12} distance={26} style={{ flex: 1 }}>
          <div
            style={{ ...card, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 10 }}
          >
            <item.icon size={40} color={theme.primaryLight} strokeWidth={2} />
            <div style={{ ...label, fontSize: 38 }}>{item.title}</div>
            <div style={{ ...label, fontSize: 23, color: theme.muted }}>{item.sub}</div>
          </div>
        </Rise>
      ))}
    </div>
  );
};

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
        {brand.site}
      </div>
    </div>
  </Rise>
);

export const Graphic: React.FC<{ graphic: GraphicKey; delay: number }> = ({ graphic, delay }) => {
  switch (graphic) {
    case "singlePoint":
      return <SinglePoint delay={delay} />;
    case "tier3":
      return <Tier3 delay={delay} />;
    case "datacenter":
      return <DataCenter delay={delay} />;
    case "rule321Badge":
      return <Rule321Badge delay={delay} />;
    case "rule321":
      return <Rule321 delay={delay} />;
    case "threats":
      return <Threats delay={delay} />;
    case "preserved":
      return <Preserved delay={delay} />;
    case "services":
      return <Services delay={delay} />;
    case "cta":
      return <Cta delay={delay} />;
    default:
      return null;
  }
};
