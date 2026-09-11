export const FPS = 30;

export type BlurRegion = { top: number; left: number; width: number; height: number };

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  caption?: string;
  /** Regiões a desfocar, em % da área visível do screencast (dados pessoais). */
  blur?: BlurRegion[];
};

export type VoiceOver = { src: string; startFrame: number; durationInFrames: number };

export type Episode = {
  id: string;
  number: string;
  series: string;
  title: string;
  openingFrames: number;
  blocks: Block[];
  voiceOvers: VoiceOver[];
};

// As gravações dos dois episódios têm 1092x614 e são recortadas em cima e
// embaixo:
//  - y 0-95    cromo do navegador (abas, URL, favoritos)
//  - y 96-139  barra do painel, que traz a marca da Pro Advanced
//  - y 575-613 faixa preta: a área capturada pelo OBS era mais alta que a
//    janela do navegador
// Sobra y 140-574. O recorte é feito no card (ver ScreenBlock), porque o
// ffmpeg que vem com o Remotion é compilado sem o filtro `crop`.
export const source = { width: 1092, height: 614, cropTop: 140, usableHeight: 435 };

const OPENING = 90; // 3s

/** Cobre os cartões de visitante (nome, idade, foto) em qualquer rolagem. */
const BLUR_VISITANTES: BlurRegion = { top: 12, left: 12, width: 67, height: 88 };
/** Cobre a coluna de avatar e nome da lista de usuários. */
const BLUR_USUARIOS: BlurRegion = { top: 35, left: 13, width: 34, height: 65 };

export const episodes: Episode[] = [
  {
    id: "WispotEp1",
    number: "01",
    series: "Pílulas Wispot",
    title: "O que o painel da Wispot te mostra sobre o seu Wi-Fi",
    openingFrames: OPENING,
    blocks: [
      {
        id: "dashboard",
        // Take contínuo, sem corte interno: a locução e a gravação têm a mesma
        // duração útil, o que indica que foram feitas juntas — cortar dentro
        // do take arriscaria descasar a fala do movimento do mouse.
        video: "videos/ep1-dashboard.mp4",
        durationInFrames: 1380, // 46,00s
        caption: "Dashboard — visão geral de acessos",
      },
    ],
    voiceOvers: [
      { src: "audio/ep1-vo-1.m4a", startFrame: OPENING, durationInFrames: 528 },
      { src: "audio/ep1-vo-2.m4a", startFrame: OPENING + 528, durationInFrames: 852 },
    ],
  },
  {
    id: "WispotEp2",
    number: "02",
    series: "Pílulas Wispot",
    title: "Um passeio pelo painel: campanhas, hotspots e visitantes",
    openingFrames: OPENING,
    // A locução (76,6s) é mais curta que a gravação (105,6s), então aqui há
    // corte interno. Todos os pontos de emenda caem dentro de trechos em que
    // a tela está congelada, nos dois lados do corte, então a emenda não
    // aparece.
    blocks: [
      {
        id: "campanhas",
        video: "videos/ep2-campanhas.mp4",
        durationInFrames: 270, // 9,00s — bruto 5,0-14,0
        caption: "Campanhas",
      },
      {
        id: "hotspots",
        video: "videos/ep2-hotspots.mp4",
        durationInFrames: 177, // 5,90s — bruto 28,0-33,9
        caption: "Hotspots",
      },
      {
        id: "visitantes",
        video: "videos/ep2-visitantes.mp4",
        durationInFrames: 270, // 9,00s — bruto 40,5-49,5
        caption: "Visitantes",
        blur: [BLUR_VISITANTES],
      },
      {
        id: "campanha",
        video: "videos/ep2-campanha.mp4",
        durationInFrames: 1056, // 35,20s — bruto 49,5-84,7
        caption: "Campanha — mídias, hotspots e público",
      },
      {
        id: "usuarios-a",
        video: "videos/ep2-usuarios-a.mp4",
        durationInFrames: 132, // 4,40s — bruto 87,0-91,4
        caption: "Usuários e permissões",
        blur: [BLUR_USUARIOS],
      },
      {
        id: "usuarios-form",
        video: "videos/ep2-usuarios-form.mp4",
        durationInFrames: 285, // 9,50s — bruto 91,5-101,0
        caption: "Usuários e permissões",
      },
      {
        id: "usuarios-b",
        video: "videos/ep2-usuarios-b.mp4",
        durationInFrames: 108, // 3,60s — bruto 101,0-104,6
        caption: "Usuários e permissões",
        blur: [BLUR_USUARIOS],
      },
    ],
    voiceOvers: [{ src: "audio/ep2-vo-1.m4a", startFrame: OPENING, durationInFrames: 2298 }],
  },
];

export type Layout = {
  ranges: { start: number; end: number }[];
  totalDurationInFrames: number;
};

export const layout = (episode: Episode): Layout => {
  const ranges: Layout["ranges"] = [];
  let acc = episode.openingFrames;
  for (const b of episode.blocks) {
    ranges.push({ start: acc, end: acc + b.durationInFrames });
    acc += b.durationInFrames;
  }
  return { ranges, totalDurationInFrames: acc };
};
