import { buildTimeline, type Block } from "./types";

export const FPS = 30;
export const OUTRO_FRAMES = 90;
export const TRANSITION_FRAMES = 10;

const f = (seconds: number) => Math.round(seconds * FPS);

/**
 * Roteiro "Logística" (04/09, 14h) — cada bloco corresponde a uma fala do
 * roteiro. Um bloco pode reunir mais de um clipe: nesse caso os clipes entram
 * como cortes secos sob a mesma headline.
 */
export const blocks: Block[] = [
  {
    id: "abertura",
    clips: [{ src: "videos/logistica/img_8191.mp4", durationInFrames: f(6.8) }],
    durationInFrames: f(6.8),
    headline: "Não é só o caminhão que para a operação",
    icon: "truck",
    nameCard: "João",
  },
  {
    id: "desenvolvimento-1",
    clips: [{ src: "videos/logistica/img_8213.mp4", durationInFrames: f(11.8) }],
    durationInFrames: f(11.8),
    headline: "Sistema fora do ar afeta estoque, entregas e clientes",
    icon: "alert",
  },
  {
    id: "desenvolvimento-2",
    clips: [{ src: "videos/logistica/img_8215.mp4", durationInFrames: f(17.98) }],
    durationInFrames: f(17.98),
    headline: "Infraestrutura e segurança precisam funcionar juntas",
    icon: "shield",
  },
  {
    id: "desenvolvimento-3",
    clips: [
      { src: "videos/logistica/img_8214.mp4", durationInFrames: f(6.0) },
      { src: "videos/logistica/img_8216.mp4", durationInFrames: f(5.37) },
    ],
    durationInFrames: f(6.0) + f(5.37),
    headline: "Proteger dados, detectar ameaças, recuperar a operação",
    icon: "radar",
  },
  {
    id: "fechamento",
    clips: [
      { src: "videos/logistica/img_8204.mp4", durationInFrames: f(5.04) },
      { src: "videos/logistica/img_8205.mp4", durationInFrames: f(4.65) },
    ],
    durationInFrames: f(5.04) + f(4.65),
    headline: "Tecnologia parada também é operação parada",
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
