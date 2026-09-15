export const FPS = 24;
export const TRANSITION_FRAMES = 8;
export const END_CARD_FRAMES = 96;

export type Clip = {
  id: string;
  video: string;
  /** Frames trimmed off the head of the source file (dead air before she speaks). */
  trimBefore: number;
  /** Frame of the source file where the clip ends (dead air after she stops). */
  trimAfter: number;
};

export const clips: Clip[] = [
  { id: "img-8288", video: "videos/youtube/img-8288.mp4", trimBefore: 42, trimAfter: 283 },
  { id: "img-8290", video: "videos/youtube/img-8290.mp4", trimBefore: 11, trimAfter: 360 },
  { id: "img-8292", video: "videos/youtube/img-8292.mp4", trimBefore: 5, trimAfter: 782 },
  { id: "img-8295", video: "videos/youtube/img-8295.mp4", trimBefore: 5, trimAfter: 208 },
];

export const clipDurations = clips.map((c) => c.trimAfter - c.trimBefore);

// Mirrors how TransitionSeries overlaps its sequences, so the progress bar can
// map each clip to its on-screen frame range without redoing the math.
const sequenceDurations = [...clipDurations, END_CARD_FRAMES];

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
}

export const segmentRanges = sequenceDurations.map((duration, i) => ({
  start: starts[i],
  end: starts[i] + duration,
}));

export const endCardStart = starts[starts.length - 1];

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) -
  TRANSITION_FRAMES * (sequenceDurations.length - 1);
