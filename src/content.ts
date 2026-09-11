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
/** Coluna de foto e nome da lista de usuários internos. */
const USUARIOS: BlurRegion = { top: -8, left: 15, width: 28, height: 116, solid: TARJA };
/** Painel Grupos, à direita, com entradas "[AD PROADV]". */
const VIS_GRUPOS: BlurRegion = { top: -8, left: 78, width: 22, height: 116, solid: TARJA };
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
    // A sincronia vem de quatro pontos informados por quem ouviu a locução:
    // ela passa a falar de Hotspots aos 10s, Visitantes aos 21s, Campanha aos
    // 33s e Gerenciar aos 62s. Cruzando com o instante de cada tela na
    // gravação, o ritmo fica:
    //
    //   Campanhas   fala  0-10s  <- bruto   0,0-10,7   1,07x
    //   Hotspots    fala 10-21s  <- bruto  10,7-41,1   2,76x
    //   Visitantes  fala 21-33s  <- bruto  41,1-52,3   0,93x
    //   Campanha    fala 33-62s  <- bruto  52,3-81,7   1,01x
    //   Gerenciar   fala 62-77s  <- bruto  81,7-105,5  1,63x
    //
    // Três das cinco seções são quase 1:1 e só duas precisam encolher muito. É
    // por isso que as duas tentativas anteriores falharam em sentidos opostos:
    // comprimir tudo por igual acelerou as três que já estavam certas (imagem
    // adiantada), e velocidade natural deixou as duas que precisavam encolher
    // arrastando (imagem atrasada).
    //
    // Cada seção entra no seu próprio ritmo, tirando tempo congelado de dentro
    // dela. As emendas caem em troca de tela, então leem como corte natural.
    blocks: [
      {
        id: "campanhas",
        video: "videos/ep2-s1.mp4",
        durationInFrames: 300, // 10,00s — bruto 0,7-10,7
      },
      {
        id: "hotspots",
        video: "videos/ep2-s2.mp4",
        durationInFrames: 330, // 11,00s — bruto 29,3-40,3
        blur: [...comFaixa(HS_ROLAGEM_A, 0, 39), ...comFaixa(HS_ROLAGEM_B, 42, 330)],
      },
      {
        id: "visitantes",
        video: "videos/ep2-s3.mp4",
        durationInFrames: 360, // 12,00s — bruto 40,3-52,3
        blur: [...comFaixa(HS_ROLAGEM_B, 0, 36), ...comFaixa([VIS_CARTOES, VIS_GRUPOS], 0, 360)],
      },
      {
        id: "campanha",
        video: "videos/ep2-s4.mp4",
        durationInFrames: 879, // 29,30s — bruto 52,3-81,6
      },
      {
        id: "gerenciar-lista",
        video: "videos/ep2-s5.mp4",
        durationInFrames: 114, // 3,80s — bruto 90,2-94,0
        blur: comFaixa([USUARIOS], 0, 30),
      },
      {
        id: "gerenciar-form",
        video: "videos/ep2-s6.mp4",
        durationInFrames: 315, // 10,50s — bruto 95,0-105,5
        blur: comFaixa([USUARIOS], 141, 315),
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
