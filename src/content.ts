export const FPS = 30;

export type IconKey = "alert" | "server" | "shield" | "trending" | "chat" | "pulse" | "clock";

/** A graphic card that illustrates what is being said, floating over the top of the frame. */
export type Card = {
  from: number;
  durationInFrames: number;
  icon: IconKey;
  title: string;
  /** Optional checklist items, revealed one by one. */
  items?: { label: string; from: number }[];
};

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  /** Key into `captions` in captions.ts. */
  captionKey: string;
  cards: Card[];
  presenter?: { name: string; role: string };
};

export const OUTRO_FRAMES = 96;
export const TRANSITION_FRAMES = 8;

export const blocks: Block[] = [
  {
    id: "abertura",
    video: "videos/01-abertura.mp4",
    durationInFrames: 124,
    captionKey: "abertura",
    presenter: { name: "Vinicius Miranda", role: "Gestão de TI · ProAdvanced" },
    cards: [],
  },
  {
    id: "gestao",
    video: "videos/02-gestao.mp4",
    durationInFrames: 432,
    captionKey: "gestao",
    cards: [
      { from: 150, durationInFrames: 110, icon: "trending", title: "Monitoria contínua" },
      { from: 270, durationInFrames: 100, icon: "shield", title: "Agir antes do problema" },
    ],
  },
  {
    id: "monitoramento",
    video: "videos/03-monitoramento.mp4",
    durationInFrames: 615,
    captionKey: "monitoramento",
    cards: [
      { from: 40, durationInFrames: 105, icon: "pulse", title: "Monitoramento em tempo real" },
      {
        from: 148,
        durationInFrames: 142,
        icon: "server",
        title: "Rotina preventiva",
        items: [
          { label: "Manutenções", from: 4 },
          { label: "Atualizações", from: 36 },
          { label: "Correções", from: 65 },
        ],
      },
      { from: 470, durationInFrames: 100, icon: "trending", title: "Equipe focada no negócio" },
    ],
  },
  {
    id: "fechamento",
    video: "videos/04-fechamento.mp4",
    durationInFrames: 399,
    captionKey: "fechamento",
    cards: [],
  },
];

// Mirrors how @remotion/transitions/TransitionSeries lays out overlapping
// sequences, so the progress bar can know each block's on-screen frame range
// without duplicating the transition math.
const sequenceDurations = [...blocks.map((b) => b.durationInFrames), OUTRO_FRAMES];
const transitionCount = sequenceDurations.length - 1;

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
}

export const blockRanges = blocks.map((b, i) => ({
  start: starts[i],
  end: starts[i] + b.durationInFrames,
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * transitionCount;
