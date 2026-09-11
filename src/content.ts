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

// As regiões abaixo têm faixa de tempo porque o conteúdo muda de tela dentro
// do mesmo bloco. Todas são folgadas nas bordas de propósito: uma sobra de
// desfoque sobre a tela vizinha é inofensiva, uma falta expõe dado pessoal.
// Foi exatamente isso que falhou na versão anterior — o bloco seguinte começava
// antes da troca de tela e a lista de visitantes aparecia sem censura.
//
// Referências no bruto do episódio 2 (o segundo bloco começa em 39,6s):
//   39,6-41,1  Hotspots      -> nomes dos pontos trazem "PRO ADV"
//   41,1-52,3  Visitantes    -> cartões com nome/idade/foto + painel Grupos
//                               com "[AD PROADV]"
//   52,3-81,7  Campanha      -> limpo
//   81,7-90,7  Usuários      -> coluna de nome e foto
//   90,7-100,2 Novo usuário  -> formulário vazio, limpo
//   100,2-fim  Usuários      -> coluna de nome e foto
const BLUR_EP2: BlurRegion[] = [
  { from: 0, to: 60, top: 6, left: 11, width: 86, height: 94 },
  { from: 30, to: 396, top: 8, left: 11, width: 68, height: 92 },
  { from: 30, to: 396, top: 0, left: 78, width: 22, height: 100 },
  { from: 1248, to: 1548, top: 3, left: 14, width: 31, height: 97 },
  { from: 1803, to: 1977, top: 3, left: 14, width: 31, height: 97 },
];

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
    title: "Um passeio pelo painel: campanhas, visitantes e usuários",
    openingFrames: OPENING,
    // Uma emenda só. A locução (76,6s) é mais curta que a gravação (105,6s), e
    // os 29s que sobram saem todos da tela de Hotspots (10,7-39,6s): é onde o
    // nome de cada ponto traz "PRO ADV", então censurá-la exigiria borrar a
    // tela inteira. Tirando esse trecho, o corte e a censura se resolvem
    // juntos, e as duas pontas da gravação ficam preservadas.
    blocks: [
      {
        id: "campanhas",
        video: "videos/ep2-campanhas.mp4",
        durationInFrames: 321, // 10,70s — bruto 0,0-10,7
        caption: "Campanhas",
      },
      {
        id: "painel",
        video: "videos/ep2-painel.mp4",
        durationInFrames: 1977, // 65,90s — bruto 39,6-105,5
        caption: "Visitantes, campanha e usuários",
        blur: BLUR_EP2,
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
