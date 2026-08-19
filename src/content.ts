export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const TRANSITION_FRAMES = 9;

/**
 * The raw takes each opened with João asking the question off-camera, picked up
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
    durationInFrames: 400,
    kicker: "Feature da Semana #3",
    nameCard: { name: "Mari", role: "Time Wispot" },
  },
  {
    kind: "question",
    id: "pergunta-1",
    index: 1,
    question: "Quanto tempo leva pra implantar?",
    durationInFrames: 75,
  },
  {
    kind: "clip",
    id: "resposta-1",
    video: "videos/resposta-1.mp4",
    durationInFrames: 325,
    ribbon: "Quanto tempo leva pra implantar?",
  },
  {
    kind: "question",
    id: "pergunta-2",
    index: 2,
    question: "Meu cliente vai precisar baixar algum aplicativo pra conectar?",
    durationInFrames: 96,
  },
  {
    kind: "clip",
    id: "resposta-2",
    video: "videos/resposta-2.mp4",
    durationInFrames: 388,
    ribbon: "Precisa baixar aplicativo?",
  },
  {
    kind: "clip",
    id: "fechamento",
    video: "videos/fechamento.mp4",
    durationInFrames: 233,
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
