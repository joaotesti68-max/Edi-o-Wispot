export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const TRANSITION_FRAMES = 9;

/**
 * Onde a pergunta foi feita fora de quadro, ela sai do take e vira card: a
 * lapela da Mari pegava a voz de quem perguntava fraca demais para ir ao ar.
 * Os takes que já abriam pela resposta continuam entrando por um card, para a
 * série manter o mesmo ritmo de pergunta e resposta.
 */
export type QuestionCard = {
  kind: "question";
  id: string;
  index: number;
  question: string;
  durationInFrames: number;
};

export type Clip = {
  kind: "clip";
  id: string;
  video: string;
  durationInFrames: number;
  /** Small ribbon reminding late viewers which question is being answered. */
  ribbon?: string;
  /** Speaker lower third, shown once near the top of the video. */
  nameCard?: { name: string; role: string };
  /** Kicker shown over the opening take. */
  kicker?: string;
};

export type Segment = QuestionCard | Clip;

export const segments: Segment[] = [
  {
    kind: "clip",
    id: "abertura",
    video: "videos/abertura.mp4",
    durationInFrames: 184,
    kicker: "Perguntas e Respostas",
    nameCard: { name: "Mari", role: "Time Wispot" },
  },
  {
    kind: "question",
    id: "pergunta-1",
    index: 1,
    question: "Para quais tipos de negócio a Wispot é indicada?",
    durationInFrames: 82,
  },
  {
    kind: "clip",
    id: "resposta-1",
    video: "videos/resposta-1.mp4",
    durationInFrames: 421,
    ribbon: "Para quais negócios a Wispot serve?",
  },
  {
    kind: "question",
    id: "pergunta-2",
    index: 2,
    question: "Como a Wispot pode gerar receita para um provedor de internet?",
    durationInFrames: 96,
  },
  {
    kind: "clip",
    id: "resposta-2",
    video: "videos/resposta-2.mp4",
    durationInFrames: 553,
    ribbon: "Como gerar receita com a Wispot?",
  },
  {
    kind: "question",
    id: "pergunta-3",
    index: 3,
    question: "Quais equipamentos funcionam com a Wispot?",
    durationInFrames: 76,
  },
  {
    kind: "clip",
    id: "resposta-3",
    video: "videos/resposta-3.mp4",
    durationInFrames: 366,
    ribbon: "Quais equipamentos funcionam?",
  },
  {
    kind: "question",
    id: "pergunta-4",
    index: 4,
    question: "Como saber o que o público acha do meu espaço?",
    durationInFrames: 80,
  },
  {
    kind: "clip",
    id: "resposta-4",
    video: "videos/resposta-4.mp4",
    durationInFrames: 362,
    ribbon: "Como saber o que o público acha?",
  },
  {
    kind: "clip",
    id: "fechamento",
    video: "videos/fechamento.mp4",
    durationInFrames: 131,
  },
];

export const OUTRO_FRAMES = 90;

// Mirrors how TransitionSeries overlaps its sequences, so the progress bar can
// map a frame back to its segment without redoing the transition math.
const durations = [...segments.map((s) => s.durationInFrames), OUTRO_FRAMES];

const starts: number[] = [0];
for (let i = 1; i < durations.length; i++) {
  starts.push(starts[i - 1] + durations[i - 1] - TRANSITION_FRAMES);
}

export const segmentRanges = segments.map((s, i) => ({
  start: starts[i],
  end: starts[i] + s.durationInFrames,
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  durations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * (durations.length - 1);

/**
 * A trilha se abre nos cards e no encerramento, onde ninguém fala, e recua para
 * um leito discreto por baixo da Mari. Sem isso ela ou some no vídeo inteiro ou
 * briga com a voz.
 *
 * O fade final é curto de propósito: a faixa foi montada para o tempo forte do
 * último compasso cair no quadro 2336, e o fade só entra depois dele.
 */
const MUSIC_DUCKED = 0.09;
const MUSIC_OPEN = 0.38;
const MUSIC_RAMP = 8;
const MUSIC_FADE_OUT = 12;

const musicKeyframes: { frame: number; volume: number }[] = [];
[...segments.map((s) => s.kind === "question"), true].forEach((isOpen, i) => {
  const range = i < segments.length ? segmentRanges[i] : outroRange;
  const volume = isOpen ? MUSIC_OPEN : MUSIC_DUCKED;
  // Os platôs param antes das bordas para as rampas caírem dentro das
  // transições, onde a mudança de volume passa despercebida.
  musicKeyframes.push({ frame: i === 0 ? 0 : range.start + MUSIC_RAMP, volume });
  musicKeyframes.push({ frame: range.end - MUSIC_RAMP, volume });
});

export const musicVolume = {
  frames: musicKeyframes.map((k) => k.frame),
  volumes: musicKeyframes.map((k) => k.volume),
  fadeOutFrom: totalDurationInFrames - MUSIC_FADE_OUT,
};
