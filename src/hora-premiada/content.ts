export const FPS = 30;

// Source clips are already trimmed on disk (see README in this folder for the
// cut points). Frame counts below are the encoded lengths of those files.
export type ClipId =
  | "abertura"
  | "desenvolvimento-1"
  | "desenvolvimento-2"
  | "fechamento-a"
  | "fechamento-b";

export type Clip = {
  id: ClipId;
  video: string;
  durationInFrames: number;
  /** Join straight to the previous clip instead of dissolving into it. */
  hardCut?: boolean;
  /** Base scale on the footage, used to reframe across a hard cut. */
  zoom?: number;
};

export const TRANSITION_FRAMES = 6;
export const OUTRO_FRAMES = 110;

export const clips: Clip[] = [
  { id: "abertura", video: "hora-premiada/abertura.mp4", durationInFrames: 350 },
  { id: "desenvolvimento-1", video: "hora-premiada/desenvolvimento-1.mp4", durationInFrames: 620 },
  { id: "desenvolvimento-2", video: "hora-premiada/desenvolvimento-2.mp4", durationInFrames: 622 },
  { id: "fechamento-a", video: "hora-premiada/fechamento-a.mp4", durationInFrames: 273 },
  // The fumbled middle of the take is cut out between these two halves. A
  // dissolve would draw attention to the join, so it cuts straight and the
  // slight punch-in sells it as a change of framing.
  {
    id: "fechamento-b",
    video: "hora-premiada/fechamento-b.mp4",
    durationInFrames: 108,
    hardCut: true,
    zoom: 1.1,
  },
];

export const clipById = Object.fromEntries(clips.map((c) => [c.id, c])) as Record<ClipId, Clip>;

// Measured speech runs inside each trimmed clip, in seconds from the clip's own
// start (RMS gate at -38 dB, gaps under 0.25 s bridged). Overlay cues are timed
// against these so graphics land on the phrase they illustrate.
//
//   abertura           0.15 -> 11.45   (one continuous take)
//   desenvolvimento-1  0.15 ->  6.80 | 7.15 -> 7.65 | 8.00 -> 12.95 | 13.30 -> 18.90 | 19.30 -> 20.40
//   desenvolvimento-2  0.00 ->  5.45 | 5.80 -> 11.95 | 12.50 -> 20.70
//   fechamento-a       0.20 ->  8.70
//   fechamento-b       0.20 ->  3.15
//
// Cue times are placed by ear-free estimate within those runs: the phrase order
// is known from the script, the exact word boundaries are not.

const sequenceDurations = [...clips.map((c) => c.durationInFrames), OUTRO_FRAMES];
// Every sequence dissolves into the previous one except those marked hardCut;
// the outro always dissolves.
const overlaps: number[] = sequenceDurations.map((_, i) =>
  i === 0 || clips[i]?.hardCut ? 0 : TRANSITION_FRAMES,
);

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - overlaps[i]);
}

export const clipStarts = starts;

// The progress bar tracks the four script blocks, so the two halves of the
// fechamento count as one chapter.
const chapterClips: ClipId[][] = [
  ["abertura"],
  ["desenvolvimento-1"],
  ["desenvolvimento-2"],
  ["fechamento-a", "fechamento-b"],
];

export const chapterRanges = chapterClips.map((ids) => {
  const first = clips.findIndex((c) => c.id === ids[0]);
  const last = clips.findIndex((c) => c.id === ids[ids.length - 1]);
  return { start: starts[first], end: starts[last] + clips[last].durationInFrames };
});

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) - overlaps.reduce((sum, o) => sum + o, 0);
