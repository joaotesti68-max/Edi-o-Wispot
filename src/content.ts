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

// O bruto tem 1092x614 e é recortado em cima e embaixo:
//  - y 0-95   cromo do navegador (abas, URL, favoritos)
//  - y 96-139 barra do painel, que traz a marca da Pro Advanced
//  - y 575-613 faixa preta: a área capturada pelo OBS era mais alta que a
//    janela do navegador
// Sobra y 140-574. O recorte é feito no card (ver ScreenBlock), porque o
// ffmpeg que vem com o Remotion é compilado sem o filtro `crop`.
export const source = { width: 1092, height: 614, cropTop: 140, usableHeight: 435 };

export const episode = {
  number: "01",
  series: "Pílulas Wispot",
  title: "O que o painel da Wispot te mostra sobre o seu Wi-Fi",
};

// As duas locuções da Mari, na ordem. Cada uma entra em cima de um conjunto
// de blocos cuja soma de duração cobre a faixa.
// Locuções já recortadas: saíram os dois cues de voz masculina (0,40s no fim
// da primeira, 0,30s no começo da segunda) e o silêncio de borda, e as duas
// passaram por loudnorm em -14 LUFS, que é o alvo do YouTube.
export const voiceOvers = [
  { src: "audio/ep1-vo-1.m4a", startFrame: OPENING_FRAMES, durationInFrames: 528 },
  { src: "audio/ep1-vo-2.m4a", startFrame: OPENING_FRAMES + 528, durationInFrames: 852 },
];

export const blocks: Block[] = [
  {
    id: "dashboard",
    // Take contínuo, sem corte interno: como não sabemos o texto da locução,
    // qualquer corte dentro do take arriscaria descasar a fala do movimento
    // do mouse. Dos 46s, cerca de 20s têm movimento (16s-40s do bruto) e o
    // resto é tela parada — é tudo o que a gravação tem.
    video: "videos/ep1-dashboard.mp4",
    durationInFrames: 1380, // 46,00s
    caption: "Dashboard — visão geral de acessos",
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
