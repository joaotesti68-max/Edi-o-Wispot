export const FPS = 30;

// Source clips are already trimmed on disk (see README in this folder for the
// cut points). Frame counts below are the encoded lengths of those files.
export type BlockId = "abertura" | "desenvolvimento-1" | "desenvolvimento-2" | "fechamento";

export type Block = {
  id: BlockId;
  video: string;
  durationInFrames: number;
};

export const TRANSITION_FRAMES = 6;
export const OUTRO_FRAMES = 110;

export const blocks: Block[] = [
  { id: "abertura", video: "hora-premiada/abertura.mp4", durationInFrames: 350 },
  { id: "desenvolvimento-1", video: "hora-premiada/desenvolvimento-1.mp4", durationInFrames: 620 },
  { id: "desenvolvimento-2", video: "hora-premiada/desenvolvimento-2.mp4", durationInFrames: 622 },
  { id: "fechamento", video: "hora-premiada/fechamento.mp4", durationInFrames: 461 },
];

// Measured speech runs inside each trimmed clip, in seconds from the clip's own
// start (RMS gate at -38 dB, gaps under 0.25 s bridged). Overlay cues are timed
// against these so graphics land on the phrase they illustrate.
//
//   abertura           0.15 -> 11.45   (one continuous take)
//   desenvolvimento-1  0.15 ->  6.80 | 7.15 -> 7.65 | 8.00 -> 12.95 | 13.30 -> 18.90 | 19.30 -> 20.40
//   desenvolvimento-2  0.00 ->  5.45 | 5.80 -> 11.95 | 12.50 -> 20.70
//   fechamento         0.20 ->  8.70 | 9.55 -> 11.55 | 11.95 -> 14.90
//
// Cue times are placed by ear-free estimate within those runs: the phrase order
// is known from the script, the exact word boundaries are not.

// Mirrors how TransitionSeries overlaps its sequences, so the progress bar can
// map a block to its on-screen frame range without repeating the maths.
const sequenceDurations = [...blocks.map((b) => b.durationInFrames), OUTRO_FRAMES];

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
}

export const blockRanges = blocks.map((b, i) => ({
  start: starts[i],
  end: starts[i] + b.durationInFrames,
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) -
  TRANSITION_FRAMES * (sequenceDurations.length - 1);
