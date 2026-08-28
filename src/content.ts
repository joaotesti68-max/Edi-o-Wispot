import { footage } from "./footage";
import type { TakeoverWindow } from "./Takeover";

export const FPS = 30;

/**
 * Mapa fala → tomadas. Os clipes são o roteiro lido em ordem, uma frase por
 * take (o 7949 carrega a abertura inteira). Confere pelo ritmo: cada take
 * cai entre 1,9 e 3,3 palavras por segundo, agrupado em 2,6.
 * Os ids saem do nome do arquivo em footage/raw/ (IMG_7949.MOV → "img-7949").
 */
export const CLIP_IDS = {
  // "Faltam poucas semanas..." + "Se você ainda não se preparou..."
  abertura: ["img-7949"],
  // "A lei exige que cartórios comprovem essa adequação entre agosto e outubro."
  prazo: ["img-7952"],
  // "Depois deste prazo, o risco de penalidade e de auditoria aumenta."
  risco: ["img-7954"],
  // "Nosso time já está preparado..." + "do levantamento de risco até a
  // documentação final," + "sem parar a operação no dia a dia."
  time: ["img-7956", "img-7958", "img-7959"],
  // "O prazo não espera." + "Fale com a gente agora, agende seu diagnóstico..."
  fechamento: ["img-7960", "img-7963"],
};

export type VisualKey = "law" | "classes" | "risk" | "steps" | "clock";

export type Block = {
  id: string;
  clips: string[];
  kicker: string;
  headline: string;
  /** Trecho do headline que recebe destaque na cor da marca. */
  highlight?: string;
  visual: VisualKey;
  nameCard?: string;
  /**
   * Trecho em que o gráfico estoura em tela cheia, em frames relativos ao
   * bloco. Usado onde o João desvia o olhar da câmera.
   */
  takeover?: TakeoverWindow;
  /** Fala correspondente no roteiro — referência de edição, não vai à tela. */
  script: string;
};

export const OUTRO_FRAMES = 105;
export const TRANSITION_FRAMES = 9;

export const blocks: Block[] = [
  {
    id: "abertura",
    clips: CLIP_IDS.abertura,
    kicker: "Nova lei · Cartórios",
    headline: "Faltam poucas semanas para o fim do prazo",
    highlight: "poucas semanas",
    visual: "law",
    nameCard: "João Dourado",
    // O João aparece só nos 2s iniciais, o suficiente para o público ver quem
    // fala; daí em diante a imagem passa para o ambiente e não volta — "to"
    // fica além dos 297 frames do bloco de propósito.
    // Os tempos acompanham as duas frases: com o silêncio entre elas cortado,
    // a segunda começa no frame 194, e o texto vira exatamente na emenda.
    takeover: {
      from: 60,
      to: 310,
      beats: [
        {
          at: 60,
          kicker: "Adequação obrigatória",
          headline: "Segurança da informação em cartórios",
          clip: "videos/ambiente-monitoramento.mp4",
        },
        {
          at: 194,
          kicker: "Última chamada",
          headline: "Se você ainda não se preparou",
          clip: "videos/ambiente-cartorio.mp4",
        },
      ],
    },
    script:
      "Faltam poucas semanas para o fim do prazo da nova lei que exige adequação " +
      "em segurança da informação para cartórios. Se você ainda não se preparou, " +
      "esse vídeo é pra você.",
  },
  {
    id: "prazo",
    clips: CLIP_IDS.prazo,
    kicker: "Prazo de adequação",
    headline: "O limite depende da classe do cartório",
    highlight: "classe do cartório",
    visual: "classes",
    script: "A lei exige que cartórios comprovem essa adequação entre agosto e outubro deste ano.",
  },
  {
    id: "risco",
    clips: CLIP_IDS.risco,
    kicker: "Depois do prazo",
    headline: "O risco de penalidade e auditoria aumenta",
    highlight: "aumenta",
    visual: "risk",
    script: "Depois deste prazo, o risco de penalidade e de auditoria aumenta.",
  },
  {
    id: "time",
    clips: CLIP_IDS.time,
    kicker: "Como a gente conduz",
    headline: "Do levantamento de risco à documentação final",
    highlight: "documentação final",
    visual: "steps",
    script:
      "Nosso time já está preparado pra conduzir esse processo com o seu cartório, " +
      "do levantamento de risco até a documentação final, sem parar a operação no dia a dia.",
  },
  {
    id: "fechamento",
    clips: CLIP_IDS.fechamento,
    kicker: "Última chamada",
    headline: "O prazo não espera",
    highlight: "não espera",
    visual: "clock",
    script:
      "O prazo não espera. Fale com a gente agora, agende seu diagnóstico e " +
      "feche essa adequação antes que seja tarde.",
  },
];

export const clipsFor = (block: Block) =>
  block.clips.map((id) => {
    const clip = footage[id];
    if (!clip) {
      throw new Error(
        `Clipe "${id}" não existe em src/footage.ts. ` +
          `Coloque o arquivo em footage/raw/ e rode "npm run footage".`,
      );
    }
    return clip;
  });

/** Duração do bloco = só os trechos de fala, já sem os silêncios longos. */
export const blockDuration = (block: Block) =>
  clipsFor(block).reduce(
    (total, clip) =>
      total + clip.segments.reduce((sum, s) => sum + (s.trimAfter - s.trimBefore), 0),
    0,
  );

/**
 * Frame em que cada take começa dentro do bloco. Permite que um gráfico
 * acompanhe a virada de fala em vez de rodar num tempo fixo.
 */
export const takeStartsFor = (block: Block) => {
  const starts: number[] = [];
  let at = 0;
  for (const clip of clipsFor(block)) {
    starts.push(at);
    at += clip.segments.reduce((sum, s) => sum + (s.trimAfter - s.trimBefore), 0);
  }
  return starts;
};

// Espelha como o TransitionSeries sobrepõe as sequências, para a barra de
// progresso saber a faixa de frames de cada bloco sem repetir a conta.
const sequenceDurations = [...blocks.map(blockDuration), OUTRO_FRAMES];
const transitionCount = sequenceDurations.length - 1;

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
}

export const blockRanges = blocks.map((block, i) => ({
  start: starts[i],
  end: starts[i] + blockDuration(block),
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * transitionCount;
