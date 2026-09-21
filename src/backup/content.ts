export const FPS = 24;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Cross-fade length between shots, in frames. */
export const TRANSITION_FRAMES = 6;
/** Shorter fade used to hide the internal cut inside a single take. */
export const TIGHT_TRANSITION_FRAMES = 3;
export const OUTRO_FRAMES = 96;

export type GraphicKey =
  | "none"
  | "singlePoint"
  | "offsite"
  | "datacenter"
  | "rule321"
  | "threats"
  | "services"
  | "cta";

export type Shot = {
  id: string;
  /** File under public/shots — already trimmed and loudness-normalised. */
  video: string;
  durationInFrames: number;
  /** Line of the script this shot delivers (kept here so re-cuts stay traceable). */
  line: string;
  headline: string;
  /** "full" = talking head fills the frame. "mockup" = full-screen visual, speaker in PiP. */
  layout: "full" | "mockup";
  graphic: GraphicKey;
  /** Frames to wait before the graphic animates in, tuned to the spoken line. */
  graphicDelay: number;
  /** Progressive state for graphics that span two shots. */
  graphicStep?: 1 | 2;
  /** Shots that continue the previous one get a tighter fade. */
  tightIn?: boolean;
  /** Suppress the headline (used on the second half of a split take). */
  hideHeadline?: boolean;
};

export const shots: Shot[] = [
  {
    id: "abertura",
    video: "shots/01-abertura.mp4",
    durationInFrames: 140,
    line: "Se todas as cópias do seu backup estão dentro da empresa, um único incidente pode comprometer todas elas.",
    headline: "Um único incidente pode levar todas as suas cópias",
    layout: "full",
    graphic: "singlePoint",
    graphicDelay: 40,
  },
  {
    id: "fora-do-ambiente",
    video: "shots/02-fora-do-ambiente.mp4",
    durationInFrames: 155,
    line: "Por isso, uma estratégia de backup segura precisa ter pelo menos uma cópia fora do ambiente principal.",
    headline: "Pelo menos uma cópia fora do ambiente principal",
    layout: "full",
    graphic: "offsite",
    graphicDelay: 50,
  },
  {
    id: "datacenter-a",
    video: "shots/03-datacenter-a.mp4",
    durationInFrames: 158,
    line: "Na Pro Advanced, essa cópia pode ficar protegida em nosso data center, em uma estrutura padrão Tier 3…",
    headline: "Seu backup protegido em data center padrão Tier 3",
    layout: "mockup",
    graphic: "datacenter",
    graphicDelay: 2,
    graphicStep: 1,
  },
  {
    id: "datacenter-b",
    video: "shots/04-datacenter-b.mp4",
    durationInFrames: 64,
    line: "…com energia redundante, controle de temperatura e alta disponibilidade.",
    headline: "Seu backup protegido em data center padrão Tier 3",
    layout: "mockup",
    graphic: "datacenter",
    graphicDelay: 0,
    graphicStep: 2,
    tightIn: true,
    hideHeadline: true,
  },
  {
    id: "regra-321",
    video: "shots/05-regra-321.mp4",
    durationInFrames: 140,
    line: "Também aplicamos a regra 3-2-1: três cópias dos dados, em dois tipos de mídia, com uma delas armazenada fora da empresa.",
    headline: "Regra 3-2-1: o padrão de um backup confiável",
    layout: "mockup",
    graphic: "rule321",
    graphicDelay: 10,
  },
  {
    id: "riscos",
    video: "shots/06-riscos.mp4",
    durationInFrames: 275,
    line: "Assim, se houver uma falha de equipamento, incêndio, roubo ou ataque cibernético na sede, você mantém uma cópia preservada e disponível para recuperação em outro ambiente.",
    headline: "Aconteça o que acontecer na sede, a cópia continua de pé",
    layout: "full",
    graphic: "threats",
    graphicDelay: 40,
  },
  {
    id: "hosting-colocation",
    video: "shots/07-hosting-colocation.mp4",
    durationInFrames: 195,
    line: "E essa mesma infraestrutura pode suportar outras necessidades da empresa, como hospedagem de ambientes e equipamentos em hosting ou colocation.",
    headline: "A mesma estrutura atende hosting e colocation",
    layout: "full",
    graphic: "services",
    graphicDelay: 118,
  },
  {
    id: "fechamento",
    video: "shots/08-fechamento.mp4",
    durationInFrames: 114,
    line: "Backup não é só fazer uma cópia. É garantir que ela continue segura quando você mais precisar.",
    headline: "Backup não é copiar. É conseguir recuperar.",
    layout: "full",
    graphic: "none",
    graphicDelay: 0,
  },
  {
    id: "cta",
    video: "shots/09-cta.mp4",
    durationInFrames: 103,
    line: "Fale com a Pro Advanced e conheça nossa estrutura de data center.",
    headline: "Conheça nossa estrutura de data center",
    layout: "full",
    graphic: "cta",
    graphicDelay: 30,
  },
];

const transitionBefore = (i: number) =>
  i === 0 ? 0 : shots[i].tightIn ? TIGHT_TRANSITION_FRAMES : TRANSITION_FRAMES;

const sequenceDurations = [...shots.map((s) => s.durationInFrames), OUTRO_FRAMES];
const transitions = [...shots.map((_, i) => transitionBefore(i)), TRANSITION_FRAMES];

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
