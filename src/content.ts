export const FPS = 24;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const TRANSITION_FRAMES = 8;

/**
 * Os takes entram na velocidade de gravação. A série anterior acelerava a fala
 * em 12% porque a narração vinha num andamento confortável demais para o
 * formato; aqui ela já sai em ~195 palavras por minuto, e esticar mais
 * atropelaria as pausas que separam as partes do roteiro.
 */

export type Clip = {
  id: string;
  video: string;
  /** Quadros do arquivo em `public/videos`, a 24 fps. */
  durationInFrames: number;
  /** Tarja de tema, só na abertura. */
  kicker?: string;
  /**
   * Itens que se acumulam enquanto ela enumera. `at` é o quadro do clipe em
   * que cada um entra, tirado da fronteira da legenda correspondente.
   */
  chips?: { text: string; at: number }[];
  /** Janela em que a logomarca sobe, em quadros do clipe. */
  brandMark?: { from: number; to: number };
};

/**
 * Cinco takes, um por bloco do roteiro. A ordem é a da gravação: os arquivos
 * IMG_8889, 8892, 8893, 8896 e 8898 saíram do celular nessa sequência.
 */
export const clips: Clip[] = [
  {
    id: "abertura",
    video: "videos/abertura.mp4",
    durationInFrames: 191,
    kicker: "Wi-Fi inteligente",
  },
  {
    id: "parte-1",
    video: "videos/parte-1.mp4",
    durationInFrames: 292,
    // Ela lista três coisas que o Wi-Fi inteligente enxerga. Os itens ficam de
    // pé depois de entrar: "com que frequência" dura menos de um segundo na
    // fala, e sozinho na tela não daria tempo de ler.
    chips: [
      { text: "quem se conecta", at: 171 },
      { text: "com que frequência", at: 209 },
      { text: "como o público se comporta", at: 230 },
    ],
  },
  {
    id: "parte-2",
    video: "videos/parte-2.mp4",
    durationInFrames: 228,
    // Sem elemento por cima: é o bloco mais denso de fala do vídeo, e a
    // legenda já carrega a enumeração.
  },
  {
    id: "parte-3",
    video: "videos/parte-3.mp4",
    durationInFrames: 171,
    // A marca sobe quando ela diz o nome dela e sai antes do corte.
    brandMark: { from: 22, to: 128 },
  },
  {
    id: "encerramento",
    video: "videos/encerramento.mp4",
    durationInFrames: 239,
  },
];

export const OUTRO_FRAMES = 72;

// Espelha como o TransitionSeries sobrepõe as sequências, para a barra de
// progresso mapear um quadro de volta ao bloco sem refazer a conta.
const durations = [...clips.map((c) => c.durationInFrames), OUTRO_FRAMES];

const starts: number[] = [0];
for (let i = 1; i < durations.length; i++) {
  starts.push(starts[i - 1] + durations[i - 1] - TRANSITION_FRAMES);
}

export const clipRanges = clips.map((c, i) => ({
  start: starts[i],
  end: starts[i] + c.durationInFrames,
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  durations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * (durations.length - 1);

/**
 * Diferente da série de perguntas e respostas, aqui não há card mudo no meio:
 * ela fala do primeiro ao último bloco. A trilha então fica num leito baixo o
 * vídeo inteiro e só abre no encerramento, onde ninguém fala.
 *
 * O fade final é curto de propósito. A faixa é 115 BPM cravados, compasso de
 * 2,08696 s, com o primeiro tempo forte em 0,512 s; cortando 1,0953 s da cabeça,
 * o tempo forte do compasso 23 cai no quadro 1138 — quinze quadros antes do
 * fim. O vídeo fecha em cima da batida, e o fade entra depois dela.
 */
const MUSIC_DUCKED = 0.09;
const MUSIC_OPEN = 0.38;
const MUSIC_RAMP = 8;
const MUSIC_FADE_OUT = 12;

export const musicVolume = {
  frames: [0, outroRange.start - MUSIC_RAMP, outroRange.start + MUSIC_RAMP, totalDurationInFrames],
  volumes: [MUSIC_DUCKED, MUSIC_DUCKED, MUSIC_OPEN, MUSIC_OPEN],
  fadeOutFrom: totalDurationInFrames - MUSIC_FADE_OUT,
};
