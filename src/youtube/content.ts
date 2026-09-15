export const FPS = 24;
export const TRANSITION_FRAMES = 8;
export const END_CARD_FRAMES = 96;

/** Speeds the takes up so the delivery is snappier. Audio keeps its pitch. */
export const PLAYBACK_RATE = 1.12;

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
  { id: "img-8292", video: "videos/youtube/img-8292.mp4", trimBefore: 0, trimAfter: 742 },
  { id: "img-8295", video: "videos/youtube/img-8295.mp4", trimBefore: 5, trimAfter: 208 },
];

/** Source frames play back faster, so each clip occupies fewer timeline frames. */
export const clipDurations = clips.map((c) =>
  Math.floor((c.trimAfter - c.trimBefore) / PLAYBACK_RATE),
);

// Mirrors how TransitionSeries overlaps its sequences, so the progress bar and
// the overlays can map each clip to its on-screen frame range.
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

/**
 * When the YouTube logo and the thumbnails rise over the footage. Parked on the
 * closing take — move this if she name-drops the channel somewhere else.
 */
export const YOUTUBE_POP_START = starts[3] + 10;
export const YOUTUBE_POP_FRAMES = 96;

/** The channel screen recording floated over the second take. */
export const CHANNEL_SCROLL_START = starts[1] + 26;
export const CHANNEL_SCROLL_FRAMES = 206;

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) -
  TRANSITION_FRAMES * (sequenceDurations.length - 1);
