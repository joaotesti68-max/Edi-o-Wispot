export const FPS = 30;
export const END_FRAMES = 105;

// A stretch of the source take that survives the silence cuts.
export type Part = { srcStart: number; from: number; durationInFrames: number };

// Seconds in the source take. Each cue acts out what is being said
// rather than spelling it out.
export type Cue =
  | { type: "attack"; at: number; server: number; laptop: number; until: number }
  | { type: "map"; at: number; stops: [number, number, number]; until: number }
  | { type: "orbit"; at: number; endpoints: number }
  | { type: "risk"; at: number; update: number; lost: number; spread: number }
  | { type: "scan"; at: number; until: number }
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
    [{ type: "attack", at: 2.9, server: 4.62, laptop: 6.3, until: 8.34 }],
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
      { type: "map", at: 4.0, stops: [5.9, 6.95, 7.9], until: 8.9 },
      { type: "orbit", at: 8.95, endpoints: 12.7 },
    ],
  ),
  scene(
    "v3",
    "camera",
    [
      [1.3, 8.22],
      [8.4, 9.66],
    ],
    [{ type: "risk", at: 1.75, update: 3.4, lost: 5.25, spread: 7.55 }],
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
      { type: "scan", at: 1.2, until: 3.8 },
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
