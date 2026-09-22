export const FPS = 24;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const OUTRO_FRAMES = 74;
/** Default cross-fade between shots. */
export const TRANSITION_FRAMES = 2;

export type GraphicKey =
  | "none"
  | "singlePoint"
  | "tier3"
  | "datacenter"
  | "rule321Badge"
  | "rule321"
  | "threats"
  | "preserved"
  | "services"
  | "cta";

export type Shot = {
  id: string;
  /** Trimmed, loudness-normalised take under public/shots, sped up to 1.08x. */
  video: string;
  durationInFrames: number;
  /** What is actually said in this take (transcribed from the raw clip). */
  line: string;
  /** Empty when the graphic already says it and a second line would just repeat. */
  headline: string;
  /**
   * full   — talking head fills the frame, graphic supports it from below.
   * mockup — he is reading off the page, so the footage is dropped and only the
   *          visual stays on screen; the take is still heard.
   */
  layout: "full" | "mockup";
  graphic: GraphicKey;
  /** Frames before the graphic animates in, measured against the spoken words. */
  graphicDelay: number;
  /** Cross-fade length in front of this shot; shorter inside a single sentence. */
  transitionIn?: number;
};

export const shots: Shot[] = [
  {
    id: "abertura",
    video: "shots/01-abertura.mp4",
    durationInFrames: 112,
    line: "Se todas as cópias do seu backup estão dentro da empresa, um único incidente pode comprometer todas elas.",
    headline: "Um único incidente pode levar todas as suas cópias",
    layout: "full",
    graphic: "singlePoint",
    graphicDelay: 51,
  },
  {
    id: "tier3",
    video: "shots/02-tier3.mp4",
    durationInFrames: 125,
    line: "Na Pro Advanced, essa cópia pode ficar protegida em nosso data center, em uma estrutura padrão Tier 3,",
    headline: "Protegida fora da empresa, no nosso data center",
    layout: "full",
    graphic: "tier3",
    graphicDelay: 83,
  },
  {
    id: "datacenter-specs",
    video: "shots/03-datacenter-specs.mp4",
    durationInFrames: 89,
    line: "com energia redundante, controle de temperatura e alta disponibilidade.",
    headline: "Dentro do nosso data center",
    layout: "mockup",
    graphic: "datacenter",
    graphicDelay: 1,
    transitionIn: 3,
  },
  {
    id: "regra321",
    video: "shots/04-regra321.mp4",
    durationInFrames: 62,
    line: "Também aplicamos a regra 3-2-1:",
    headline: "Também aplicamos a regra 3\u20112\u20111",
    layout: "full",
    graphic: "rule321Badge",
    graphicDelay: 34,
  },
  {
    id: "regra321-detalhe",
    video: "shots/05-regra321-detalhe.mp4",
    durationInFrames: 113,
    line: "três cópias dos dados, em dois tipos de mídia, com uma delas armazenada fora da empresa.",
    headline: "O padrão de um backup confiável",
    layout: "mockup",
    graphic: "rule321",
    graphicDelay: 5,
    transitionIn: 3,
  },
  {
    id: "riscos",
    video: "shots/06-riscos.mp4",
    durationInFrames: 108,
    line: "Assim, se houver uma falha, roubo, incêndio, ataque cibernético na sede,",
    headline: "Aconteça o que acontecer na sede",
    layout: "full",
    graphic: "threats",
    graphicDelay: 32,
  },
  {
    id: "recuperacao",
    video: "shots/07-recuperacao.mp4",
    durationInFrames: 94,
    line: "você mantém uma cópia preservada e disponível para recuperação em outro ambiente.",
    headline: "",
    layout: "full",
    graphic: "preserved",
    graphicDelay: 29,
  },
  {
    id: "infraestrutura",
    video: "shots/08-infraestrutura.mp4",
    durationInFrames: 95,
    line: "E essa mesma infraestrutura pode suportar outras necessidades da empresa.",
    headline: "A mesma estrutura atende hosting e colocation",
    layout: "full",
    graphic: "services",
    graphicDelay: 33,
  },
  {
    id: "fechamento",
    video: "shots/09-fechamento.mp4",
    durationInFrames: 113,
    line: "Backup não é só fazer uma cópia. É garantir que ela continue segura quando você mais precisar.",
    headline: "Backup não é copiar. É conseguir recuperar.",
    layout: "full",
    graphic: "none",
    graphicDelay: 0,
  },
  {
    id: "cta",
    video: "shots/10-cta.mp4",
    durationInFrames: 76,
    line: "Fale com a Pro Advanced e conheça nossas estruturas de data center.",
    headline: "Conheça nossa estrutura de data center",
    layout: "full",
    graphic: "cta",
    graphicDelay: 24,
  },
];

const transitions = [
  ...shots.map((s, i) => (i === 0 ? 0 : (s.transitionIn ?? TRANSITION_FRAMES))),
  TRANSITION_FRAMES,
];
const sequenceDurations = [...shots.map((s) => s.durationInFrames), OUTRO_FRAMES];

export const shotTransitions = transitions;

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - transitions[i]);
}

export const shotRanges = shots.map((s, i) => ({
  start: starts[i],
  end: starts[i] + s.durationInFrames,
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) -
  transitions.reduce((sum, t) => sum + t, 0);
