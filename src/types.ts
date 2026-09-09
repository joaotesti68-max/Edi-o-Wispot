export type IconKey =
  | "alert"
  | "server"
  | "shield"
  | "trending"
  | "chat"
  | "truck"
  | "radar"
  | "restore";

export type Clip = {
  src: string;
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
};

export type Range = { start: number; end: number };

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
