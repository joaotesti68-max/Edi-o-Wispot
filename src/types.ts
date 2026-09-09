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
};

/** An animated icon that lands at frame `at`, counted from the start of its block. */
export type IconTile = {
  label: string;
  icon: IconKey;
  at: number;
};

/** An animation that plays over the footage without cutting away from it. */
export type Overlay = {
  kind: "attack";
  at: number;
  durationInFrames: number;
};

export type Block = {
  id: string;
  /** Single clip (legacy) or a run of hard cuts sharing one headline. */
  video?: string;
  clips?: Clip[];
  durationInFrames: number;
  headline: string;
  icon: IconKey;
  nameCard?: string;
  tiles?: IconTile[];
  overlays?: Overlay[];
};

export type Range = { start: number; end: number };

/** Overlap between fragments inside a block — enough to soften a jump cut. */
export const CLIP_TRANSITION_FRAMES = 4;

/** Start frame of each clip inside its block, accounting for that overlap. */
export const clipStarts = (clips: Clip[]) => {
  const starts = [0];
  for (let i = 1; i < clips.length; i++) {
    starts.push(starts[i - 1] + clips[i - 1].durationInFrames - CLIP_TRANSITION_FRAMES);
  }
  return starts;
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
