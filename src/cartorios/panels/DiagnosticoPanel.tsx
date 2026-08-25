import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PanelFrame, useCue } from "../PanelFrame";
import { ScanIcon } from "../Icons";

const B_ROLL = "videos/cartorios/b-roll-diagnostico.mp4";

const SCAN_FROM = 12; // ~0,4 s de painel
const SCAN_TO = 96; // ~3,2 s
const LABEL_MAP_AT = 27; // "…onde estão os dados sensíveis"
const LABEL_RISK_AT = 120; // "…qual é a exposição atual do risco"

const CARD_TOP = 470;
const CARD_WIDTH = 928;
const CARD_HEIGHT = 690;

export const DiagnosticoPanel: React.FC<{ frames: number }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const mapLabel = useCue(LABEL_MAP_AT);
  const riskLabel = useCue(LABEL_RISK_AT);

  // A varredura desce a imagem uma vez, no gesto de quem está examinando.
  const scan = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanVisible = interpolate(
    frame,
    [SCAN_FROM, SCAN_FROM + 6, SCAN_TO - 10, SCAN_TO],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const cardReveal = useCue(4, 26);

  return (
    <PanelFrame
      frames={frames}
      eyebrow="Etapa 01"
      title="Diagnóstico"
      watermark="01"
      backdrop={
        // A mesma imagem preenche o fundo, desfocada e escura: dá cor e
        // movimento ao painel sem disputar leitura com o texto.
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(B_ROLL)}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(26px) brightness(0.42) saturate(0.9)",
              transform: "scale(1.12)",
            }}
          />
          <AbsoluteFill style={{ background: "rgba(11,27,38,0.58)" }} />
        </AbsoluteFill>
      }
    >
      <div
        style={{
          position: "absolute",
          top: CARD_TOP,
          left: (1080 - CARD_WIDTH) / 2,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 22,
          overflow: "hidden",
          border: `1.5px solid ${theme.color.lineStrong}`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
          ...cardReveal.style,
        }}
      >
        <OffthreadVideo
          src={staticFile(B_ROLL)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Linha de varredura, contida na imagem. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scan * CARD_HEIGHT,
            height: 3,
            background: theme.color.primaryLight,
            boxShadow: "0 0 34px 6px rgba(32,163,214,0.55)",
            opacity: scanVisible,
          }}
        />
        {/* Rastro logo acima da linha, para a varredura ter direção. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: scan * CARD_HEIGHT,
            background:
              "linear-gradient(to bottom, rgba(32,163,214,0) 72%, rgba(32,163,214,0.20) 100%)",
            opacity: scanVisible,
          }}
        />
      </div>

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
