import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";

const ease = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const BARRAS = [0.38, 0.52, 0.44, 0.71, 0.63, 0.86, 0.78];
const NUMEROS = [
  { valor: "3.412", rotulo: "conexões" },
  { valor: "18min", rotulo: "permanência" },
  { valor: "41%", rotulo: "recorrência" },
];

/**
 * Cobertura do passo 05. Não há captura de tela de relatório da Wispot no
 * material da marca, então o painel é desenhado aqui, na paleta oficial.
 */
export const ReportCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: wispot.ink }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(0,170,227,0.22) 0%, rgba(0,24,36,0) 60%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <div
          style={{
            width: "100%",
            background: "rgba(0,63,91,0.55)",
            border: `2px solid rgba(0,170,227,0.45)`,
            borderRadius: 34,
            padding: "54px 52px",
            display: "flex",
            flexDirection: "column",
            gap: 42,
            opacity: interpolate(frame, [0, 10], [0, 1], ease),
            transform: `translateY(${interpolate(frame, [0, 12], [22, 0], ease)}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 46, color: wispot.white }}>
              Relatórios
            </div>
            <Img src={staticFile(wispot.logo.white)} style={{ width: 150, opacity: 0.9 }} />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 300 }}>
            {BARRAS.map((altura, i) => {
              const sobe = interpolate(frame, [6 + i * 3, 22 + i * 3], [0, 1], ease);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${altura * 100 * sobe}%`,
                    borderRadius: 10,
                    background: i === BARRAS.length - 1 ? wispot.cyan : "rgba(0,170,227,0.5)",
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            {NUMEROS.map((n, i) => (
              <div
                key={n.rotulo}
                style={{
                  flex: 1,
                  opacity: interpolate(frame, [18 + i * 5, 32 + i * 5], [0, 1], ease),
                }}
              >
                <div style={{ fontFamily, fontWeight: 800, fontSize: 52, color: wispot.cyan }}>
                  {n.valor}
                </div>
                <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: wispot.muted }}>
                  {n.rotulo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
