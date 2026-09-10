import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
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

const PRODUTOS = [
  "brand/produtos/wiquest.png",
  "brand/produtos/wimap.png",
  "brand/produtos/sending.png",
  "brand/produtos/myguest.png",
  "brand/produtos/hora-premiada.png",
];

/** Passo 03: a tela real do Analytics, com aproximação lenta para dar leitura. */
export const Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const surge = entra(frame, 0);
  // O painel é largo e a tela é vertical: em vez de encolher tudo para caber,
  // ele entra grande e desliza enquanto os gráficos se desenham.
  const desliza = interpolate(frame, [12, 120], [0, -28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const desce = interpolate(frame, [12, 120], [-2, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Cena>
      <div style={{ width: "100%", opacity: surge, transform: `translateY(${interpolate(surge, [0, 1], [26, 0])}px)` }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 46, color: wispot.white, marginBottom: 26 }}>
          A cada conexão
        </div>

        <div
          style={{
            borderRadius: 26,
            overflow: "hidden",
            border: "2px solid rgba(0,170,227,0.45)",
            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 22px",
              background: wispot.navy,
            }}
          >
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: 999, background: c }} />
            ))}
            <div
              style={{
                marginLeft: 14,
                fontFamily,
                fontWeight: 600,
                fontSize: 22,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Wispot · Analytics
            </div>
          </div>

          <div style={{ overflow: "hidden", height: 800 }}>
            <OffthreadVideo
              src={staticFile("mockups/analytics.mp4")}
              muted
              style={{
                width: "175%",
                // O preflight do Tailwind limita mídia à caixa; sem soltar isso
                // o painel não passa de miniatura ilegível.
                maxWidth: "none",
                display: "block",
                transform: `translate(${desliza}%, ${desce}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </Cena>
  );
};

/** Passo 04: o portfólio subindo, um produto por vez. */
export const Ecossistema: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Cena>
      <div style={{ width: 660, display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 46,
            color: wispot.white,
            marginBottom: 8,
            opacity: entra(frame, 0),
          }}
        >
          Campanhas para quem está conectado
        </div>

        {PRODUTOS.map((src, i) => {
          const inicio = 6 + i * 7;
          const sobe = interpolate(frame, [inicio, inicio + 20], [0, 1], ease);
          // Depois de assentar, segue flutuando de leve para a pilha não travar.
          const flutua = Math.sin((frame - inicio) / 22) * 5 * sobe;
          return (
            <div
              key={src}
              style={{
                background: "#FFFFFF",
                borderRadius: 22,
                padding: "22px 46px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 152,
                opacity: sobe,
                transform: `translateY(${interpolate(sobe, [0, 1], [190, 0]) + flutua}px)`,
                boxShadow: "0 18px 40px rgba(0,12,20,0.35)",
              }}
            >
              <Img src={staticFile(src)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          );
        })}
      </div>
    </Cena>
  );
};
