export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const TRANSITION_FRAMES = 9;

/**
 * A Mari fala num ritmo confortável demais para o formato, então os takes
 * rodam acelerados pelo `playbackRate` do Remotion, que estica o áudio com
 * atempo e deixa o tom onde está.
 *
 * Tudo que foi medido contra a gravação — a duração de cada take aqui e os
 * quadros das legendas em `captions.ts` — continua escrito em quadros da
 * fonte, e é dividido por SPEED na hora de usar. Mudar esta constante
 * re-cronometra o vídeo inteiro. Os cards ficam de fora: tempo de leitura não
 * acelera junto com a fala.
 */
export const SPEED = 1.12;

/** Piso, nunca teto: uma sequência não pode durar mais que a footage dela. */
export const atSpeed = (sourceFrames: number) => Math.floor(sourceFrames / SPEED);

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
  /** Quadros do arquivo em `public/videos`, antes da aceleração. */
  sourceFrames: number;
  durationInFrames: number;
  /** Small ribbon reminding late viewers which question is being answered. */
  ribbon?: string;
  /** Speaker lower third, shown once near the top of the video. */
  nameCard?: { name: string; role: string };
  /** Kicker shown over the opening take. */
  kicker?: string;
};

export type Segment = QuestionCard | Clip;

/**
 * A pergunta sobre receita para provedor saiu desta edição. O take continua em
 * `public/videos/resposta-2.mp4` e as legendas dele em `captions.ts`, então
 * voltar com ele é recolocar os dois segmentos aqui — os `index` dos cards
 * seguintes é que sobem ou descem, porque é o que o espectador lê.
 */
export const segments: Segment[] = [
  {
    kind: "clip",
    id: "abertura",
    video: "videos/abertura.mp4",
    sourceFrames: 184,
    durationInFrames: atSpeed(184),
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
    sourceFrames: 421,
    durationInFrames: atSpeed(421),
    ribbon: "Para quais negócios a Wispot serve?",
  },
  {
    kind: "question",
    id: "pergunta-3",
    index: 2,
    question: "Quais equipamentos funcionam com a Wispot?",
    durationInFrames: 76,
  },
  {
    kind: "clip",
    id: "resposta-3",
    video: "videos/resposta-3.mp4",
    sourceFrames: 366,
    durationInFrames: atSpeed(366),
    ribbon: "Quais equipamentos funcionam?",
  },
  {
    kind: "question",
    id: "pergunta-4",
    index: 3,
    question: "Como saber o que o público acha do meu espaço?",
    durationInFrames: 80,
  },
  {
    kind: "clip",
    id: "resposta-4",
    video: "videos/resposta-4.mp4",
    sourceFrames: 362,
    durationInFrames: atSpeed(362),
    ribbon: "Como saber o que o público acha?",
  },
  {
    kind: "clip",
    id: "fechamento",
    video: "videos/fechamento.mp4",
    sourceFrames: 131,
    durationInFrames: atSpeed(131),
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
 * O fade final é curto de propósito: o tempo forte do último compasso da faixa
 * cai no quadro 1545, quinze quadros antes do fim, e o fade só entra depois
 * dele.
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
