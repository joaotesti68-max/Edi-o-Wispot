import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PanelFrame, useCue, type PanelProps } from "../PanelFrame";
import { DocumentSheet, Stamp } from "../Marks";
import { DocCheckIcon } from "../Icons";

// O documento vai sendo lavrado enquanto ele fala, e fecha em "…registros".
const LINES_FROM = 6;
const LINES_TO = 90;
const CHIP_REGISTROS_AT = 89; // "…todos os registros"
const CHIP_EVIDENCIAS_AT = 105; // "…e evidências"
const STAMP_AT = 215; // "…está dentro dos parâmetros exigidos"

const Chip: React.FC<{ atFrame: number; label: string }> = ({ atFrame, label }) => {
  const cue = useCue(atFrame, 18);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 30px",
        borderRadius: 999,
        background: "rgba(54,150,205,0.20)",
        border: `1.5px solid ${theme.color.primaryLight}`,
        color: theme.color.white,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: -0.2,
        ...cue.style,
      }}
    >
      <DocCheckIcon size={32} color={theme.color.primaryLight} strokeWidth={2} />
      {label}
    </div>
  );
};

export const DocumentacaoPanel: React.FC<PanelProps> = ({ frames, fadeOut }) => {
  const frame = useCurrentFrame();

  // O documento é "lavrado" linha a linha antes de receber o carimbo.
  const lineProgress = interpolate(frame, [LINES_FROM, LINES_TO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <PanelFrame frames={frames} fadeOut={fadeOut} eyebrow="Etapa 03" title="Documentação" watermark="03">
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <DocumentSheet
            width={520}
            height={690}
            lines={10}
            lineProgress={lineProgress}
            rotate={-1.5}
          />
          <div style={{ position: "absolute", left: "50%", top: 430, transform: "translateX(-50%)" }}>
            <Stamp
              atFrame={STAMP_AT}
              label="CONFORME"
              color={theme.color.primary}
              rotate={-7}
              fontSize={42}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1245,
          left: theme.gutter,
          right: theme.gutter,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Chip atFrame={CHIP_REGISTROS_AT} label="Registros" />
        <Chip atFrame={CHIP_EVIDENCIAS_AT} label="Evidências" />
      </div>

    </PanelFrame>
  );
};
