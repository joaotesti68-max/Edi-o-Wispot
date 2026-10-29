export const FPS = 30;
// Transition overlap between neighbouring scenes (TransitionSeries).
export const TRANSITION = 12;
export const END_FRAMES = 90;

// A stretch of the source take that survives the silence cuts.
// `src` is set when a part comes from another take than the scene's own.
export type Part = {
  srcStart: number;
  from: number;
  durationInFrames: number;
  src?: string;
};

export type IconKind =
  | "chat"
  | "pin"
  | "sparkle"
  | "help"
  | "wifi"
  | "star"
  | "check"
  | "live";

// `at`/`until` are seconds in the source take.
export type Cue =
  | { type: "question"; at: number; until?: number }
  | { type: "sticker"; text: string; icon: IconKind; at: number; until?: number }
  | { type: "logo"; at: number; until?: number; tagline?: string }
  | { type: "review"; at: number; until: number }
  | { type: "cta"; at: number }
  | { type: "flow"; at: number; to: number };

export type Talk = {
  kind: "talk";
  id: string;
  src: string;
  parts: Part[];
  durationInFrames: number;
  cues: Cue[];
};

// The "Funciona assim" take: she shrinks into a bubble while the phone and
// dashboard graphics play, and comes back full frame for the topics.
export type HowTo = Omit<Talk, "kind" | "cues"> & { kind: "howto" };

export type Scene = Talk | HowTo;

const talk = (
  id: string,
  speech: ([number, number] | [number, number, string])[],
  cues: Cue[],
): Talk => {
  const parts: Part[] = [];
  let local = 0;
  for (const [a, b, src] of speech) {
    const durationInFrames = Math.round((b - a) * FPS);
    parts.push({ srcStart: Math.round(a * FPS), from: local, durationInFrames, src });
    local += durationInFrames;
  }
  return {
    kind: "talk",
    id,
    src: `videos/wiquest/${id}.mp4`,
    parts,
    durationInFrames: local,
    cues,
  };
};

// Speech ranges (source seconds) from the Whisper transcript and a silence
// pass. Takes follow the "WiQuest na prática" script; the alternate takes
// (IMG_9945/46/50/57/68/70 first half) are left out. IMG_9962 is cut off
// mid "em um painel", so its second half comes from the re-recorded take
// (audio only, second "Você pode perguntar" attempt).
export const FUNCIONA_V2 = "videos/wiquest/funciona-v2.m4a";
export const scenes: Scene[] = [
  talk(
    "img9947",
    [[2.0, 6.85]],
    [
      { type: "question", at: 2.06, until: 3.9 },
      { type: "sticker", text: "A opinião do cliente", icon: "chat", at: 4.02 },
      { type: "sticker", text: "Durante a visita", icon: "pin", at: 5.0 },
    ],
  ),
  talk(
    "img9958",
    [[1.95, 5.9]],
    [{ type: "logo", at: 2.36, tagline: "Pesquisas da Wispot" }],
  ),
  {
    ...talk(
      "img9962",
      [
        [1.25, 2.2],
        [2.4, 3.95],
        [4.2, 10.45],
        // the rest from the re-recorded take, which finishes the line
        [3.15, 5.33, FUNCIONA_V2],
        [5.5, 7.72, FUNCIONA_V2],
        [8.0, 11.7, FUNCIONA_V2],
      ],
      [],
    ),
    kind: "howto",
  },
  talk(
    "img9967",
    [
      [1.4, 6.2],
      [6.45, 8.1],
    ],
    [
      { type: "review", at: 4.9, until: 6.45 },
      { type: "logo", at: 6.72, tagline: "Isso muda!" },
    ],
  ),
  talk(
    "img9970",
    [[6.05, 12.45]],
    [
      { type: "sticker", text: "Melhore a experiência", icon: "sparkle", at: 7.94 },
      { type: "sticker", text: "Tire dúvidas na hora", icon: "help", at: 9.46 },
      { type: "sticker", text: "Enquanto ele está lá", icon: "pin", at: 10.5 },
    ],
  ),
  talk(
    "img9971",
    [[1.2, 6.5]],
    [
      { type: "cta", at: 1.2 },
      { type: "flow", at: 2.7, to: 4.82 },
    ],
  ),
];

// Scenes butt-cut so her lines never overlap; a brand wipe drawn over each
// cut is the transition. Only the end card overlaps (iris).
export const transitionAfter = (i: number): "wipe" | "end" =>
  i + 1 < scenes.length ? "wipe" : "end";

// Absolute start frame of each scene, accounting for transition overlaps.
export const sceneStarts: number[] = [];
{
  let from = 0;
  scenes.forEach((scene, i) => {
    sceneStarts.push(from);
    from += scene.durationInFrames;
    if (transitionAfter(i) === "end") from -= TRANSITION;
  });
}

const last = scenes.length - 1;
export const endStart =
  sceneStarts[last] + scenes[last].durationInFrames - TRANSITION;
export const totalDurationInFrames = endStart + END_FRAMES;

// Maps a time in the source take to a frame in the cut scene.
// `take` picks the parts of one source when a scene mixes takes.
export const toSceneFrame = (
  scene: Pick<Talk, "parts" | "durationInFrames">,
  at: number,
  take?: string,
) => {
  const src = at * FPS;
  for (const part of scene.parts) {
    if (part.src !== take) continue;
    if (src < part.srcStart) return part.from;
    if (src < part.srcStart + part.durationInFrames)
      return part.from + Math.round(src - part.srcStart);
  }
  return scene.durationInFrames;
};
