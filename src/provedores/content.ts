export const FPS = 24;

/**
 * Os arquivos guardam o nome original da câmera de propósito: a associação
 * "qual take diz qual fala" é a única coisa que muda com frequência, e assim
 * corrigir a ordem é editar `video` aqui, sem reprocessar mídia.
 */
export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  kicker: string;
  headline: string;
  /** Passos acesos na trilha superior enquanto o bloco está no ar. */
  activeSteps: number[];
  nameCard?: string;
};

export const STEPS = [
  "Instalação",
  "Configuração",
  "Captura de dados",
  "Engajamento",
  "Relatórios",
];

export const OUTRO_FRAMES = 84;
export const TRANSITION_FRAMES = 6;

export const blocks: Block[] = [
  {
    id: "abertura",
    video: "videos/provedores/IMG_8414.mp4",
    durationInFrames: 164,
    kicker: "Provedores",
    headline: "Quanto trabalho dá pra colocar de pé?",
    activeSteps: [],
    nameCard: "Isabella Marques",
  },
  {
    id: "passo-1",
    video: "videos/provedores/IMG_8423.mp4",
    durationInFrames: 201,
    kicker: "Passo 01 · Instalação",
    headline: "Sobre o equipamento que já está na operação",
    activeSteps: [1],
  },
  {
    id: "passo-2",
    video: "videos/provedores/IMG_8417.mp4",
    durationInFrames: 171,
    kicker: "Passo 02 · Configuração da rede",
    headline: "Portal de acesso, permissões e políticas de uso",
    activeSteps: [2],
  },
  {
    id: "passo-3",
    video: "videos/provedores/IMG_8436.mp4",
    durationInFrames: 162,
    kicker: "Passo 03 · Captura de dados",
    headline: "Cada conexão registra quem usa a sua rede",
    activeSteps: [3],
  },
  {
    id: "passos-4-5",
    video: "videos/provedores/IMG_8437.mp4",
    durationInFrames: 146,
    kicker: "Passos 04 e 05 · Engajamento e relatórios",
    headline: "Campanhas segmentadas e resultado medido",
    activeSteps: [4, 5],
  },
  {
    id: "fechamento",
    video: "videos/provedores/IMG_8415.mp4",
    durationInFrames: 76,
    kicker: "Cinco passos",
    headline: "Receita extra sobre a estrutura que você já opera",
    activeSteps: [1, 2, 3, 4, 5],
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
