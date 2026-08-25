import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

/**
 * Folha de documento com linhas de texto simuladas. `lineProgress` vai de 0 a 1
 * e faz as linhas aparecerem de cima para baixo, como um documento sendo
 * lavrado.
 */
export const DocumentSheet: React.FC<{
  width: number;
  height: number;
  lines?: number;
  lineProgress?: number;
  rotate?: number;
  children?: React.ReactNode;
}> = ({ width, height, lines = 9, lineProgress = 1, rotate = 0, children }) => {
  const padding = width * 0.11;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 8,
        background: "#f4f6f7",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.42)",
        padding,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: height * 0.038,
      }}
    >
      {/* Cabeçalho do documento: um bloco curto e uma régua, como um timbre. */}
      <div style={{ width: width * 0.42, height: 16, borderRadius: 3, background: "#c3ccd2" }} />
      <div style={{ height: 2, background: "#dde3e7", marginBottom: height * 0.02 }} />

      {Array.from({ length: lines }).map((_, i) => {
        // Cada linha entra na sua vez, e a última é curta como fim de parágrafo.
        const share = 1 / lines;
        const local = interpolate(lineProgress, [i * share, (i + 1) * share], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const full = i === lines - 1 ? 0.52 : i % 3 === 2 ? 0.78 : 1;
        return (
          <div
            key={i}
            style={{
              width: `${full * 100 * local}%`,
              height: 12,
              borderRadius: 3,
              background: i % 4 === 0 ? "#aab6bd" : "#ccd5da",
            }}
          />
        );
      })}

      {children}
    </div>
  );
};

/**
 * Carimbo. Cai sobre o documento com impacto em `atFrame` e fica assentado,
 * com o leve desalinho de um carimbo de verdade.
 */
export const Stamp: React.FC<{
  atFrame: number;
  label: string;
  color: string;
  rotate?: number;
  fontSize?: number;
}> = ({ atFrame, label, color, rotate = -8, fontSize = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // `durationInFrames` fecha a mola num ponto exato. Sem ele, ela fica um bom
  // tempo variando na sétima casa decimal, e o `transform` do carimbo muda a
  // cada quadro — o suficiente para o Chromium reescrever o texto do painel
  // inteiro com frações de pixel diferentes, o que se vê como tremor.
  const impact = spring({
    frame: frame - atFrame,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
    durationInFrames: 24,
  });
  const scale = interpolate(impact, [0, 1], [2.5, 1]);
  const settled = Math.abs(scale - 1) < 0.001;
  const opacity = interpolate(frame - atFrame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        // Assentado, fica só a inclinação: um transform a menos mudando por quadro.
        transform: settled ? `rotate(${rotate}deg)` : `rotate(${rotate}deg) scale(${scale})`,
        display: "inline-block",
        border: `6px solid ${color}`,
        borderRadius: 10,
        padding: `${fontSize * 0.34}px ${fontSize * 0.62}px`,
        fontFamily: theme.font,
        fontWeight: 800,
        fontSize,
        letterSpacing: fontSize * 0.09,
        color,
        whiteSpace: "nowrap",
        // Filete interno: dá o contorno duplo típico de carimbo.
        boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.6)`,
      }}
    >
      {label}
    </div>
  );
};
