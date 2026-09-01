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

export type ScriptClip = {
  id: string;
  /** Bloco do roteiro a que esse trecho pertence. */
  section: "Abertura" | "Desenvolvimento" | "Fechamento";
  /** Texto que esse bloco precisa entregar. */
  script: string;
  takes: Take[];
  /**
   * Frase do roteiro que ainda não existe em nenhum bruto recebido. O bloco
   * renderiza sem ela; é o que falta gravar.
   */
  missing?: string;
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
      // 11,88s – 16,06s (a segunda take, em 17,22s, também serve se essa não agradar)
      {
        source: DIRETRIZ,
        text: "mas cada solução acaba funcionando de forma isolada",
        from: 285,
        to: 385,
      },
    ],
  },
  {
    id: "generico",
    section: "Desenvolvimento",
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
    script:
      "Na Pro Advanced, apoiamos o cartório desde a construção da PSI até a aplicação dessas " +
      "diretrizes na operação. Fale com a nossa equipe e comece a adequação pela base certa.",
    // Ele para em "apoiamos os cartórios" e o bruto acaba ali — esse pedaço do
    // meio não existe em nenhum arquivo. Emendando direto no "fale com a nossa
    // equipe" a frase fecha, só fica mais curta que o roteiro.
    missing: "desde a construção da PSI até a aplicação dessas diretrizes na operação",
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

export const totalDuration = clips.reduce((sum, clip) => sum + clipDuration(clip), 0);
