export const FPS = 30;
// Transition overlap between neighbouring scenes (TransitionSeries).
export const TRANSITION = 12;
export const CARD_FRAMES = 105;
export const END_FRAMES = 90;

// A stretch of the source take that survives the silence cuts.
export type Part = { srcStart: number; from: number; durationInFrames: number };

export type StickerKind =
  | "eye"
  | "doc"
  | "shield"
  | "chip"
  | "database"
  | "check"
  | "live"
  | "megaphone"
  | "ticket"
  | "poll"
  | "chat"
  | "play";

// `at`/`until` are seconds in the source take.
export type Cue =
  | { type: "sticker"; text: string; icon: StickerKind; at: number; until?: number }
  | { type: "name"; at: number }
  | { type: "logo"; at: number }
  | { type: "dashboard"; at: number; until: number }
  | { type: "chips"; items: { text: string; icon: StickerKind; at: number }[] }
  | { type: "comment"; at: number }
  | { type: "next"; at: number };

export type Talk = {
  kind: "talk";
  id: string;
  src: string;
  parts: Part[];
  durationInFrames: number;
  zoom: number;
  cues: Cue[];
};

export type Card = {
  kind: "question";
  id: string;
  number: number;
  question: string;
  durationInFrames: number;
};

export type Scene = Talk | Card;

const talk = (
  id: string,
  speech: [number, number][],
  zoom: number,
  cues: Cue[],
): Talk => {
  const parts: Part[] = [];
  let local = 0;
  for (const [a, b] of speech) {
    const durationInFrames = Math.round((b - a) * FPS);
    parts.push({ srcStart: Math.round(a * FPS), from: local, durationInFrames });
    local += durationInFrames;
  }
  return {
    kind: "talk",
    id,
    src: `videos/qa/${id}.mp4`,
    parts,
    durationInFrames: local,
    zoom,
    cues,
  };
};

// Speech ranges (source seconds) from the Whisper transcript and an energy
// pass: pauses, the off-camera questions and the off-topic chatter at the
// start of IMG_5627 are cut out.
export const scenes: Scene[] = [
  talk(
    "img5620",
    [
      [0.86, 2.58],
      [2.84, 7.68],
    ],
    1,
    [
      { type: "name", at: 1.7 },
      { type: "logo", at: 6.9 },
    ],
  ),
  {
    kind: "question",
    id: "q1",
    number: 1,
    question: "Os clientes sabem que estamos coletando os dados deles?",
    durationInFrames: CARD_FRAMES,
  },
  talk(
    "img5625",
    [
      [5.18, 6.22],
      [6.62, 13.46],
      [13.8, 17.24],
      [17.74, 22.96],
    ],
    1.04,
    [
      { type: "sticker", text: "100% transparente", icon: "eye", at: 8.1 },
      { type: "sticker", text: "Termo de uso", icon: "doc", at: 9.9 },
      { type: "sticker", text: "Conformidade LGPD", icon: "shield", at: 12.8 },
      { type: "sticker", text: "Inteligência embarcada", icon: "chip", at: 15.06 },
      { type: "sticker", text: "Big Data", icon: "database", at: 19.9 },
    ],
  ),
  {
    kind: "question",
    id: "q2",
    number: 2,
    question: "Preciso ter conhecimento técnico para operar a plataforma?",
    durationInFrames: CARD_FRAMES,
  },
  talk(
    "img5627",
    [
      [7.44, 8.92],
      [9.14, 10.42],
      [10.72, 15.32],
      [15.58, 17.96],
      [18.18, 21.62],
      [21.8, 24.94],
    ],
    1.04,
    [
      {
        type: "sticker",
        text: "Sem conhecimento técnico",
        icon: "check",
        at: 7.6,
        until: 11.9,
      },
      { type: "dashboard", at: 12.1, until: 16.3 },
      {
        type: "sticker",
        text: "Dados em tempo real",
        icon: "live",
        at: 16.6,
        until: 20.5,
      },
      {
        type: "chips",
        items: [
          { text: "Campanhas", icon: "megaphone", at: 20.7 },
          { text: "Cupons", icon: "ticket", at: 22.06 },
          { text: "Pesquisas", icon: "poll", at: 22.9 },
        ],
      },
    ],
  ),
  talk(
    "img5629",
    [
      [1.42, 3.02],
      [3.2, 7.2],
    ],
    1.06,
    [
      { type: "comment", at: 1.5 },
      { type: "next", at: 4.75 },
    ],
  ),
];

// Where a transition sits after scene i (none = hard cut).
export const transitionAfter = (i: number): "iris" | "slide" | "cut" | "end" => {
  const scene = scenes[i];
  const next = scenes[i + 1];
  if (!next) return "end";
  if (next.kind === "question") return "iris";
  if (scene.kind === "question") return "slide";
  return "cut";
};

// Absolute start frame of each scene, accounting for transition overlaps.
export const sceneStarts: number[] = [];
{
  let from = 0;
  scenes.forEach((scene, i) => {
    sceneStarts.push(from);
    from += scene.durationInFrames;
    const t = transitionAfter(i);
    if (t === "iris" || t === "slide" || t === "end") from -= TRANSITION;
  });
}

const last = scenes.length - 1;
export const endStart =
  sceneStarts[last] + scenes[last].durationInFrames - TRANSITION;
export const totalDurationInFrames = endStart + END_FRAMES;

// Maps a time in the source take to a frame in the cut scene.
export const toSceneFrame = (scene: Talk, at: number) => {
  const src = at * FPS;
  for (const part of scene.parts) {
    if (src < part.srcStart) return part.from;
    if (src < part.srcStart + part.durationInFrames)
      return part.from + Math.round(src - part.srcStart);
  }
  return scene.durationInFrames;
};
