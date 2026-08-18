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

/** A mid-clip edit: removes [start, end) (seconds, original clip time) —
 * e.g. cutting one redundant word out of a sentence. */
export type Cut = { start: number; end: number };

const shiftForCuts = (seconds: number, cutsFrames: { start: number; end: number }[], fps: number) => {
  let shiftedFrame = Math.round(seconds * fps);
  for (const cut of cutsFrames) {
    if (shiftedFrame <= cut.start) continue;
    shiftedFrame -= Math.min(shiftedFrame, cut.end) - cut.start;
  }
  return shiftedFrame;
};

/**
 * Converts real transcript timestamps (in the source clip's own timeline)
 * into block-local caption frames, accounting for `trimBefore`, mid-clip
 * `cuts`, and clamping to the block's duration. Use this instead of
 * distributeCaptions whenever actual speech timing is known — it doesn't
 * assume steady, on-script pacing.
 */
export const captionsFromTimestamps = (
  lines: TimedLine[],
  fps: number,
  trimBeforeFrames: number,
  blockDurationInFrames: number,
  cuts: Cut[] = [],
): Caption[] => {
  const cutsFrames = cuts
    .map((c) => ({ start: Math.round(c.start * fps), end: Math.round(c.end * fps) }))
    .sort((a, b) => a.start - b.start);
  const toLocalFrame = (seconds: number) => shiftForCuts(seconds, cutsFrames, fps) - trimBeforeFrames;

  return lines.map(({ text, start, end }) => ({
    text,
    startFrame: Math.max(0, toLocalFrame(start)),
    endFrame: Math.min(blockDurationInFrames, toLocalFrame(end)),
  }));
};

/**
 * Splits a clip's playable range into the audio/video segments left after
 * removing `cuts` (in frames, original clip time), each with the
 * block-local frame range it should occupy. Segments play back to back
 * with no gap — a straight cut, no crossfade.
 */
export const buildCutSegments = (trimBeforeFrames: number, trimAfterFrames: number, cuts: Cut[], fps: number) => {
  const cutsFrames = cuts
    .map((c) => ({ start: Math.round(c.start * fps), end: Math.round(c.end * fps) }))
    .sort((a, b) => a.start - b.start);

  const segments: { originalStart: number; originalEnd: number }[] = [];
  let cursor = trimBeforeFrames;
  for (const cut of cutsFrames) {
    segments.push({ originalStart: cursor, originalEnd: cut.start });
    cursor = cut.end;
  }
  segments.push({ originalStart: cursor, originalEnd: trimAfterFrames });

  let localFrom = 0;
  return segments
    .filter((s) => s.originalEnd > s.originalStart)
    .map((s) => {
      const durationInFrames = s.originalEnd - s.originalStart;
      const segment = { ...s, from: localFrom, durationInFrames };
      localFrom += durationInFrames;
      return segment;
    });
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
  /** Mid-clip edits — removes a word/phrase from the middle of the take
   * (see buildCutSegments). Seconds, original clip time. */
  cuts?: Cut[];
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
