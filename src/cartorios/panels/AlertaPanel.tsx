import { theme } from "../theme";
import { PanelFrame, useCue } from "../PanelFrame";
import { DocumentSheet, Stamp } from "../Marks";
import { GavelIcon } from "../Icons";

/** Entra sobre "…e pode multar cartórios que não estejam adequados". */
const STAMP_AT = 21;
const NOTE_AT = 44;

export const AlertaPanel: React.FC<{ frames: number }> = ({ frames }) => {
  const note = useCue(NOTE_AT);

  return (
    <PanelFrame
      frames={frames}
      eyebrow="Nova lei em vigor"
      title={
        <>
          Sem adequação,
          <br />
          risco de multa
        </>
      }
    >
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <DocumentSheet width={560} height={720} lines={9} rotate={-2.5} />

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 470,
              transform: "translateX(-50%)",
            }}
          >
            <Stamp atFrame={STAMP_AT} label="PENDENTE" color={theme.color.gray} rotate={-9} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: theme.gutter,
          right: theme.gutter,
          bottom: 250,
          display: "flex",
          alignItems: "center",
          gap: 26,
          ...note.style,
        }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            flexShrink: 0,
            borderRadius: 18,
            background: "rgba(54,150,205,0.24)",
            border: `1.5px solid ${theme.color.primaryLight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GavelIcon size={40} color={theme.color.white} strokeWidth={1.9} />
        </div>
        <div style={{ ...theme.type.body, color: theme.color.muted }}>
          Segurança digital passa a ser exigência formal para cartórios.
        </div>
      </div>
    </PanelFrame>
  );
};
