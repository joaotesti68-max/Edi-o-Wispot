export const FPS = 24;

/** Trecho de headline: `bold` destaca, `underline` marca com o traço ciano. */
export type Part = { t: string; bold?: boolean; underline?: boolean };

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
};

export const STEPS = [
  "Instalação",
  "Configuração",
  "Captura de dados",
  "Engajamento",
  "Relatórios",
];

export const OUTRO_FRAMES = 90;
export const TRANSITION_FRAMES = 6;

/**
 * Os arquivos mantêm o nome de câmera de propósito: a associação
 * "qual take diz qual fala" é o que mais muda, e assim corrigir a ordem é
 * editar `video` aqui, sem reprocessar mídia.
 */
export const blocks: Block[] = [
  {
    id: "abertura",
    video: "videos/provedores/IMG_8414.mp4",
    durationInFrames: 155,
    chip: "Isabella Marques · Wispot",
    headline: [
      { t: "Quanto trabalho dá pra " },
      { t: "colocar de pé", bold: true, underline: true },
      { t: "?" },
    ],
    activeSteps: [],
    zoom: 1.0,
    cuts: [],
  },
  {
    id: "ponte",
    video: "videos/provedores/IMG_8415.mp4",
    durationInFrames: 76,
    chip: "O caminho",
    headline: [{ t: "São " }, { t: "cinco passos", bold: true, underline: true }],
    activeSteps: [],
    zoom: 1.07,
    cuts: [],
  },
  {
    id: "passo-1",
    video: "videos/provedores/IMG_8417.mp4",
    durationInFrames: 171,
    chip: "Passo 01 · Instalação",
    headline: [
      { t: "Sobre o equipamento que " },
      { t: "já está na operação", bold: true, underline: true },
    ],
    activeSteps: [1],
    zoom: 1.0,
    cuts: [],
  },
  {
    id: "passo-2",
    video: "videos/provedores/IMG_8423.mp4",
    durationInFrames: 201,
    chip: "Passo 02 · Configuração da rede",
    headline: [
      { t: "Portal de acesso, permissões e " },
      { t: "políticas de uso", bold: true },
    ],
    activeSteps: [2],
    zoom: 1.07,
    cuts: [],
  },
  {
    id: "passo-3",
    video: "videos/provedores/IMG_8425.mp4",
    durationInFrames: 201,
    chip: "Passo 03 · Captura de dados",
    headline: [
      { t: "Cada conexão registra " },
      { t: "quem usa a sua rede", bold: true, underline: true },
    ],
    activeSteps: [3],
    zoom: 1.0,
    cuts: [],
  },
  {
    id: "passo-4",
    video: "videos/provedores/IMG_8436.mp4",
    durationInFrames: 162,
    chip: "Passo 04 · Engajamento",
    headline: [
      { t: "Campanhas segmentadas para " },
      { t: "quem está conectado", bold: true, underline: true },
    ],
    activeSteps: [4],
    zoom: 1.07,
    cuts: [],
  },
  {
    id: "passo-5",
    video: "videos/provedores/IMG_8437.mp4",
    durationInFrames: 127,
    chip: "Passo 05 · Relatórios",
    headline: [
      { t: "O que cada ação " },
      { t: "gerou de resultado", bold: true, underline: true },
    ],
    activeSteps: [5],
    zoom: 1.0,
    cuts: [25],
  },
];

// Espelha como o TransitionSeries encadeia as sequências, para a trilha de
// passos saber a faixa de frames de cada bloco sem repetir a conta.
const sequenceDurations = [...blocks.map((b) => b.durationInFrames), OUTRO_FRAMES];

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
  sequenceDurations.reduce((sum, d) => sum + d, 0) -
  TRANSITION_FRAMES * (sequenceDurations.length - 1);
