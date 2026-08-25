export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const TRANSITION_FRAMES = 9;

/**
 * The raw takes each opened with the question asked off-camera, picked up
 * faintly by Mari's lavalier. Those heads are trimmed out of the mp4s in
 * public/videos, so the questions live here as cards instead — the card is what
 * now carries the question that used to be spoken.
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
    durationInFrames: 156,
    kicker: "Perguntas e Respostas",
    nameCard: { name: "Mari", role: "Time Wispot" },
  },
  {
    kind: "question",
    id: "pergunta-1",
    index: 1,
    question: "Dá pra integrar com o CRM que eu já uso?",
    durationInFrames: 78,
  },
  {
    kind: "clip",
    id: "resposta-1",
    video: "videos/resposta-1.mp4",
    durationInFrames: 257,
    ribbon: "Integra com o meu CRM?",
  },
  {
    kind: "question",
    id: "pergunta-2",
    index: 2,
    question: "Depois que instala, quem atende?",
    durationInFrames: 72,
  },
  {
    kind: "clip",
    id: "resposta-2",
    video: "videos/resposta-2.mp4",
    durationInFrames: 463,
    ribbon: "Depois que instala, quem atende?",
  },
  {
    kind: "question",
    id: "pergunta-3",
    index: 3,
    question: "Tenho vários pontos de acesso. Consigo ver tudo junto?",
    durationInFrames: 100,
  },
  {
    kind: "clip",
    id: "resposta-3",
    video: "videos/resposta-3.mp4",
    durationInFrames: 460,
    ribbon: "Dá pra ver todas as unidades juntas?",
  },
  {
    kind: "clip",
    id: "fechamento",
    video: "videos/fechamento.mp4",
    durationInFrames: 289,
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
 * O fade final é curto de propósito: a faixa foi cortada para o tempo forte do
 * último compasso cair no quadro 1878, e o fade só entra depois dele.
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
