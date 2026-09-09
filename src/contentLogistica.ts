import { CLIP_TRANSITION_FRAMES, buildTimeline, type Block, type IconKey, type Segment } from "./types";

export const FPS = 30;
export const OUTRO_FRAMES = 90;
/** Between blocks — a directional slide, long enough to read as a beat. */
export const TRANSITION_FRAMES = 12;

const clip = (name: string, seconds: number): Segment => ({
  kind: "clip",
  src: `videos/logistica/${name}.mp4`,
  durationInFrames: Math.floor(seconds * FPS),
});

const card = (line: string, icon: IconKey, seconds: number): Segment => ({
  kind: "card",
  line,
  icon,
  durationInFrames: Math.round(seconds * FPS),
});

/** Start frame of each segment inside its block, accounting for the overlap. */
const startsOf = (segments: Segment[]) => {
  const starts = [0];
  for (let i = 1; i < segments.length; i++) {
    starts.push(starts[i - 1] + segments[i - 1].durationInFrames - CLIP_TRANSITION_FRAMES);
  }
  return starts;
};

const block = (b: Omit<Block, "durationInFrames">): Block => {
  const segments = b.segments ?? [];
  return {
    ...b,
    durationInFrames:
      segments.reduce((sum, s) => sum + s.durationInFrames, 0) -
      CLIP_TRANSITION_FRAMES * Math.max(0, segments.length - 1),
  };
};

/**
 * Roteiro "Logística" (04/09, 14h), montado na ordem do roteiro.
 *
 * Cada fragmento foi conferido por transcrição: só a fala correta do João,
 * sem as tentativas erradas nem a conversa de bastidor. Dois trechos do
 * roteiro não chegaram a ser gravados e entram como card de tela cheia, para
 * a narração não saltar — ver os cards abaixo.
 */

// "Um sistema de gestão indisponível, o rastreamento fora do ar, [ou um ataque
//  bloqueando o acesso aos dados,] podem afetar o estoque, entregas, clientes
//  e toda a operação."
const d1Segments: Segment[] = [
  clip("02_d1a", 1.952),
  clip("03_d1b", 1.72),
  card("ou um ataque bloqueando o acesso aos dados", "shield", 2.2),
  clip("04_d1c", 1.515),
  clip("05_d1d", 2.52),
];
const d1 = startsOf(d1Segments);

// "É por isso que infraestrutura e segurança precisam caminhar juntos. Na Pro
//  Advanced, nós atuamos com cibersegurança, monitoramento 24 horas, backup,
//  data center e infraestrutura de TI."
const d2Segments: Segment[] = [
  clip("06_d2a", 4.266),
  clip("07_d2b", 3.333),
  clip("08_d2c", 2.466),
  clip("09_d2d", 2.708),
];
const d2 = startsOf(d2Segments);

// "[Na prática, isso significa proteger os dados,] identificar ameaças e falhas
//  com mais rapidez e ter uma estrutura preparada para recuperar a operação."
const d3Segments: Segment[] = [
  card("Na prática, isso significa proteger os dados", "shield", 2.2),
  clip("10_d3a", 2.833),
  clip("11_d3b", 4.034),
];
const d3 = startsOf(d3Segments);

export const blocks: Block[] = [
  block({
    id: "abertura",
    // "Na logística, não é preciso um caminhão parar para a operação inteira ficar comprometida."
    segments: [clip("01_abertura", 4.661)],
    headline: "Não é só o caminhão que para a operação",
    icon: "truck",
    nameCard: "João",
  }),
  block({
    id: "desenvolvimento-1",
    segments: d1Segments,
    headline: "Sistema fora do ar afeta estoque, entregas e clientes",
    icon: "alert",
    // each chip lands on the word he is saying
    callouts: [
      { label: "Estoque", at: d1[3] + 30 },
      { label: "Entregas", at: d1[4] + 6 },
      { label: "Clientes", at: d1[4] + 24 },
    ],
  }),
  block({
    id: "desenvolvimento-2",
    segments: d2Segments,
    headline: "Infraestrutura e segurança precisam caminhar juntas",
    icon: "shield",
    callouts: [
      { label: "Cibersegurança", at: d2[1] + 72 },
      { label: "Monitoramento 24h", at: d2[2] + 6 },
      { label: "Backup", at: d2[2] + 54 },
      { label: "Data center", at: d2[3] + 6 },
      { label: "Infraestrutura de TI", at: d2[3] + 42 },
    ],
  }),
  block({
    id: "desenvolvimento-3",
    segments: d3Segments,
    headline: "Identificar mais rápido, recuperar a operação",
    icon: "radar",
    callouts: [
      { label: "Detectar mais rápido", at: d3[1] + 30 },
      { label: "Recuperar a operação", at: d3[2] + 50 },
    ],
  }),
  block({
    id: "fechamento",
    // "Na logística, tecnologia parada também significa operação parada.
    //  Fale conosco e proteja a estrutura que mantém o seu negócio funcionando."
    segments: [clip("12_f1", 3.4), clip("13_f2", 4.193)],
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
