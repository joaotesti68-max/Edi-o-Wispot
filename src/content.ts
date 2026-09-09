import { buildTimeline, type Block } from "./types";

export const FPS = 24;

export type { Block, IconKey } from "./types";

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
    headline: "Servidores, rede, backup e atualizações — tudo planejado",
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

const timeline = buildTimeline(
  blocks.map((b) => b.durationInFrames),
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
);

export const blockRanges = timeline.blockRanges;
export const outroRange = timeline.outroRange;
export const totalDurationInFrames = timeline.totalDurationInFrames;
