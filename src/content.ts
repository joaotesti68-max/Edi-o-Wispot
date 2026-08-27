import { footage } from "./footage";

export const FPS = 30;

/**
 * Mapa fala → tomadas. Cada bloco pode juntar mais de um take: são 8 clipes
 * para 5 blocos, então a fala de um bloco às vezes vem partida em dois.
 * Os ids saem do nome do arquivo em footage/raw/ (IMG_7949.MOV → "img-7949").
 */
export const CLIP_IDS = {
  abertura: ["img-7949"],
  prazo: ["img-7952"],
  risco: ["img-7954"],
  time: ["img-7956"],
  fechamento: ["img-7958"],
};

export type VisualKey = "law" | "calendar" | "risk" | "steps" | "clock";

export type Block = {
  id: string;
  clips: string[];
  kicker: string;
  headline: string;
  /** Trecho do headline que recebe destaque na cor da marca. */
  highlight?: string;
  visual: VisualKey;
  nameCard?: string;
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
    script:
      "Faltam poucas semanas para o fim do prazo da nova lei que exige adequação " +
      "em segurança da informação para cartórios. Se você ainda não se preparou, " +
      "esse vídeo é pra você.",
  },
  {
    id: "prazo",
    clips: CLIP_IDS.prazo,
    kicker: "O que a lei exige",
    headline: "Comprovar a adequação entre agosto e outubro",
    highlight: "agosto e outubro",
    visual: "calendar",
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
