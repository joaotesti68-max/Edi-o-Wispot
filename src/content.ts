export const FPS = 30;

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  caption?: string;
  /** Regiões a desfocar, em % do quadro do screencast (dados pessoais). */
  blur?: { top: number; left: number; width: number; height: number }[];
};

export const OPENING_FRAMES = 90; // 3s

export const episode = {
  number: "01",
  series: "Pílulas Wispot",
  title: "O que o painel da Wispot te mostra sobre o seu Wi-Fi",
};

// As duas locuções da Mari, na ordem. Cada uma entra em cima de um conjunto
// de blocos cuja soma de duração cobre a faixa.
export const voiceOvers = [
  { src: "audio/ep1-vo-1.m4a", startFrame: OPENING_FRAMES, durationInFrames: 627 },
  { src: "audio/ep1-vo-2.m4a", startFrame: OPENING_FRAMES + 627, durationInFrames: 951 },
];

export const blocks: Block[] = [
  {
    id: "dashboard",
    video: "videos/ep1-dashboard.mp4",
    durationInFrames: 627, // 20,90s
    caption: "Dashboard — visão geral de acessos",
  },
  {
    id: "graficos",
    video: "videos/ep1-graficos.mp4",
    durationInFrames: 573, // 19,10s
    caption: "Dispositivo, idioma, autenticação e browser",
  },
  {
    id: "hotspots",
    video: "videos/ep1-hotspots.mp4",
    durationInFrames: 285, // 9,50s
    caption: "Hotspots — status de cada ponto",
  },
  {
    id: "visitantes",
    video: "videos/ep1-visitantes.mp4",
    durationInFrames: 96, // 3,20s
    caption: "Base de visitantes",
    // Cartões com nome, idade e foto de pessoas reais.
    blur: [{ top: 30, left: 11, width: 68, height: 70 }],
  },
];

const starts: number[] = [];
let acc = OPENING_FRAMES;
for (const b of blocks) {
  starts.push(acc);
  acc += b.durationInFrames;
}

export const blockRanges = blocks.map((b, i) => ({
  start: starts[i],
  end: starts[i] + b.durationInFrames,
}));

export const totalDurationInFrames = acc;
