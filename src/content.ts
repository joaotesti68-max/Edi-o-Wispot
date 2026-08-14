export const FPS = 24;

export type IconKey = "alert" | "server" | "shield" | "trending" | "chat";

export type Cutaway = {
  video: string;
  startFrame: number;
  durationInFrames: number;
};

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  headline: string;
  icon: IconKey;
  chips?: string[];
  cutaway?: Cutaway;
};

export const INTRO_FRAMES = 24;
export const OUTRO_FRAMES = 72;
export const TRANSITION_FRAMES = 8;

export const blocks: Block[] = [
  {
    id: "abertura",
    video: "videos/abertura.mp4",
    durationInFrames: 129,
    headline: "Já perdeu tempo ou dinheiro com um problema de TI?",
    icon: "alert",
  },
  {
    id: "desenvolvimento-1",
    video: "videos/desenvolvimento-1.mp4",
    durationInFrames: 175,
    headline: "Infraestrutura cuidada de ponta a ponta",
    icon: "server",
    chips: ["Servidores", "Rede", "Backup", "Atualizações"],
  },
  {
    id: "desenvolvimento-2",
    video: "videos/desenvolvimento-2.mp4",
    durationInFrames: 244,
    headline: "Corrigimos falhas antes que virem problema",
    icon: "shield",
    cutaway: {
      video: "videos/cutaway-5670.mp4",
      startFrame: 90,
      durationInFrames: 60,
    },
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
const sequenceDurations = [INTRO_FRAMES, ...blocks.map((b) => b.durationInFrames), OUTRO_FRAMES];
const transitionCount = sequenceDurations.length - 1;

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
}

export const introRange = { start: starts[0], end: starts[0] + INTRO_FRAMES };
export const blockRanges = blocks.map((b, i) => ({
  start: starts[i + 1],
  end: starts[i + 1] + b.durationInFrames,
}));
export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * transitionCount;
