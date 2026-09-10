export const FPS = 24;

/** Trecho de headline: `bold` destaca, `underline` marca com o traço ciano. */
export type Part = { t: string; bold?: boolean; underline?: boolean };

/** Selo curto que entra sobre a imagem, reforçando o que ela acabou de dizer. */
export type Accent = { t: string; at: number };

/** Cobertura que cobre a apresentadora enquanto a fala dela continua. */
export type Broll = {
  at: number;
  durationInFrames: number;
} & (
  | { kind: "video"; src: string }
  | { kind: "instalacao" }
  | { kind: "analytics" }
  | { kind: "ecossistema" }
  | { kind: "relatorio" }
);

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  chip: string;
  headline: Part[];
  activeSteps: number[];
  /** Escala inicial do enquadramento — alterna para os takes não se repetirem. */
  zoom: number;
  /** Frames onde o corte de silêncio emendou o take; o zoom troca ali para disfarçar. */
  cuts: number[];
  accents?: Accent[];
  broll?: Broll;
};

export const STEPS = [
  "Instalação",
  "Configuração",
  "Captura de dados",
  "Engajamento",
  "Relatórios",
];

export const OUTRO_FRAMES = 90;
export const TRANSITION_FRAMES = 8;

/**
 * Os arquivos mantêm o nome de câmera de propósito: a associação
 * "qual take diz qual fala" é o que mais muda, e assim corrigir a ordem é
 * editar `video` aqui, sem reprocessar mídia.
 */
export const blocks: Block[] = [
  {
    id: "abertura",
    video: "videos/provedores/IMG_8414.mp4",
    durationInFrames: 154,
    chip: "Isabella Marques · Wispot",
    headline: [],
    activeSteps: [],
    zoom: 1.0,
    cuts: [],
  },
  {
    id: "ponte",
    video: "videos/provedores/IMG_8415.mp4",
    durationInFrames: 70,
    chip: "O caminho",
    headline: [{ t: "São " }, { t: "cinco passos", bold: true, underline: true }],
    activeSteps: [],
    zoom: 1.18,
    cuts: [],
  },
  {
    id: "passo-1",
    video: "videos/provedores/IMG_8417.mp4",
    durationInFrames: 159,
    chip: "Passo 01 · Instalação",
    headline: [
      { t: "Sobre o equipamento que " },
      { t: "já está na operação", bold: true, underline: true },
    ],
    activeSteps: [1],
    zoom: 1.0,
    cuts: [],
    broll: { kind: "instalacao", at: 52, durationInFrames: 82 },
  },
  {
    id: "passo-2",
    video: "videos/provedores/IMG_8423.mp4",
    durationInFrames: 192,
    chip: "Passo 02 · Configuração da rede",
    headline: [
      { t: "Portal de acesso, permissões e " },
      { t: "políticas de uso", bold: true },
    ],
    activeSteps: [2],
    zoom: 1.15,
    cuts: [],
    broll: {
      kind: "video",
      src: "videos/provedores/broll-portal.mp4",
      at: 58,
      durationInFrames: 96,
    },
  },
  {
    id: "passo-3",
    video: "videos/provedores/IMG_8425.mp4",
    durationInFrames: 187,
    chip: "Passo 03 · Captura de dados",
    headline: [
      { t: "Cada conexão registra " },
      { t: "quem usa a sua rede", bold: true, underline: true },
    ],
    activeSteps: [3],
    zoom: 1.0,
    cuts: [],
    broll: { kind: "analytics", at: 46, durationInFrames: 132 },
  },
  {
    id: "passo-4",
    video: "videos/provedores/IMG_8430.mp4",
    durationInFrames: 169,
    chip: "Passo 04 · Engajamento",
    headline: [
      { t: "Campanhas segmentadas para " },
      { t: "quem está conectado", bold: true, underline: true },
    ],
    activeSteps: [4],
    zoom: 1.12,
    cuts: [],
    broll: { kind: "ecossistema", at: 44, durationInFrames: 104 },
  },
  {
    id: "passo-5",
    video: "videos/provedores/IMG_8436.mp4",
    durationInFrames: 155,
    chip: "Passo 05 · Relatórios",
    headline: [
      { t: "O que cada ação " },
      { t: "gerou de resultado", bold: true, underline: true },
    ],
    activeSteps: [5],
    zoom: 1.0,
    cuts: [],
    broll: { kind: "relatorio", at: 45, durationInFrames: 85 },
  },
  {
    id: "fechamento",
    video: "videos/provedores/IMG_8437.mp4",
    durationInFrames: 95,
    chip: "Cinco passos",
    headline: [
      { t: "Receita extra sobre a estrutura que " },
      { t: "você já opera", bold: true, underline: true },
    ],
    activeSteps: [1, 2, 3, 4, 5],
    zoom: 1.12,
    cuts: [25],
  },
];

// Os blocos entram em corte seco — dissolver dois planos quase idênticos em
// escalas diferentes produzia fantasma de dupla exposição. Só a passagem para
// o card final atravessa, e é a única que consome frames das duas pontas.
const starts: number[] = [];
let acc = 0;
for (const b of blocks) {
  starts.push(acc);
  acc += b.durationInFrames;
}

export const blockRanges = blocks.map((b, i) => ({
  start: starts[i],
  end: starts[i] + b.durationInFrames,
}));

export const outroRange = {
  start: acc - TRANSITION_FRAMES,
  end: acc - TRANSITION_FRAMES + OUTRO_FRAMES,
};

export const totalDurationInFrames = acc + OUTRO_FRAMES - TRANSITION_FRAMES;
