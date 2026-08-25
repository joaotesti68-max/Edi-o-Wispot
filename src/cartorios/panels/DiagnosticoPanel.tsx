import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PanelFrame, useCue, type PanelProps } from "../PanelFrame";
import { ScanIcon } from "../Icons";

const B_ROLL = "videos/cartorios/b-roll-diagnostico.mp4";

const SCAN_FROM = 12; // ~0,4 s de painel
const SCAN_TO = 108; // ~3,6 s
const LABEL_MAP_AT = 24; // "…onde estão os dados sensíveis"
const LABEL_RISK_AT = 111; // "…qual é a exposição atual do risco"

// A varredura corre a área livre entre o cabeçalho e as etiquetas.
const SCAN_FROM_Y = 340;
const SCAN_TO_Y = 1400;

export const DiagnosticoPanel: React.FC<PanelProps> = ({ frames, fadeOut }) => {
  const frame = useCurrentFrame();
  const mapLabel = useCue(LABEL_MAP_AT);
  const riskLabel = useCue(LABEL_RISK_AT);

  const scan = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = SCAN_FROM_Y + scan * (SCAN_TO_Y - SCAN_FROM_Y);
  const scanVisible = interpolate(
    frame,
    [SCAN_FROM, SCAN_FROM + 8, SCAN_TO - 12, SCAN_TO],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <PanelFrame
      frames={frames}
      fadeOut={fadeOut}
      eyebrow="Etapa 01"
      title="Diagnóstico"
      watermark="01"
      backdrop={
        // A imagem de apoio ocupa a tela inteira. O escurecimento por cima é o
        // que segura a leitura do painel: sem ele, o texto branco disputa com
        // os monitores acesos da imagem.
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(B_ROLL)}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(3px) brightness(0.58) saturate(0.95)",
              transform: "scale(1.04)",
            }}
          />
          <AbsoluteFill style={{ background: "rgba(11,27,38,0.50)" }} />
          {/* Faixas mais escuras onde ficam o cabeçalho e as etiquetas. */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(8,20,29,0.78) 0%, rgba(8,20,29,0) 22%," +
                " rgba(8,20,29,0) 62%, rgba(8,20,29,0.80) 88%)",
            }}
          />
        </AbsoluteFill>
      }
    >
      {/* Linha de varredura, correndo a tela toda. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 3,
          background: theme.color.primaryLight,
          boxShadow: "0 0 40px 8px rgba(32,163,214,0.55)",
          opacity: scanVisible,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SCAN_FROM_Y,
          height: Math.max(0, scanY - SCAN_FROM_Y),
          background:
            "linear-gradient(to bottom, rgba(32,163,214,0) 68%, rgba(32,163,214,0.16) 100%)",
          opacity: scanVisible,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: theme.gutter,
          right: theme.gutter,
          bottom: 440,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22, ...mapLabel.style }}>
          <ScanIcon size={44} color={theme.color.primaryLight} strokeWidth={1.9} />
          <div style={{ ...theme.type.item, color: theme.color.white }}>
            Onde está o dado sensível
          </div>
        </div>

        <div style={{ height: 1, background: theme.color.line }} />

        <div style={{ display: "flex", alignItems: "center", gap: 22, ...riskLabel.style }}>
          <div style={{ width: 44, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `2px dashed ${theme.color.white}`,
              }}
            />
          </div>
          <div style={{ ...theme.type.item, color: theme.color.white }}>
            Qual o nível de exposição
          </div>
        </div>
      </div>
    </PanelFrame>
  );
};
