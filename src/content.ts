export const FPS = 24;

export type IconKey = "alert" | "server" | "shield" | "trending" | "chat";

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  headline: string;
  icon: IconKey;
  nameCard?: string;
};

export const OUTRO_FRAMES = 72;
export const TRANSITION_FRAMES = 8;

export const blocks: Block[] = [
  {
    id: "abertura",
    video: "videos/abertura.mp4",
    durationInFrames: 129,
    headline: "Já perdeu tempo ou dinheiro com um problema de TI?",
    icon: "alert",
    nameCard: "Isabella Marques",
  },
  {
    id: "desenvolvimento-1",
    video: "videos/desenvolvimento-1.mp4",
    durationInFrames: 175,
    headline: "Infraestrutura cuidada de ponta a ponta",
    icon: "server",
  },
  {
    id: "desenvolvimento-1b",
    video: "videos/desenvolvimento-1b.mp4",
    durationInFrames: 305,
    // PLACEHOLDER: waiting on the actual line said in this clip.
    headline: "(roteiro deste trecho pendente de confirmação)",
    icon: "server",
  },
  {
    id: "desenvolvimento-2",
    video: "videos/desenvolvimento-2.mp4",
    durationInFrames: 244,
    headline: "Corrigimos falhas antes que se tornem problemas",
    icon: "shield",
  },
  {
    id: "desenvolvimento-3",
    video: "videos/desenvolvimento-3.mp4",
    durationInFrames: 174,
    headline: "Sua equipe volta a focar no que importa",
    icon: "trending",
  },
  {
    id: "fechamento",
    video: "videos/fechamento.mp4",
    durationInFrames: 154,
    headline: "Menos dor de cabeça de TI. Mais tempo pra crescer.",
    icon: "chat",
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
