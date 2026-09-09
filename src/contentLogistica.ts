import { buildTimeline, type Block } from "./types";

export const FPS = 30;
export const OUTRO_FRAMES = 90;
export const TRANSITION_FRAMES = 10;

const clip = (name: string, seconds: number) => ({
  src: `videos/logistica/${name}.mp4`,
  durationInFrames: Math.floor(seconds * FPS),
});

const block = (b: Omit<Block, "durationInFrames">): Block => ({
  ...b,
  durationInFrames: (b.clips ?? []).reduce((sum, c) => sum + c.durationInFrames, 0),
});

/**
 * Roteiro "Logística" (04/09, 14h). Os 13 clipes entram inteiros — o 8213 vem
 * em duas partes porque há uma voz fora do microfone de lapela no meio dele.
 * Cada clipe já foi cortado no material bruto para conter apenas a fala do
 * João no lapela; os cortes secos dentro de um bloco são intencionais.
 */
export const blocks: Block[] = [
  block({
    id: "abertura",
    clips: [clip("img_8191", 7.0), clip("img_8193", 2.7)],
    headline: "Não é só o caminhão que para a operação",
    icon: "truck",
    nameCard: "João",
  }),
  block({
    id: "desenvolvimento-1",
    clips: [
      clip("img_8194", 2.266),
      clip("img_8199", 2.233),
      clip("img_8201", 3.533),
      clip("img_8204", 5.133),
      clip("img_8205", 4.1),
    ],
    headline: "Sistema fora do ar afeta estoque, entregas e clientes",
    icon: "alert",
  }),
  block({
    id: "desenvolvimento-2",
    clips: [
      clip("img_8206", 3.266),
      clip("img_8207", 3.5),
      clip("img_8213a", 2.0),
      clip("img_8213b", 3.066),
      clip("img_8214", 5.433),
    ],
    headline: "Infraestrutura e segurança precisam funcionar juntas",
    icon: "shield",
  }),
  block({
    id: "desenvolvimento-3",
    clips: [clip("img_8215", 15.633)],
    headline: "Proteger dados, detectar ameaças, recuperar a operação",
    icon: "radar",
  }),
  block({
    id: "fechamento",
    clips: [clip("img_8216", 4.7)],
    headline: "Tecnologia parada também é operação parada",
    icon: "chat",
  }),
];

const timeline = buildTimeline(
  blocks.map((b) => b.durationInFrames),
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
);

export const blockRanges = timeline.blockRanges;
export const outroRange = timeline.outroRange;
export const totalDurationInFrames = timeline.totalDurationInFrames;
