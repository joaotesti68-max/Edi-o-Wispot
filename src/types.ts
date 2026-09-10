export type IconKey =
  | "alert"
  | "server"
  | "shield"
  | "trending"
  | "chat"
  | "truck"
  | "radar"
  | "restore"
  | "box"
  | "people"
  | "network"
  | "lock";

export type Clip = {
  src: string;
  durationInFrames: number;
  /**
   * Ease into this one instead of cutting: it keeps the framing of the clip
   * before it, over a longer dissolve. For a splice landing on a word, where a
   * straight cut plus a change of framing reads as a mistake. The overlap is
   * taken off the END of the previous clip, so that clip needs picture to
   * spare after its last word or the dissolve lands on the word itself.
   */
  soft?: boolean;
};

/**
 * A node of a full-screen system overlay. `at` counts from the start of its
 * overlay; `x`/`y` are fractions of the frame.
 */
export type SystemNode = {
  label: string;
  icon: IconKey;
  at: number;
  x: number;
  y: number;
};

/** An animation that fills the frame over the footage, without cutting away. */
export type Overlay =
  | { kind: "route"; at: number; durationInFrames: number }
  | { kind: "attack"; at: number; durationInFrames: number }
  | { kind: "system"; at: number; durationInFrames: number; nodes: SystemNode[] };

export type Block = {
  id: string;
  /** Single clip (legacy) or a run of hard cuts sharing one headline. */
  video?: string;
  clips?: Clip[];
  durationInFrames: number;
  /** Omitted where the animation carries the block on its own. */
  headline?: string;
  icon: IconKey;
  nameCard?: string;
  overlays?: Overlay[];
};

export type Range = { start: number; end: number };

/** Overlap between fragments inside a block — enough to soften a jump cut. */
export const CLIP_TRANSITION_FRAMES = 4;
export const SOFT_CLIP_TRANSITION_FRAMES = 12;

export const transitionBefore = (clip: Clip) =>
  clip.soft ? SOFT_CLIP_TRANSITION_FRAMES : CLIP_TRANSITION_FRAMES;

/** Start frame of each clip inside its block, accounting for that overlap. */
export const clipStarts = (clips: Clip[]) => {
  const starts = [0];
  for (let i = 1; i < clips.length; i++) {
    starts.push(starts[i - 1] + clips[i - 1].durationInFrames - transitionBefore(clips[i]));
  }
  return starts;
};

/**
 * Which fragments play punched in. Alternating hides a jump cut between two
 * identical framings, but a soft splice wants the framing held instead.
 */
export const framingOf = (clips: Clip[]) => {
  const tight = [false];
  for (let i = 1; i < clips.length; i++) tight.push(clips[i].soft ? tight[i - 1] : !tight[i - 1]);
  return tight;
};

/**
 * Mirrors how @remotion/transitions/TransitionSeries lays out overlapping
 * sequences, so a progress bar can know each block's on-screen frame range
 * without duplicating the transition math.
 */
export const buildTimeline = (
  blockDurations: number[],
  outroFrames: number,
  transitionFrames: number,
) => {
  const sequenceDurations = [...blockDurations, outroFrames];
  const transitionCount = sequenceDurations.length - 1;

  const starts: number[] = [0];
  for (let i = 1; i < sequenceDurations.length; i++) {
    starts.push(starts[i - 1] + sequenceDurations[i - 1] - transitionFrames);
  }

  const blockRanges: Range[] = blockDurations.map((d, i) => ({
    start: starts[i],
    end: starts[i] + d,
  }));

  const outroStart = starts[starts.length - 1];

  return {
    blockRanges,
    outroRange: { start: outroStart, end: outroStart + outroFrames },
    totalDurationInFrames:
      sequenceDurations.reduce((sum, d) => sum + d, 0) - transitionFrames * transitionCount,
  };
};
