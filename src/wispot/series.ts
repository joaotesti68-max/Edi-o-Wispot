export const FPS = 24;
export const TRANSITION_FRAMES = 8;
export const OUTRO_FRAMES = 110;

export type Caption = {
  text: string;
  startFrame: number;
  endFrame: number;
};

/**
 * Splits narration into caption cards timed proportionally to each line's
 * word count across the block's duration. There's no forced-alignment
 * transcript for these clips, so this is an even-pace approximation rather
 * than a true speech-synced timing — good enough for steady narration, but
 * worth eyeballing against the audio in studio before publishing.
 */
export const distributeCaptions = (
  lines: string[],
  durationInFrames: number,
  leadIn = 10,
  leadOut = 14,
  gap = 4,
): Caption[] => {
  const wordCounts = lines.map((line) => line.split(/\s+/).filter(Boolean).length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const available = durationInFrames - leadIn - leadOut - gap * (lines.length - 1);

  let cursor = leadIn;
  return lines.map((text, i) => {
    const share = Math.round((wordCounts[i] / totalWords) * available);
    const startFrame = cursor;
    const endFrame = i === lines.length - 1 ? durationInFrames - leadOut : startFrame + share;
    cursor = endFrame + gap;
    return { text, startFrame, endFrame };
  });
};

export type TimedLine = {
  text: string;
  /** Seconds into the ORIGINAL (untrimmed) source clip — from a real
   * transcript or `ffmpeg -af silencedetect` boundaries, not a guess. */
  start: number;
  end: number;
};

/**
 * Converts real transcript timestamps (in the source clip's own timeline)
 * into block-local caption frames, accounting for `trimBefore` and
 * clamping to the block's duration. Use this instead of distributeCaptions
 * whenever actual speech timing is known — it doesn't assume steady,
 * on-script pacing.
 */
export const captionsFromTimestamps = (
  lines: TimedLine[],
  fps: number,
  trimBeforeFrames: number,
  blockDurationInFrames: number,
): Caption[] => {
  const trimBeforeSeconds = trimBeforeFrames / fps;
  return lines.map(({ text, start, end }) => ({
    text,
    startFrame: Math.max(0, Math.round((start - trimBeforeSeconds) * fps)),
    endFrame: Math.min(blockDurationInFrames, Math.round((end - trimBeforeSeconds) * fps)),
  }));
};

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  kicker?: string;
  captions: Caption[];
  /** Trims dead air off the `video` source (in comp-fps frames), so the
   * cut between blocks doesn't land on a silent breath/pause. */
  trimBefore?: number;
  trimAfter?: number;
  termBadge?: { text: string; appearFrame: number };
  /**
   * When set, the block plays this clip full-screen instead of the talking
   * head — `video` still supplies the voiceover track (muted visually) and
   * the demo clip's own audio is muted. `freezeAtFrame` holds the demo's
   * last frame for the remainder of the block if the demo is shorter than
   * the narration.
   */
  demoVideo?: { src: string; freezeAtFrame: number };
  notifications?: {
    icon: string;
    title: string;
    subtitle: string;
    appearFrame: number;
    durationFrames: number;
  }[];
  nameCard?: { name: string; role: string };
};

export type Episode = {
  seriesLabel: string;
  episodeNumber: number;
  episodeTitle: string;
  blocks: Block[];
  endCard: {
    teaserLabel: string;
    teaserText: string;
  };
};

export const buildTimeline = (blocks: Block[]) => {
  const sequenceDurations = [...blocks.map((b) => b.durationInFrames), OUTRO_FRAMES];
  const transitionCount = sequenceDurations.length - 1;

  const starts: number[] = [0];
  for (let i = 1; i < sequenceDurations.length; i++) {
    starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
  }

  const blockRanges = blocks.map((b, i) => ({
    start: starts[i],
    end: starts[i] + b.durationInFrames,
  }));

  const outroRange = {
    start: starts[starts.length - 1],
    end: starts[starts.length - 1] + OUTRO_FRAMES,
  };

  const totalDurationInFrames =
    sequenceDurations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * transitionCount;

  return { blockRanges, outroRange, totalDurationInFrames };
};
