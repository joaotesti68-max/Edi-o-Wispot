import type { IconKind } from "./theme";

export const FPS = 30;
export const END_FRAMES = 105;

// A stretch of the source take that survives the silence cuts.
export type Part = { srcStart: number; from: number; durationInFrames: number };

// `at`/`until` are seconds in the source take.
export type Cue =
  | { type: "sticker"; text: string; icon: IconKind; at: number; until?: number; dark?: boolean }
  | { type: "places"; items: { text: string; icon: IconKind; at: number }[]; until: number }
  | { type: "endpointCard"; at: number; reveal: number }
  | { type: "risks"; items: { text: string; icon: IconKind; at: number }[]; until: number }
  | { type: "riskBanner"; at: number }
  | { type: "cta"; at: number };

export type Scene = {
  id: string;
  src: string;
  parts: Part[];
  durationInFrames: number;
  // "camera": the speaker on screen with overlays. The motion-graphics
  // scenes cover the takes where he reads off camera; only the audio stays.
  mode: "camera" | "antivirus" | "isolate";
  cues: Cue[];
};

const scene = (
  id: string,
  mode: Scene["mode"],
  speech: [number, number][],
  cues: Cue[] = [],
): Scene => {
  const parts: Part[] = [];
  let local = 0;
  for (const [a, b] of speech) {
    const durationInFrames = Math.round((b - a) * FPS);
    parts.push({ srcStart: Math.round(a * FPS), from: local, durationInFrames });
    local += durationInFrames;
  }
  return {
    id,
    src: `videos/endpoint/${id}.mp4`,
    parts,
    durationInFrames: local,
    mode,
    cues,
  };
};

// Speech ranges (source seconds) from the Whisper transcript and an energy
// pass. Take 5 replaces the end of take 4, where "problema" came out garbled.
export const scenes: Scene[] = [
  scene(
    "v1",
    "camera",
    [
      [0.96, 4.12],
      [4.32, 6.02],
      [6.22, 8.34],
    ],
    [
      { type: "sticker", text: "Ataque hacker", icon: "bug", at: 3.1, until: 4.6, dark: true },
      { type: "sticker", text: "Não começa no servidor", icon: "server", at: 4.62, until: 6.25 },
      { type: "sticker", text: "Começa no notebook", icon: "laptop", at: 6.3, dark: true },
    ],
  ),
  scene(
    "v2",
    "camera",
    [
      [3.1, 5.3],
      [5.7, 8.56],
      [8.82, 13.38],
    ],
    [
      {
        type: "places",
        items: [
          { text: "Café", icon: "coffee", at: 5.9 },
          { text: "Casa", icon: "home", at: 6.95 },
          { text: "Escritório", icon: "building", at: 7.9 },
        ],
        until: 9.3,
      },
      { type: "endpointCard", at: 9.35, reveal: 12.7 },
    ],
  ),
  scene(
    "v3",
    "camera",
    [
      [1.3, 8.22],
      [8.4, 9.66],
    ],
    [
      {
        type: "risks",
        items: [
          { text: "Anexo aberto sem querer", icon: "clip", at: 1.9 },
          { text: "Sistema desatualizado", icon: "refresh", at: 3.45 },
          { text: "Equipamento perdido", icon: "lost", at: 5.3 },
        ],
        until: 7.5,
      },
      { type: "riskBanner", at: 7.6 },
    ],
  ),
  scene("v4", "antivirus", [
    [1.55, 3.86],
    [4.08, 7.1],
    [7.33, 12.28],
    [12.5, 14.12],
  ]),
  scene("v5", "isolate", [
    [1.55, 3.22],
    [3.42, 4.32],
    [4.6, 7.74],
  ]),
  scene(
    "v6",
    "camera",
    [
      [1.14, 3.54],
      [3.83, 5.06],
    ],
    [
      { type: "sticker", text: "Sua empresa está protegida?", icon: "shield", at: 1.2, until: 3.8 },
      { type: "cta", at: 3.9 },
    ],
  ),
];

export const sceneStarts: number[] = [];
{
  let from = 0;
  for (const s of scenes) {
    sceneStarts.push(from);
    from += s.durationInFrames;
  }
}

const last = scenes.length - 1;
export const endStart = sceneStarts[last] + scenes[last].durationInFrames;
export const totalDurationInFrames = endStart + END_FRAMES;

// Maps a time in the source take to a frame in the cut scene.
export const toSceneFrame = (s: Scene, at: number) => {
  const src = at * FPS;
  for (const part of s.parts) {
    if (src < part.srcStart) return part.from;
    if (src < part.srcStart + part.durationInFrames)
      return part.from + Math.round(src - part.srcStart);
  }
  return s.durationInFrames;
};
