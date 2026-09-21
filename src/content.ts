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
/**
 * `transitionIn` é a transição que entra nesta sequência. Fica no segmento, e
 * não numa constante só, porque nem toda emenda pede o mesmo tempo.
 */
export type QuestionCard = {
  kind: "question";
  id: string;
  index: number;
  question: string;
  durationInFrames: number;
  transitionIn?: number;
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
  /**
   * Marca do produto que sobe enquanto ela fala dele. A janela é em quadros da
   * gravação, como as legendas, e é dividida por SPEED na hora de usar.
   */
  productMark?: { src: string; ratio: number; from: number; to: number };
  transitionIn?: number;
  /**
   * Enquadramento um pouco mais fechado neste take. Serve para emendar dois
   * takes iguais sem que a emenda leia como falha.
   */
  punchIn?: number;
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
    question: "Como saber a opinião do público que frequenta meu espaço?",
    durationInFrames: 92,
  },
  {
    kind: "clip",
    id: "resposta-4",
    video: "videos/resposta-4.mp4",
    sourceFrames: 362,
    durationInFrames: atSpeed(362),
    ribbon: "Como saber a opinião do público?",
    // Sobe logo que ela diz "Com a WiQuest" e sai antes do fim da resposta,
    // para a marca não virar mobília.
    productMark: { src: "brand/wiquest-color.png", ratio: 1834 / 538, from: 8, to: 240 },
  },
  {
    kind: "clip",
    id: "fechamento",
    video: "videos/fechamento.mp4",
    sourceFrames: 131,
    durationInFrames: atSpeed(131),
    // Única emenda do vídeo entre dois takes dela: em todas as outras entra um
    // card no meio. Com o mesmo enquadramento dos dois lados, o fade padrão
    // lê como falha de reprodução em vez de transição. O dissolve dobra de
    // tempo e o take entra mais fechado, então a troca aparece como mudança de
    // plano — e fechar o quadro na hora da chamada ainda ajuda o recado.
    transitionIn: 18,
    punchIn: 1.08,
  },
];

export const OUTRO_FRAMES = 90;

// Mirrors how TransitionSeries overlaps its sequences, so the progress bar can
// map a frame back to its segment without redoing the transition math.
const durations = [...segments.map((s) => s.durationInFrames), OUTRO_FRAMES];

/** A transição que entra em cada sequência. A primeira não tem; o encerramento
 *  usa o padrão, porque `segments` acaba antes dele. */
const transitions = durations.map((_, i) =>
  i === 0 ? 0 : (segments[i]?.transitionIn ?? TRANSITION_FRAMES),
);

const starts: number[] = [0];
for (let i = 1; i < durations.length; i++) {
  starts.push(starts[i - 1] + durations[i - 1] - transitions[i]);
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
  durations.reduce((sum, d) => sum + d, 0) - transitions.reduce((sum, t) => sum + t, 0);

/**
 * A trilha se abre nos cards e no encerramento, onde ninguém fala, e recua para
 * um leito discreto por baixo da Mari. Sem isso ela ou some no vídeo inteiro ou
 * briga com a voz.
 *
 * O fade final é curto de propósito: o tempo forte do último compasso da faixa
 * cai no quadro 1548, quinze quadros antes do fim, e o fade só entra depois
 * dele.
 */
const MUSIC_DUCKED = 0.09;
const MUSIC_OPEN = 0.38;
const MUSIC_FADE_OUT = 12;
/** Recuo da rampa para dentro da sobreposição, em cada ponta. */
const MUSIC_INSET = 1;

/** Cards e encerramento abertos; os takes dela, abafados. */
const volumeAt = (i: number) =>
  (i < segments.length ? segments[i].kind === "question" : true) ? MUSIC_OPEN : MUSIC_DUCKED;

const musicKeyframes: { frame: number; volume: number }[] = [
  { frame: 0, volume: volumeAt(0) },
];
for (let i = 1; i < durations.length; i++) {
  // A rampa cai dentro da sobreposição da transição, onde a mudança de volume
  // passa despercebida. Ela acompanha o tamanho da sobreposição em vez de um
  // número fixo: numa transição mais longa, uma rampa fixa acabaria antes do
  // platô anterior começar, e a lista de quadros deixaria de ser crescente.
  musicKeyframes.push({ frame: starts[i] + MUSIC_INSET, volume: volumeAt(i - 1) });
  musicKeyframes.push({
    frame: starts[i - 1] + durations[i - 1] - MUSIC_INSET,
    volume: volumeAt(i),
  });
}

export const musicVolume = {
  frames: musicKeyframes.map((k) => k.frame),
  volumes: musicKeyframes.map((k) => k.volume),
  fadeOutFrom: totalDurationInFrames - MUSIC_FADE_OUT,
};
