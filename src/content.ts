export const FPS = 30;

export type BlurRegion = {
  /** Tudo em % da área visível do screencast. */
  top: number;
  left: number;
  width: number;
  height: number;
  /** Frames relativos ao início do bloco. Sem from/to, vale o bloco inteiro. */
  from?: number;
  to?: number;
  /**
   * Tarja opaca em vez de desfoque. O backdrop-filter do Chromium perde força
   * perto da borda do contêiner recortado, e junto ao rodapé do card o texto
   * continuava legível mesmo com raio de 26px — transbordar a região não
   * resolve, porque o overflow:hidden recorta o elemento junto com o efeito.
   * Para texto de marca, "quase ilegível" não serve, então tarja.
   */
  solid?: string;
};

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

// Regiões de censura, em % da área visível, com faixa de frames dentro do
// bloco. Todas folgadas nas bordas de propósito: sobrar desfoque sobre a tela
// vizinha é inofensivo, faltar expõe dado. Foi a falta disso que deixou a
// lista de visitantes aparecer sem censura numa emenda.

// Barras de título dos cards de hotspot, onde está escrito "PRO ADV", mais a
// linha de "perfil de rede / tema de login", que também traz "PROADV". As
// posições foram medidas detectando o azul da barra de título no quadro: a
// tela de Hotspots tem dois estados de rolagem e os títulos ficam em alturas
// bem diferentes em cada um. Borrar só essas faixas mantém legível o que
// interessa (consumo, status, identificação).
// Regiões que encostam numa borda do card transbordam de propósito: o
// backdrop-filter do Chromium deixa uma faixa sem efeito junto ao limite do
// overflow:hidden, e com o transbordo esse artefato cai fora da área visível.
// Foi assim que "PROADV_VISITANTES (REU..." continuava legível no rodapé.
/** Cinza-azulado neutro, para a tarja não competir com a interface. */
const TARJA = "#8fa3ae";

// Barras de título medidas no quadro (detecção do azul da barra): estado A em
// 47,6-55,4% e 95,2-100%; estado B em 10,8-18,6% e 58,4-66,2%. As faixas de
// "tema de login", que também trazem PROADV, ficam ~29 pontos abaixo de cada
// título. Como tarja não perde força na borda, dá para cobrir só as linhas de
// texto em vez de faixas largas.
const HS_ROLAGEM_A: BlurRegion[] = [
  { top: 46, left: 11, width: 86, height: 11, solid: TARJA },
  { top: 76, left: 11, width: 86, height: 13, solid: TARJA },
  { top: 94, left: 11, width: 86, height: 8, solid: TARJA },
];
const HS_ROLAGEM_B: BlurRegion[] = [
  { top: 9, left: 11, width: 86, height: 11, solid: TARJA },
  { top: 39, left: 11, width: 86, height: 13, solid: TARJA },
  { top: 56, left: 11, width: 86, height: 12, solid: TARJA },
  { top: 86, left: 11, width: 86, height: 14, solid: TARJA },
];
/** Cartões de visitante: nome, idade e foto de 974 pessoas reais. */
const VIS_CARTOES: BlurRegion = { top: 8, left: 11, width: 68, height: 100 };
/** Painel Grupos, à direita, com entradas "[AD PROADV]". */
const VIS_GRUPOS: BlurRegion = { top: -8, left: 78, width: 22, height: 116, solid: TARJA };
/** Coluna de foto e nome da lista de usuários internos. */
const USUARIOS: BlurRegion = { top: -8, left: 15, width: 28, height: 116, solid: TARJA };

const comFaixa = (rs: BlurRegion[], from: number, to: number) =>
  rs.map((r) => ({ ...r, from, to }));

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
    title: "Um passeio pelo painel da Wispot",
    openingFrames: OPENING,
    // A locução tem 76,6s e a gravação 104,3s de tela útil. As cinco telas são
    // encolhidas todas no mesmo fator (0,734), tirando só tempo congelado de
    // dentro de cada uma. Assim a ordem e a proporção entre as telas ficam de
    // pé, que é o que mantém a fala casada com a imagem.
    //
    // O que sustenta a escolha do fator: a primeira troca de tela cai em 7,9s
    // e a primeira pausa da locução está em 7,85s; a segunda troca em 29,3s e
    // a segunda pausa em 28,0s.
    //
    // Tentar resolver com um corte só, tirando a tela de Hotspots inteira,
    // adiantou a imagem em relação à fala do meio do vídeo em diante — a
    // locução fala dessa tela.
    blocks: [
      {
        id: "campanhas",
        video: "videos/ep2-p1.mp4",
        durationInFrames: 276, // 9,20s — bruto 2,8-12,0
        caption: "Campanhas",
        blur: comFaixa(HS_ROLAGEM_A, 225, 276),
      },
      {
        id: "hotspots",
        video: "videos/ep2-p2.mp4",
        durationInFrames: 603, // 20,10s — bruto 19,8-39,9
        caption: "Hotspots",
        blur: [...comFaixa(HS_ROLAGEM_A, 0, 345), ...comFaixa(HS_ROLAGEM_B, 300, 603)],
      },
      {
        id: "visitantes",
        video: "videos/ep2-p3.mp4",
        durationInFrames: 333, // 11,10s — bruto 44,1-55,2
        caption: "Visitantes",
        blur: comFaixa([VIS_CARTOES, VIS_GRUPOS], 0, 261),
      },
      {
        id: "campanha",
        video: "videos/ep2-p4.mp4",
        durationInFrames: 111, // 3,70s — bruto 59,4-63,1
        caption: "Campanha",
      },
      {
        id: "campanha-publico",
        video: "videos/ep2-p5.mp4",
        durationInFrames: 474, // 15,80s — bruto 66,7-82,5
        caption: "Campanha — mídias e público",
        blur: comFaixa([USUARIOS], 435, 474),
      },
      {
        id: "usuarios",
        video: "videos/ep2-p6.mp4",
        durationInFrames: 501, // 16,70s — bruto 88,8-105,5
        caption: "Usuários e permissões",
        blur: [...comFaixa([USUARIOS], 0, 72), ...comFaixa([USUARIOS], 327, 501)],
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
