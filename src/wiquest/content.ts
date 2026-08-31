export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const sec = (s: number) => Math.round(s * FPS);

/**
 * Cada take bruto foi analisado por envelope de RMS (janela de 30ms) para achar
 * os trechos de fala. `src` são os pontos de corte no arquivo original, em
 * segundos, já com 0,10s de folga na entrada e 0,22s na saída — o que sai fora
 * disso é silêncio/respiração e não entra na edição.
 *
 * Ordem dos blocos = ordem do roteiro. O mapeamento take -> parágrafo foi
 * deduzido da duração e do desenho das pausas de cada take (ver README-wiquest).
 */
export type Shot = { src: [number, number] };

export type Block = {
  id: string;
  video: string;
  /**
   * Ganho de nivelamento. Os quatro takes chegaram com 3,4 dB de diferença de
   * volume de fala entre si; esses fatores igualam todos em RMS -23,5 dB, com
   * o pico real de cada um ainda abaixo de -1,7 dBFS.
   */
  gain: number;
  shots: Shot[];
};

export const blocks: Block[] = [
  {
    // "O WiQuest é a ferramenta de pesquisas inteligentes da Wispot. Ela coloca
    //  a pergunta dentro do próprio acesso ao Wi-Fi, no momento em que o
    //  cliente ainda está no seu estabelecimento."
    id: "desenvolvimento-1",
    video: "wiquest/videos/img7922.mp4",
    gain: 1.27,
    shots: [{ src: [1.45, 6.33] }, { src: [6.61, 14.26] }],
  },
  {
    // "Ele responde em segundos, sem baixar aplicativo e sem sair do lugar.
    //  A resposta chega com a experiência ainda fresca, e não três dias depois
    //  por e-mail."
    id: "desenvolvimento-2",
    video: "wiquest/videos/img7918.mp4",
    gain: 0.92,
    shots: [
      { src: [0.28, 2.91] },
      { src: [3.12, 6.33] },
      { src: [6.69, 12.28] },
    ],
  },
  {
    // "Do outro lado, esse feedback entra na plataforma junto com os outros
    //  dados que a rede já captura, como frequência de visita e tempo de
    //  permanência. É assim que a opinião do cliente vira decisão estratégica."
    id: "desenvolvimento-3",
    video: "wiquest/videos/img7929.mp4",
    gain: 1.18,
    shots: [
      { src: [1.95, 9.05] },
      { src: [9.39, 12.1] },
      { src: [12.52, 18.61] },
    ],
  },
  {
    // "WiQuest, da Wispot. Fale com a gente e transforme a opinião do seu
    //  cliente em decisão que gera resultado."
    id: "fechamento",
    video: "wiquest/videos/img7932.mp4",
    gain: 1.36,
    shots: [{ src: [1.26, 8.87] }],
  },
];

export const HOOK_FRAMES = sec(4);
export const END_FRAMES = sec(4.5);

export type PlacedShot = {
  blockIndex: number;
  shotIndex: number;
  video: string;
  gain: number;
  from: number;
  durationInFrames: number;
  trimBefore: number;
  trimAfter: number;
};

export type PlacedBlock = {
  id: string;
  from: number;
  durationInFrames: number;
};

const shots: PlacedShot[] = [];
const placedBlocks: PlacedBlock[] = [];

let cursor = HOOK_FRAMES;
blocks.forEach((block, blockIndex) => {
  const blockStart = cursor;
  block.shots.forEach((shot, shotIndex) => {
    const trimBefore = sec(shot.src[0]);
    const trimAfter = sec(shot.src[1]);
    const durationInFrames = trimAfter - trimBefore;
    shots.push({
      blockIndex,
      shotIndex,
      video: block.video,
      gain: block.gain,
      from: cursor,
      durationInFrames,
      trimBefore,
      trimAfter,
    });
    cursor += durationInFrames;
  });
  placedBlocks.push({
    id: block.id,
    from: blockStart,
    durationInFrames: cursor - blockStart,
  });
});

export const placedShots = shots;
export const blockRanges = placedBlocks;
export const END_START = cursor;
export const TOTAL_FRAMES = cursor + END_FRAMES;

/** Índice global do primeiro frame de cada take (para achar os pontos de corte). */
const shotStart = (blockIndex: number, shotIndex: number) =>
  shots.find((s) => s.blockIndex === blockIndex && s.shotIndex === shotIndex)!
    .from;

/** Textos que entram como lower third sobre a Mari. */
export type Caption = {
  from: number;
  durationInFrames: number;
  kicker?: string;
  title: string;
  accent?: string;
};

export const captions: Caption[] = [
  {
    from: shotStart(0, 0) + 8,
    durationInFrames: sec(4.2),
    kicker: "Ferramenta Wispot",
    title: "WiQuest",
    accent: "pesquisas inteligentes",
  },
  {
    from: shotStart(1, 0) + 6,
    durationInFrames: sec(5.2),
    kicker: "Do lado do cliente",
    title: "Responde em segundos",
    accent: "sem baixar aplicativo",
  },
  {
    from: shotStart(2, 0) + 6,
    durationInFrames: sec(3.2),
    kicker: "Do outro lado",
    title: "Tudo na mesma plataforma",
  },
  {
    from: shotStart(2, 2) + 10,
    durationInFrames: sec(4.6),
    kicker: "É assim que",
    title: "Opinião vira decisão",
    accent: "estratégica",
  },
  {
    from: shotStart(3, 0) + 40,
    durationInFrames: sec(5),
    kicker: "Fale com a gente",
    title: "wispot.com.br",
  },
];

/** Inserts em tela cheia. O áudio do take continua rodando por baixo. */
export type Cutaway = {
  kind: "phone" | "speed" | "dashboard";
  from: number;
  durationInFrames: number;
};

export const cutaways: Cutaway[] = [
  // "Ela coloca a pergunta dentro do próprio acesso ao Wi-Fi..."
  { kind: "phone", from: shotStart(0, 1) + 24, durationInFrames: sec(5) },
  // "...e não três dias depois por e-mail."
  { kind: "speed", from: shotStart(1, 2) + 30, durationInFrames: sec(3.6) },
  // "...junto com os outros dados que a rede já captura, como frequência de
  //  visita e tempo de permanência." — termina exatamente no corte do take.
  {
    kind: "dashboard",
    from: shotStart(2, 0) + 105,
    durationInFrames: shotStart(2, 2) - (shotStart(2, 0) + 105),
  },
];

/** Nome de quem grava, no canto superior esquerdo da abertura do bloco 1. */
export const NAME_CARD = "Mari";
export const NAME_CARD_FROM = shotStart(0, 0) + 10;
export const NAME_CARD_FRAMES = sec(3);
