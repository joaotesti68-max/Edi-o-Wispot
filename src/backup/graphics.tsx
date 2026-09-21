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

/* ── L1: every copy in the same building ───────────────────────────────── */

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
              borderRadius: 20,
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
              borderRadius: 26,
              border: `2px solid ${theme.danger}`,
              opacity: 0.18 + 0.4 * pulse,
              transform: `scale(${1 + 0.06 * pulse})`,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

/* ── L2: one copy outside the main environment ─────────────────────────── */

const Offsite: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame - delay - 16, [0, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const node = (
    icon: React.ReactNode,
    text: string,
    tone: string,
    delayIn: number,
  ) => (
    <Rise delay={delayIn} distance={18} style={{ flex: 1 }}>
      <div
        style={{
          ...card,
          padding: "22px 18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          borderColor: `${tone}55`,
        }}
      >
        {icon}
        <div style={{ ...label, fontSize: 28, textAlign: "center", whiteSpace: "pre-line" }}>
          {text}
        </div>
      </div>
    </Rise>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, width: "100%" }}>
      {node(<BuildingIcon size={46} color={theme.white} strokeWidth={2} />, "Sua empresa", "#ffffff", delay)}

      <div style={{ position: "relative", width: 170, height: 6, flexShrink: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 3,
            background: "rgba(255,255,255,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 6,
            width: `${travel * 100}%`,
            borderRadius: 3,
            background: theme.primaryLight,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -19,
            left: `calc(${travel * 100}% - 22px)`,
            width: 44,
            height: 44,
            borderRadius: 13,
            background: theme.primaryLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: travel > 0 ? 1 : 0,
            boxShadow: `0 0 26px ${theme.primaryLight}88`,
          }}
        >
          <CopyIcon size={22} color="#06131c" strokeWidth={2.4} />
        </div>
      </div>

      {node(
        <OffsiteIcon size={46} color={theme.primaryLight} strokeWidth={2} />,
        "Data center\nPro Advanced",
        theme.primaryLight,
        delay + 20,
      )}
    </div>
  );
};

/* ── L3: the data center itself ────────────────────────────────────────── */

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
                  style={{
                    width: 34,
                    height: 5,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.22)",
                  }}
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

const DataCenter: React.FC<{ delay: number; step: 1 | 2 }> = ({ delay, step }) => {
  const badge = useEnter(step === 2 ? -80 : delay + 104, 13, 0.6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 44, width: "100%" }}>
      <Rise delay={delay} distance={16}>
        <div style={eyebrow}>Data center Pro Advanced</div>
      </Rise>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <Rack delay={step === 2 ? -80 : delay + 4} />

        <div style={{ display: "flex", flexDirection: "column", gap: 26, flex: 1 }}>
          <div
            style={{
              alignSelf: "flex-start",
              padding: "18px 32px",
              borderRadius: 999,
              background: theme.primary,
              fontFamily: brand.fontFamily,
              fontWeight: 800,
              fontSize: 40,
              color: theme.white,
              letterSpacing: 1,
              opacity: interpolate(badge, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(badge, [0, 1], [0.7, 1])})`,
              boxShadow: `0 10px 40px ${theme.primary}66`,
            }}
          >
            PADRÃO TIER 3
          </div>

          <Chip
            icon={BoltIcon}
            label="Energia redundante"
            delay={step === 2 ? delay + 2 : delay + 30}
            ghost={step === 1}
          />
          <Chip
            icon={ThermoIcon}
            label="Controle de temperatura"
            delay={step === 2 ? delay + 20 : delay + 40}
            ghost={step === 1}
          />
          <Chip
            icon={UptimeIcon}
            label="Alta disponibilidade"
            delay={step === 2 ? delay + 40 : delay + 50}
            ghost={step === 1}
          />
        </div>
      </div>
    </div>
  );
};

/* ── L4: the 3-2-1 rule ────────────────────────────────────────────────── */

const Rule321: React.FC<{ delay: number }> = ({ delay }) => {
  const rows = [
    { n: "3", text: "cópias dos dados", icon: CopyIcon, highlight: false },
    { n: "2", text: "tipos de mídia", icon: MediaIcon, highlight: false },
    { n: "1", text: "fora da empresa", icon: OffsiteIcon, highlight: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
      <Rise delay={delay} distance={16}>
        <div style={eyebrow}>Regra 3 · 2 · 1</div>
      </Rise>

      {rows.map((row, i) => {
        const tone = row.highlight ? theme.primaryLight : theme.white;
        return (
          <Rise key={row.n} delay={delay + 40 + i * 24} distance={30}>
            <div
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 34px",
                borderColor: row.highlight ? `${theme.primaryLight}99` : theme.panelBorder,
                background: row.highlight ? "rgba(32,163,214,0.16)" : theme.panel,
              }}
            >
              <div
                style={{
                  fontFamily: brand.fontFamily,
                  fontWeight: 800,
                  fontSize: 98,
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
                <div style={{ ...label, fontSize: 41 }}>{row.text}</div>
              </div>
            </div>
          </Rise>
        );
      })}
    </div>
  );
};

/* ── L5: what can go wrong at head office ──────────────────────────────── */

const Threats: React.FC<{ delay: number }> = ({ delay }) => {
  const items = [
    { icon: HardwareIcon, text: "Falha de equipamento" },
    { icon: FlameIcon, text: "Incêndio" },
    { icon: ThiefIcon, text: "Roubo" },
    { icon: BugIcon, text: "Ataque cibernético" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {items.map((item, i) => (
          <Chip
            key={item.text}
            icon={item.icon}
            label={item.text}
            delay={delay + [0, 32, 60, 84][i]}
            tone="danger"
            compact
          />
        ))}
      </div>

      <Rise delay={delay + 145} distance={22}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "20px 28px",
            borderRadius: 20,
            background: "rgba(58,212,164,0.15)",
            border: `1.5px solid ${theme.success}77`,
          }}
        >
          <ShieldIcon size={38} color={theme.success} strokeWidth={2.1} />
          <div style={{ ...label, fontSize: 33, color: theme.white }}>
            Cópia preservada e pronta para recuperação
          </div>
        </div>
      </Rise>
    </div>
  );
};

/* ── L6: hosting and colocation ────────────────────────────────────────── */

const Services: React.FC<{ delay: number }> = ({ delay }) => {
  const items = [
    { icon: CloudUpIcon, title: "Hosting", sub: "Ambientes hospedados" },
    { icon: RackIcon, title: "Colocation", sub: "Seus equipamentos" },
  ];

  return (
    <div style={{ display: "flex", gap: 18, width: "100%" }}>
      {items.map((item, i) => (
        <Rise key={item.title} delay={delay + i * 16} distance={26} style={{ flex: 1 }}>
          <div
            style={{
              ...card,
              padding: "26px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <item.icon size={44} color={theme.primaryLight} strokeWidth={2} />
            <div style={{ ...label, fontSize: 40 }}>{item.title}</div>
            <div style={{ ...label, fontWeight: 700, fontSize: 25, color: theme.muted }}>
              {item.sub}
            </div>
          </div>
        </Rise>
      ))}
    </div>
  );
};

/* ── L8: call to action ────────────────────────────────────────────────── */

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

export const Graphic: React.FC<{ graphic: GraphicKey; delay: number; step?: 1 | 2 }> = ({
  graphic,
  delay,
  step = 1,
}) => {
  switch (graphic) {
    case "singlePoint":
      return <SinglePoint delay={delay} />;
    case "offsite":
      return <Offsite delay={delay} />;
    case "datacenter":
      return <DataCenter delay={delay} step={step} />;
    case "rule321":
      return <Rule321 delay={delay} />;
    case "threats":
      return <Threats delay={delay} />;
    case "services":
      return <Services delay={delay} />;
    case "cta":
      return <Cta delay={delay} />;
    default:
      return null;
  }
};
