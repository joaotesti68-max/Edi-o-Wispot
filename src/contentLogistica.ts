import { CLIP_TRANSITION_FRAMES, buildTimeline, clipStarts, type Block, type Clip } from "./types";

export const FPS = 30;
export const OUTRO_FRAMES = 90;
/** Between blocks — a directional slide, long enough to read as a beat. */
export const TRANSITION_FRAMES = 12;

const clip = (name: string, seconds: number): Clip => ({
  src: `videos/logistica/${name}.mp4`,
  durationInFrames: Math.floor(seconds * FPS),
});

const block = (b: Omit<Block, "durationInFrames">): Block => {
  const clips = b.clips ?? [];
  return {
    ...b,
    durationInFrames:
      clips.reduce((sum, c) => sum + c.durationInFrames, 0) -
      CLIP_TRANSITION_FRAMES * Math.max(0, clips.length - 1),
  };
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

export const blocks: Block[] = [
  block({
    id: "abertura",
    // "Na logística, não é preciso um caminhão parar para a operação inteira ficar comprometida."
    clips: [clip("01_abertura", 4.661)],
    headline: "Não é só o caminhão que para a operação",
    icon: "truck",
    nameCard: "João",
  }),
  block({
    id: "desenvolvimento-1",
    clips: d1Clips,
    headline: "Sistema fora do ar afeta estoque, entregas e clientes",
    icon: "alert",
    overlays: [{ kind: "attack", at: d1[1] + 26, durationInFrames: 54 }],
    // each tile lands on the word he is saying
    tiles: [
      { label: "Estoque", icon: "box", at: d1[2] + 32 },
      { label: "Entregas", icon: "truck", at: d1[3] + 8 },
      { label: "Clientes", icon: "people", at: d1[3] + 26 },
    ],
  }),
  block({
    id: "desenvolvimento-2",
    clips: d2Clips,
    headline: "Infraestrutura e segurança precisam caminhar juntas",
    icon: "shield",
    tiles: [
      { label: "Cibersegurança", icon: "shield", at: d2[1] + 72 },
      { label: "Monitoramento 24h", icon: "radar", at: d2[2] + 6 },
      { label: "Backup", icon: "restore", at: d2[2] + 54 },
      { label: "Data center", icon: "server", at: d2[3] + 6 },
      { label: "Infra de TI", icon: "network", at: d2[3] + 42 },
    ],
  }),
  block({
    id: "desenvolvimento-3",
    clips: d3Clips,
    headline: "Proteger, identificar e recuperar",
    icon: "radar",
    tiles: [
      { label: "Proteger os dados", icon: "lock", at: d3[0] + 34 },
      { label: "Detectar ameaças", icon: "radar", at: d3[1] + 30 },
      { label: "Recuperar a operação", icon: "restore", at: d3[2] + 50 },
    ],
  }),
  block({
    id: "fechamento",
    // "Na logística, tecnologia parada também significa operação parada.
    //  Fale conosco e proteja a estrutura que mantém o seu negócio funcionando."
    clips: [clip("13_f1", 3.4), clip("14_f2", 4.193)],
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
