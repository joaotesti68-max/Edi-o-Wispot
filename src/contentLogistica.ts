import {
  buildTimeline,
  clipStarts,
  transitionBefore,
  type Block,
  type Clip,
  type SystemNode,
} from "./types";

export const FPS = 30;
export const OUTRO_FRAMES = 90;
/** Between blocks — a directional slide, long enough to read as a beat. */
export const TRANSITION_FRAMES = 12;

const clip = (name: string, seconds: number, soft = false): Clip => ({
  src: `videos/logistica/${name}.mp4`,
  durationInFrames: Math.floor(seconds * FPS),
  soft,
});

const block = (b: Omit<Block, "durationInFrames">): Block => {
  const clips = b.clips ?? [];
  const durationInFrames =
    clips.reduce((sum, c) => sum + c.durationInFrames, 0) -
    clips.slice(1).reduce((sum, c) => sum + transitionBefore(c), 0);

  // An overlay running past its block gets clipped mid-animation and never
  // plays its exit, so hold it to what is left of the block.
  const overlays = b.overlays?.map((o) => ({
    ...o,
    durationInFrames: Math.min(o.durationInFrames, durationInFrames - o.at),
  }));

  return { ...b, overlays, durationInFrames };
};

/**
 * Roteiro "Logística" (04/09, 14h), montado na ordem do roteiro.
 *
 * Cada fragmento foi conferido por transcrição: só a fala correta do João,
 * sem as tentativas erradas nem a conversa de bastidor. Os tiles e a
 * animação entram por cima da footage, sem interromper o corte.
 */

// "Um sistema de gestão indisponível, o rastreamento fora do ar, [ou um ataque
//  bloqueando o acesso aos dados,] podem afetar o estoque, entregas, clientes
//  e toda a operação."  O trecho entre colchetes não foi gravado e é a
//  animação AttackOverlay que o carrega, na emenda entre as duas falas.
const d1Clips = [
  clip("02_d1a", 1.952),
  clip("03_d1b", 1.63),
  clip("04_d1c", 1.515),
  clip("05_d1d", 2.52),
];
const d1 = clipStarts(d1Clips);

// "É por isso que infraestrutura e segurança precisam caminhar juntos. Na Pro
//  Advanced, nós atuamos com cibersegurança, monitoramento 24 horas, backup,
//  data center e infraestrutura de TI."
const d2Clips = [
  clip("06_d2a", 4.266),
  clip("07_d2b", 3.333),
  clip("08_d2c", 2.466),
  clip("09_d2d", 2.708),
];
const d2 = clipStarts(d2Clips);

// "Na prática, isso significa proteger os dados, identificar ameaças e falhas
//  com mais rapidez e ter uma estrutura preparada para recuperar a operação."
const d3Clips = [clip("10_d3a", 2.74), clip("11_d3b", 2.833), clip("12_d3c", 4.034)];
const d3 = clipStarts(d3Clips);

/**
 * Node positions flank his face rather than sitting on it, so a full-screen
 * moment still reads as him talking with the system drawn around him.
 */
const TRIO: [number, number][] = [
  [0.26, 0.36],
  [0.74, 0.44],
  [0.44, 0.66],
];
const FIVE: [number, number][] = [
  [0.26, 0.33],
  [0.74, 0.33],
  [0.24, 0.53],
  [0.72, 0.53],
  [0.48, 0.71],
];

const place = (
  spots: [number, number][],
  items: { label: string; icon: SystemNode["icon"]; at: number }[],
): SystemNode[] => items.map((it, i) => ({ ...it, x: spots[i][0], y: spots[i][1] }));

export const blocks: Block[] = [
  block({
    id: "abertura",
    // "Na logística, não é preciso um caminhão parar para a operação inteira ficar comprometida."
    clips: [clip("01_abertura", 4.661)],
    // no headline: the route animation carries the opening on its own
    icon: "truck",
    nameCard: "João Dourado",
    overlays: [{ kind: "route", at: 10, durationInFrames: 129 }],
  }),
  block({
    id: "desenvolvimento-1",
    clips: d1Clips,
    headline: "Sistema fora do ar afeta estoque, entregas e clientes",
    icon: "alert",
    overlays: [
      { kind: "attack", at: d1[1] + 24, durationInFrames: 54 },
      {
        kind: "system",
        at: d1[2] + 32,
        durationInFrames: 82,
        // `at` counts from the start of the overlay, landing on the word
        nodes: place(TRIO, [
          { label: "Estoque", icon: "box", at: 4 },
          { label: "Entregas", icon: "truck", at: 22 },
          { label: "Clientes", icon: "people", at: 40 },
        ]),
      },
    ],
  }),
  block({
    id: "desenvolvimento-2",
    clips: d2Clips,
    headline: "Infraestrutura e segurança precisam caminhar juntas",
    icon: "shield",
    overlays: [
      {
        kind: "system",
        at: d2[1] + 56,
        durationInFrames: 315,
        nodes: place(FIVE, [
          { label: "Cibersegurança", icon: "shield", at: 16 },
          { label: "Monitoramento 24h", icon: "radar", at: 46 },
          { label: "Backup", icon: "restore", at: 94 },
          { label: "Data center", icon: "server", at: 117 },
          { label: "Infra de TI", icon: "network", at: 153 },
        ]),
      },
    ],
  }),
  block({
    id: "desenvolvimento-3",
    clips: d3Clips,
    headline: "Proteger, identificar e recuperar",
    icon: "radar",
    overlays: [
      {
        kind: "system",
        at: d3[0] + 20,
        durationInFrames: 255,
        nodes: place(TRIO, [
          { label: "Proteger os dados", icon: "lock", at: 14 },
          { label: "Detectar ameaças", icon: "radar", at: 88 },
          { label: "Recuperar a operação", icon: "restore", at: 188 },
        ]),
      },
    ],
  }),
  block({
    id: "fechamento",
    // "Na logística, tecnologia parada também significa operação parada.
    //  Fale conosco e proteja a estrutura que mantém o seu negócio funcionando."
    // the splice lands right on "parada", and the source has no air after it
    clips: [clip("13_f1", 4.205), clip("14_f2", 4.5, true)],
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
