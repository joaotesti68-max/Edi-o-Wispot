// Cortes dos clipes brutos do João.
//
// Cada `Take` é um trecho de um arquivo bruto que entra no corte final. Os
// limites vieram da transcrição dos brutos (whisper), conferidos trecho a
// trecho contra o roteiro — o resto do material é repetição, correção,
// conversa de bastidor e risada.
//
// Frames são do arquivo de origem. Todos os brutos foram normalizados pra
// 24 fps constante, igual à composição, então `from`/`to` são segundo × 24.
// `to` é exclusivo.

import type { IconKey } from "../content";

export const JOAO_FPS = 24;
export const JOAO_WIDTH = 1080;
export const JOAO_HEIGHT = 1920;

// Fade de áudio nas emendas, pra não estalar no corte.
export const JOIN_FADE_FRAMES = 2;

export type Take = {
  /** Arquivo bruto em public/. */
  source: string;
  /** Trecho falado, do jeito que ele fala no bruto. */
  text: string;
  from: number;
  to: number;
};

/** Item de lista que entra em sincronia com o que ele está falando. */
export type Bullet = {
  label: string;
  /** A lista acompanha a fala: o item entra junto com essa take. */
  takeIndex: number;
  /** Frames depois do início da take, quando uma take traz dois itens. */
  delay?: number;
};

/** Aproximação na imagem, ancorada no rosto dele. */
export type Punch = {
  takeIndex: number;
  delay?: number;
  /** Quanto aproxima. Acima de ~1.2 o bruto, que é 576x1024, começa a borrar. */
  scale?: number;
  /** Frames segurando o zoom antes de voltar. */
  hold?: number;
};

export type ScriptClip = {
  id: string;
  /** Bloco do roteiro a que esse trecho pertence. */
  section: "Abertura" | "Desenvolvimento" | "Fechamento";
  /** Chamada que fica na tela durante o bloco. */
  headline: string;
  icon: IconKey;
  bullets?: Bullet[];
  /** Aproxima a imagem nele, pra dar ênfase num ponto do bloco. */
  punch?: Punch;
  /** Só no primeiro bloco. */
  nameCard?: string;
  /** Texto que esse bloco precisa entregar. */
  script: string;
  takes: Take[];
  /**
   * Frase do roteiro que não foi gravada. Decidido seguir sem: fica
   * registrado aqui pra quem comparar o vídeo com o roteiro entender a
   * diferença.
   */
  notRecorded?: string;
};

const ABERTURA_1 = "videos/joao/raw-abertura-1.mp4";
const ABERTURA_2 = "videos/joao/raw-abertura-2.mp4";
const PSI_REGRAS = "videos/joao/raw-psi-regras.mp4";
const BASE = "videos/joao/raw-base.mp4";
const DIRETRIZ = "videos/joao/raw-diretriz.mp4";
const GENERICO = "videos/joao/raw-generico.mp4";
const CONSIDERAR = "videos/joao/raw-considerar.mp4";
const FECHAMENTO_1 = "videos/joao/raw-fechamento-1.mp4";
const FECHAMENTO_2 = "videos/joao/raw-fechamento-2b.mp4";
// Primeira take do "fale com a nossa equipe", equivalente à que está no corte.
export const FECHAMENTO_2_ALT = "videos/joao/raw-fechamento-2.mp4";

export const clips: ScriptClip[] = [
  {
    id: "abertura",
    section: "Abertura",
    headline: "O primeiro passo não é o firewall. É a PSI.",
    icon: "shield",
    nameCard: "João Dourado",
    // Fecha nele em cima do "É a Política de Segurança da Informação".
    punch: { takeIndex: 1, delay: 4, scale: 1.18, hold: 54 },
    script:
      "Na adequação de um cartório, o primeiro passo não é o firewall nem o backup. " +
      "É a Política de Segurança da Informação, a PSI.",
    takes: [
      // 0,98s – 5,86s
      {
        source: ABERTURA_1,
        text: "Na adequação de um cartório, o primeiro passo não é o firewall nem o backup",
        from: 23,
        to: 141,
      },
      // 0,32s – 4,06s — ele fala "conhecida como PSI" no lugar de "a PSI"
      {
        source: ABERTURA_2,
        text: "É a Política de Segurança da Informação, conhecida como PSI",
        from: 8,
        to: 97,
      },
    ],
  },
  {
    id: "regras",
    section: "Desenvolvimento",
    headline: "A PSI define as regras",
    icon: "shield",
    bullets: [
      { label: "Quem acessa cada informação", takeIndex: 0 },
      { label: "Como os dados são protegidos", takeIndex: 1 },
      { label: "Como os backups funcionam", takeIndex: 2 },
      // Essa take traz dois itens; ele chega no "como a equipe deve agir" em
      // 83,2s, 46 frames depois do início dela.
      { label: "Como a equipe age num incidente", takeIndex: 2, delay: 46 },
    ],
    script:
      "É a PSI que define as regras: quem pode acessar cada informação, como os dados devem ser " +
      "protegidos, como os backups devem funcionar e como a equipe deve agir diante de um incidente.",
    takes: [
      // 4,90s – 8,30s
      {
        source: PSI_REGRAS,
        text: "É a PSI que define as regras, quem pode acessar cada informação",
        from: 118,
        to: 199,
      },
      // 25,78s – 27,52s
      { source: PSI_REGRAS, text: "como os dados devem ser protegidos", from: 619, to: 660 },
      // 81,26s – 86,15s (última take, é a única com a frase inteira e sem tropeço)
      {
        source: PSI_REGRAS,
        text: "como os backups devem funcionar e como a equipe deve agir diante de um incidente",
        from: 1950,
        to: 2068,
      },
    ],
  },
  {
    id: "base",
    section: "Desenvolvimento",
    headline: "Sem diretriz, cada solução funciona isolada",
    icon: "alert",
    script:
      "Ela é a base para todas as outras decisões de segurança. Sem essa diretriz, o cartório pode " +
      "até investir em tecnologia, mas cada solução acaba funcionando de forma isolada.",
    takes: [
      // 0,82s – 4,30s
      {
        source: BASE,
        text: "Ela é a base para todas as outras decisões de segurança",
        from: 20,
        to: 103,
      },
      // 2,06s – 6,85s
      {
        source: DIRETRIZ,
        text: "Sem essa diretriz, o cartório pode até investir em tecnologia",
        from: 49,
        to: 164,
      },
      // 17,20s – 21,60s. A primeira take dessa frase, em 11,88s, tinha uma
      // outra voz falando até 11,74s — só 0,12s antes do corte, e ainda em
      // decaimento quando ele começa. Essa aqui tem um segundo de silêncio
      // limpo antes (-80 dB), então a emenda entra sem nada atrás.
      {
        source: DIRETRIZ,
        text: "mas cada solução acaba funcionando de forma isolada",
        from: 413,
        to: 518,
      },
    ],
  },
  {
    id: "generico",
    section: "Desenvolvimento",
    headline: "Nada de documento genérico",
    icon: "server",
    bullets: [
      { label: "Os sistemas utilizados", takeIndex: 1 },
      { label: "Os riscos da operação", takeIndex: 2 },
      { label: "A rotina real do cartório", takeIndex: 3 },
    ],
    script:
      "E a PSI não deve ser um documento genérico, feito apenas para cumprir uma exigência. " +
      "Ela precisa considerar os sistemas utilizados, os riscos da operação e a rotina real do cartório.",
    takes: [
      // 2,66s – 7,82s — ele começa direto no "A PSI", sem o "E" do roteiro
      {
        source: GENERICO,
        text: "A PSI não deve ser um documento genérico, feito apenas para cumprir uma exigência",
        from: 64,
        to: 188,
      },
      // 0,56s – 3,52s
      { source: CONSIDERAR, text: "Ela precisa considerar os sistemas utilizados", from: 13, to: 84 },
      // 29,72s – 31,75s (alternativa equivalente em 13,20s)
      { source: CONSIDERAR, text: "os riscos da operação", from: 713, to: 762 },
      // 56,98s – 58,60s (alternativa em 48,72s) — o "e" já vem junto nessa take
      { source: CONSIDERAR, text: "e a rotina real do cartório", from: 1367, to: 1406 },
    ],
  },
  {
    id: "fechamento",
    section: "Fechamento",
    headline: "Comece a adequação pela base certa",
    icon: "chat",
    // Fecha nele no "fale com a nossa equipe" e segura até o end card.
    punch: { takeIndex: 1, delay: 2, scale: 1.16, hold: 999 },
    // O trecho "desde a construção da PSI até a aplicação dessas diretrizes"
    // não foi gravado; entra escrito, enquanto ele fala "apoiamos os
    // cartórios", pra mensagem não se perder.
    bullets: [{ label: "Da construção da PSI à aplicação", takeIndex: 0, delay: 18 }],
    script:
      "Na Pro Advanced, apoiamos o cartório desde a construção da PSI até a aplicação dessas " +
      "diretrizes na operação. Fale com a nossa equipe e comece a adequação pela base certa.",
    // Ele para em "apoiamos os cartórios" e o bruto acaba ali. Emendando
    // direto no "fale com a nossa equipe" a frase fecha sozinha, e o que ele
    // deixou de falar entra na arte do bloco.
    notRecorded: "desde a construção da PSI até a aplicação dessas diretrizes na operação",
    takes: [
      // 0,32s – 2,85s — "Aqui na Pro Advanced já apoiamos os cartórios",
      // no lugar de "Na Pro Advanced, apoiamos o cartório"
      {
        source: FECHAMENTO_1,
        text: "Aqui na Pro Advanced já apoiamos os cartórios",
        from: 8,
        to: 68,
      },
      // 1,14s – 3,21s — nas duas takes ele termina em "comece a adequação já",
      // e não em "comece a adequação pela base certa" como está no roteiro
      {
        source: FECHAMENTO_2,
        text: "Fale com a nossa equipe e comece a adequação já",
        from: 27,
        to: 77,
      },
    ],
  },
];

export const takeDuration = (take: Take) => take.to - take.from;

export const clipDuration = (clip: ScriptClip) =>
  clip.takes.reduce((sum, take) => sum + takeDuration(take), 0);

/** Frame em que uma take começa, contado do início do bloco. */
export const takeStart = (clip: ScriptClip, takeIndex: number) =>
  clip.takes.slice(0, takeIndex).reduce((sum, take) => sum + takeDuration(take), 0);

export const punchStart = (clip: ScriptClip, punch: Punch) =>
  takeStart(clip, punch.takeIndex) + (punch.delay ?? 0);

export const bulletStart = (clip: ScriptClip, bullet: Bullet) =>
  takeStart(clip, bullet.takeIndex) + (bullet.delay ?? 0);

export const OUTRO_FRAMES = 72;
export const OUTRO_TRANSITION_FRAMES = 10;

/** Faixa de frames de cada bloco na composição inteira (cortes secos entre eles). */
export const blockRanges = clips.map((clip, i) => {
  const start = clips.slice(0, i).reduce((sum, c) => sum + clipDuration(c), 0);
  return { start, end: start + clipDuration(clip) };
});

export const blocksDuration = clips.reduce((sum, clip) => sum + clipDuration(clip), 0);

export const outroRange = {
  start: blocksDuration - OUTRO_TRANSITION_FRAMES,
  end: blocksDuration - OUTRO_TRANSITION_FRAMES + OUTRO_FRAMES,
};

/** Só os cortes, sem o end card — é o que o `Joao-00-completo` renderiza. */
export const totalDuration = blocksDuration;

export const finalDuration = outroRange.end;
