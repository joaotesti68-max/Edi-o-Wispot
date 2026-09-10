import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const entra = (frame: number, em: number) => interpolate(frame, [em, em + 12], [0, 1], ease);

/** Fundo comum das telas de apoio: o mesmo petróleo com o eco do sinal da marca. */
const Cena: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: wispot.ink }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 32%, rgba(0,170,227,0.22) 0%, rgba(0,24,36,0) 62%)",
      }}
    />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 88px" }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const Cartao: React.FC<{ children: React.ReactNode; opacity?: number; shift?: number }> = ({
  children,
  opacity = 1,
  shift = 0,
}) => (
  <div
    style={{
      width: "100%",
      background: "rgba(0,63,91,0.55)",
      border: "2px solid rgba(0,170,227,0.45)",
      borderRadius: 34,
      padding: "52px 48px",
      display: "flex",
      flexDirection: "column",
      gap: 34,
      opacity,
      transform: `translateY(${shift}px)`,
    }}
  >
    {children}
  </div>
);

const Titulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 44, color: wispot.white }}>{children}</div>
    <Img src={staticFile(wispot.logo.white)} style={{ width: 140, opacity: 0.9 }} />
  </div>
);

/** Passo 01: a Wispot entra sobre o equipamento que já está na rede. */
export const Instalacao: React.FC = () => {
  const frame = useCurrentFrame();
  const pulso = (frame % 36) / 36;

  return (
    <Cena>
      <Cartao opacity={entra(frame, 0)} shift={interpolate(entra(frame, 0), [0, 1], [22, 0])}>
        <Titulo>Instalação</Titulo>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 340 }}>
          <svg width="520" height="330" viewBox="0 0 520 330">
            {[0, 1, 2].map((i) => {
              const p = (pulso + i / 3) % 1;
              return (
                <circle
                  key={i}
                  cx="260"
                  cy="228"
                  r={60 + p * 150}
                  fill="none"
                  stroke={wispot.cyan}
                  strokeWidth="4"
                  strokeOpacity={0.5 * (1 - p)}
                />
              );
            })}
            <rect x="170" y="208" width="180" height="66" rx="16" fill="rgba(255,255,255,0.94)" />
            <circle cx="205" cy="241" r="7" fill={wispot.cyan} />
            <rect x="228" y="236" width="86" height="9" rx="4" fill="rgba(0,63,91,0.45)" />
            <line x1="205" y1="208" x2="182" y2="168" stroke="rgba(255,255,255,0.9)" strokeWidth="7" strokeLinecap="round" />
            <line x1="315" y1="208" x2="338" y2="168" stroke="rgba(255,255,255,0.9)" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["Sobre o equipamento que já opera", "Sem parada longa", "Sem trocar infraestrutura"].map(
            (t, i) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: entra(frame, 16 + i * 10),
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={wispot.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4,12.5 9.5,18 20,6.5" />
                </svg>
                <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: wispot.white }}>{t}</div>
              </div>
            ),
          )}
        </div>
      </Cartao>
    </Cena>
  );
};

const LINHAS = [
  { rotulo: "Tempo de permanência", valor: "18 min" },
  { rotulo: "Frequência de visita", valor: "3ª vez" },
  { rotulo: "Preferências de navegação", valor: "vídeo, notícias" },
];

/** Passo 03: o que cada conexão registra. */
export const Captura: React.FC = () => {
  const frame = useCurrentFrame();
  const conexoes = Math.round(interpolate(frame, [8, 60], [0, 1284], ease));

  return (
    <Cena>
      <Cartao opacity={entra(frame, 0)} shift={interpolate(entra(frame, 0), [0, 1], [22, 0])}>
        <Titulo>A cada conexão</Titulo>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 92, color: wispot.cyan, lineHeight: 1 }}>
            {conexoes.toLocaleString("pt-BR")}
          </div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: wispot.muted }}>
            conexões hoje
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {LINHAS.map((l, i) => {
            const e = entra(frame, 18 + i * 12);
            return (
              <div
                key={l.rotulo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(0,24,36,0.5)",
                  borderRadius: 18,
                  padding: "22px 26px",
                  opacity: e,
                  transform: `translateX(${interpolate(e, [0, 1], [-26, 0])}px)`,
                }}
              >
                <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: wispot.white }}>
                  {l.rotulo}
                </div>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: wispot.cyan }}>
                  {l.valor}
                </div>
              </div>
            );
          })}
        </div>
      </Cartao>
    </Cena>
  );
};

/** Passo 04: a campanha que sai para quem está conectado. */
export const Engajamento: React.FC = () => {
  const frame = useCurrentFrame();
  const e1 = entra(frame, 4);
  const e2 = entra(frame, 22);
  const e3 = entra(frame, 44);

  return (
    <Cena>
      <Cartao opacity={entra(frame, 0)} shift={interpolate(entra(frame, 0), [0, 1], [22, 0])}>
        <Titulo>Engajamento</Titulo>

        <div style={{ display: "flex", gap: 14, opacity: e1 }}>
          {["Clientes recorrentes", "Conectados hoje"].map((t) => (
            <div
              key={t}
              style={{
                background: "rgba(0,170,227,0.18)",
                border: "1.5px solid rgba(0,170,227,0.6)",
                borderRadius: 999,
                padding: "12px 24px",
                fontFamily,
                fontWeight: 600,
                fontSize: 26,
                color: wispot.white,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div
          style={{
            background: wispot.white,
            borderRadius: 24,
            padding: "30px 30px",
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            opacity: e2,
            transform: `translateY(${interpolate(e2, [0, 1], [26, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 16,
              background: wispot.cyan,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5.5h18v13H7.5L3 22z" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: wispot.navy }}>
              Que bom te ver de novo
            </div>
            <div style={{ fontFamily, fontWeight: 500, fontSize: 27, color: "rgba(0,41,59,0.72)", marginTop: 6 }}>
              Sua próxima visita tem uma condição especial.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: e3 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={wispot.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4,12.5 9.5,18 20,6.5" />
          </svg>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 30, color: wispot.white }}>
            Enviada para o segmento
          </div>
        </div>
      </Cartao>
    </Cena>
  );
};
