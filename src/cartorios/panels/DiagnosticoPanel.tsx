import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PanelFrame, useCue } from "../PanelFrame";
import { ScanIcon } from "../Icons";

const COLUMNS = 4;
const ROWS = 4;
const CELL = 196;
const GAP = 22;

const SCAN_FROM = 9; // ~0,3 s de painel
const SCAN_TO = 87; // ~2,9 s
const LABEL_MAP_AT = 27; // "…onde estão os dados sensíveis"
const LABEL_RISK_AT = 120; // "…qual é a exposição atual do risco"

/** Células marcadas como dado sensível e como exposição, na ordem da grade. */
const SENSITIVE = new Set([2, 5, 9, 12, 14]);
const EXPOSED = new Set([7, 13]);

const GRID_TOP = 470;
const GRID_HEIGHT = ROWS * CELL + (ROWS - 1) * GAP;

export const DiagnosticoPanel: React.FC<{ frames: number }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const mapLabel = useCue(LABEL_MAP_AT);
  const riskLabel = useCue(LABEL_RISK_AT);

  // A varredura desce a grade uma vez; as células acendem quando ela passa.
  const scan = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = scan * GRID_HEIGHT;
  const scanVisible = interpolate(frame, [SCAN_FROM, SCAN_FROM + 6, SCAN_TO - 8, SCAN_TO], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridWidth = COLUMNS * CELL + (COLUMNS - 1) * GAP;

  return (
    <PanelFrame frames={frames} eyebrow="Etapa 01" title="Diagnóstico" watermark="01">
      <div
        style={{
          position: "absolute",
          top: GRID_TOP,
          left: (1080 - gridWidth) / 2,
          width: gridWidth,
          height: GRID_HEIGHT,
        }}
      >
        {Array.from({ length: ROWS * COLUMNS }).map((_, i) => {
          const row = Math.floor(i / COLUMNS);
          const cellTop = row * (CELL + GAP);
          // A célula reage quando a linha de varredura cruza a sua faixa.
          const lit = interpolate(scanY, [cellTop, cellTop + CELL * 0.7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const sensitive = SENSITIVE.has(i);
          const exposed = EXPOSED.has(i);

          const background = sensitive
            ? `rgba(54,150,205,${0.16 + 0.52 * lit})`
            : `rgba(255,255,255,${0.03 + 0.035 * lit})`;
          const border = exposed
            ? `2px dashed rgba(255,255,255,${0.25 + 0.62 * lit})`
            : `1.5px solid rgba(255,255,255,${0.09 + 0.16 * lit})`;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (i % COLUMNS) * (CELL + GAP),
                top: cellTop,
                width: CELL,
                height: CELL,
                borderRadius: 14,
                background,
                border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Marca de conteúdo dentro da célula: duas réguas curtas. */}
              <div style={{ width: "52%", display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    height: 8,
                    borderRadius: 2,
                    background: `rgba(255,255,255,${sensitive ? 0.55 : 0.18})`,
                  }}
                />
                <div
                  style={{
                    height: 8,
                    width: "68%",
                    borderRadius: 2,
                    background: `rgba(255,255,255,${sensitive ? 0.35 : 0.12})`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: -18,
            right: -18,
            top: scanY,
            height: 3,
            background: theme.color.primaryLight,
            boxShadow: `0 0 34px 6px rgba(32,163,214,0.55)`,
            opacity: scanVisible,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: theme.gutter,
          right: theme.gutter,
          bottom: 290,
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
          <div
            style={{
              width: 44,
              display: "flex",
              justifyContent: "center",
            }}
          >
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
