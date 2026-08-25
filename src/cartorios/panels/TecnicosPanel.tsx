import { theme } from "../theme";
import { PanelFrame, useCue, type PanelProps } from "../PanelFrame";
import { AccessIcon, BackupIcon, MonitorPulseIcon, UsersIcon } from "../Icons";

/**
 * Cada item entra no instante em que é dito na narração: "controle de acesso,
 * backup, gestão de usuários, monitoramento ativo".
 */
const ITEMS = [
  { at: 29, label: "Controle\nde acesso", Icon: AccessIcon },
  { at: 55, label: "Backup", Icon: BackupIcon },
  { at: 73, label: "Gestão\nde usuários", Icon: UsersIcon },
  { at: 125, label: "Monitoramento\nativo", Icon: MonitorPulseIcon },
];

const CARD_W = 416;
const CARD_H = 360;
const GAP = 26;

const Card: React.FC<{ item: (typeof ITEMS)[number]; index: number }> = ({ item, index }) => {
  // A moldura dos quatro cartões entra junto com o painel, para a grade já
  // existir na tela; o conteúdo de cada um só aparece quando é dito.
  const shell = useCue(2 + index * 3, 14);
  const content = useCue(item.at, 18);
  const { Icon } = item;

  return (
    <div
      style={{
        position: "absolute",
        left: (index % 2) * (CARD_W + GAP),
        top: Math.floor(index / 2) * (CARD_H + GAP),
        width: CARD_W,
        height: CARD_H,
        borderRadius: 22,
        background: `rgba(255,255,255,${0.03 + 0.03 * content.progress})`,
        border: `1.5px solid rgba(255,255,255,${0.09 + 0.08 * content.progress})`,
        padding: 40,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...shell.style,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 18,
          background: "rgba(54,150,205,0.26)",
          border: `1.5px solid ${theme.color.primaryLight}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...content.style,
        }}
      >
        <Icon size={40} color={theme.color.white} strokeWidth={1.9} />
      </div>

      <div
        style={{
          ...theme.type.item,
          color: theme.color.white,
          lineHeight: 1.16,
          whiteSpace: "pre-line",
          ...content.style,
        }}
      >
        {item.label}
      </div>
    </div>
  );
};

export const TecnicosPanel: React.FC<PanelProps> = ({ frames, fadeOut }) => {
  const gridWidth = 2 * CARD_W + GAP;

  return (
    <PanelFrame frames={frames} fadeOut={fadeOut} eyebrow="Etapa 02" title="Ajustes técnicos" watermark="02">
      <div
        style={{
          position: "absolute",
          top: 540,
          left: (1080 - gridWidth) / 2,
          width: gridWidth,
          height: 2 * CARD_H + GAP,
        }}
      >
        {ITEMS.map((item, i) => (
          <Card key={item.label} item={item} index={i} />
        ))}
      </div>

    </PanelFrame>
  );
};
