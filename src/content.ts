export const FPS = 24;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Duração padrão da transição entre blocos; cada bloco pode encurtar a sua. */
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
  /**
   * Transição que entra ANTES deste bloco. A transição sobrepõe as duas
   * sequências com áudio, então ela não pode ser mais longa que o silêncio que
   * sobra no fim do bloco anterior — nos blocos cortados rente à última
   * palavra, ela encurta.
   */
  transitionInFrames?: number;
  /** Tarja de tema, só na abertura. */
  kicker?: string;
  /**
   * Tela cheia por cima do bloco, quando a imagem do take não pode ir ao ar.
   * `at` é o quadro do clipe em que cada item da lista entra.
   */
  cover?: {
    /**
     * Imagem de apoio que segura a primeira metade do bloco. `until` é o
     * quadro em que ela terminou de se dissolver no degradê — o arquivo tem
     * 192 quadros, então a dissolução precisa acabar antes disso.
     */
    video?: { src: string; until: number };
    items: { text: string; at: number }[];
    /**
     * Quadro em que a legenda se cala. Os itens entram exatamente nas
     * fronteiras das legendas que eles repetem, então a partir daí a lista é
     * que carrega o texto, e a faixa de legenda some em vez de dizer a mesma
     * coisa duas vezes na mesma tela.
     */
    captionsUntil?: number;
  };
  /** Janela em que a logomarca sobe, em quadros do clipe. */
  brandMark?: { from: number; to: number };
  /**
   * Continuação do bloco anterior, e não um bloco novo: a barra de progresso
   * junta os dois num traço só. É o caso das duas metades do encerramento,
   * separadas apenas para tirar a respirada do meio.
   */
  joinsPrevious?: boolean;
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
    durationInFrames: 287,
    // A imagem deste take não vai ao ar: ela fala fora do eixo da câmera quase
    // o tempo todo, inclusive nas últimas palavras. O áudio é bom, então o
    // bloco inteiro corre por baixo da tela cheia — primeiro a imagem de
    // apoio, depois o degradê com a lista.
    cover: {
      video: { src: "videos/conexao-cafe.mp4", until: 186 },
      captionsUntil: 171,
      items: [
        { text: "Quem se conecta", at: 171 },
        { text: "Com que frequência", at: 209 },
        { text: "Como o público se comporta", at: 230 },
      ],
    },
  },
  {
    // Cortado no quadro 217, onde ela desvia o olhar assim que fecha a frase, a
    // pedido do cliente. Não sobra silêncio depois da última palavra: o fim do
    // clipe tem um fade de áudio de 0,08 s para a cauda de "negócio" não ser
    // cortada seca.
    id: "parte-2",
    video: "videos/parte-2.mp4",
    durationInFrames: 217,
    // Sobram 5 quadros de silêncio no fim do bloco anterior, e a transição cabe
    // dentro deles.
    transitionInFrames: 5,
    // Sem elemento por cima: é o bloco mais denso de fala do vídeo, e a legenda
    // já carrega a enumeração.
  },
  {
    // Também cortado na última palavra, a pedido: o clipe acaba no quadro 160,
    // onde "relacionamento" termina de decair. O corte cai em silêncio, então
    // aqui não precisou de fade de áudio.
    id: "parte-3",
    video: "videos/parte-3.mp4",
    durationInFrames: 161,
    // O bloco anterior acaba na última palavra, sem silêncio nenhum, então aqui
    // é corte seco: 1 quadro é o mínimo que o TransitionSeries aceita.
    transitionInFrames: 1,
    // A marca sobe quando ela diz o nome dela e sai antes do corte.
    brandMark: { from: 22, to: 128 },
  },
  {
    // O encerramento vem em duas metades porque ela para para respirar entre a
    // pergunta e o convite — 21 quadros de silêncio, piscada e inspiração, que
    // saíram a pedido do cliente.
    //
    // A primeira metade acaba no quadro 163, e não onde a respirada começa: é o
    // último quadro em que ela está de olhos abertos e com a cabeça no lugar,
    // que é o que casa com a abertura da segunda metade.
    id: "encerramento-a",
    video: "videos/encerramento-a.mp4",
    durationInFrames: 164,
    // Corte seco também aqui: a parte 3 agora acaba na última palavra dela.
    transitionInFrames: 1,
  },
  {
    id: "encerramento-b",
    video: "videos/encerramento-b.mp4",
    durationInFrames: 64,
    // Corte seco, não dissolução: ela mexe a cabeça durante a respirada, e
    // qualquer sobreposição das duas metades vira fantasma de dois rostos. Com
    // os quadros escolhidos dos dois lados, o salto lê como corte de edição.
    transitionInFrames: 1,
    joinsPrevious: true,
  },
];

export const OUTRO_FRAMES = 72;

export const transitionBefore = (index: number) =>
  clips[index]?.transitionInFrames ?? TRANSITION_FRAMES;

// Espelha como o TransitionSeries sobrepõe as sequências, para a barra de
// progresso mapear um quadro de volta ao bloco sem refazer a conta.
const durations = [...clips.map((c) => c.durationInFrames), OUTRO_FRAMES];
// transitions[i] é a transição entre a sequência i e a i+1.
const transitions = [
  ...clips.slice(1).map((_, i) => transitionBefore(i + 1)),
  TRANSITION_FRAMES,
];

const starts: number[] = [0];
for (let i = 1; i < durations.length; i++) {
  starts.push(starts[i - 1] + durations[i - 1] - transitions[i - 1]);
}

export const clipRanges = clips.map((c, i) => ({
  start: starts[i],
  end: starts[i] + c.durationInFrames,
}));

/** Um traço por bloco do roteiro, com as continuações somadas ao anterior. */
export const progressRanges = clipRanges.reduce<{ start: number; end: number }[]>(
  (acc, range, i) => {
    if (clips[i].joinsPrevious && acc.length > 0) {
      acc[acc.length - 1] = { start: acc[acc.length - 1].start, end: range.end };
      return acc;
    }
    return [...acc, range];
  },
  [],
);

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  durations.reduce((sum, d) => sum + d, 0) - transitions.reduce((sum, t) => sum + t, 0);

/**
 * Diferente da série de perguntas e respostas, aqui não há card mudo no meio:
 * ela fala do primeiro ao último bloco. A trilha então fica num leito baixo o
 * vídeo inteiro e só abre no encerramento, onde ninguém fala.
 *
 * O fade final é curto de propósito. A faixa é 115 BPM cravados, compasso de
 * 2,08696 s, com o primeiro tempo forte em 0,512 s; cortando 1,9703 s da cabeça,
 * o tempo forte do compasso 23 cai no quadro 1117 — quinze quadros antes do
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
