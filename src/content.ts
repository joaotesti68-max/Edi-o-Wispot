export const FPS = 24;

export type IconKey = "alert" | "server" | "shield" | "trending" | "chat" | "network" | "cloud" | "refresh";

export type Block = {
  id: string;
  video: string;
  durationInFrames: number;
  headline: string;
  icon: IconKey;
  nameCard?: string;
};

export type Interstitial = {
  id: string;
  durationInFrames: number;
  items: { icon: IconKey; label: string }[];
};

export type TimelineItem = { type: "video"; block: Block } | { type: "interstitial"; interstitial: Interstitial };

export const OUTRO_FRAMES = 72;
export const TRANSITION_FRAMES = 8;

export const timeline: TimelineItem[] = [
  {
    type: "video",
    block: {
      id: "abertura",
      video: "videos/abertura.mp4",
      durationInFrames: 129,
      headline: "Já perdeu tempo ou dinheiro com um problema de TI?",
      icon: "alert",
      nameCard: "Isabella Marques",
    },
  },
  {
    type: "video",
    block: {
      id: "desenvolvimento-1",
      video: "videos/desenvolvimento-1.mp4",
      durationInFrames: 175,
      headline: "Infraestrutura cuidada de ponta a ponta",
      icon: "server",
    },
  },
  {
    type: "interstitial",
    interstitial: {
      id: "infra-grid",
      durationInFrames: 56,
      items: [
        { icon: "server", label: "Servidores" },
        { icon: "network", label: "Rede" },
        { icon: "cloud", label: "Backup" },
        { icon: "refresh", label: "Atualizações" },
      ],
    },
  },
  {
    type: "video",
    block: {
      id: "desenvolvimento-1b",
      video: "videos/desenvolvimento-1b.mp4",
      durationInFrames: 305,
      // PLACEHOLDER: waiting on the actual line said in this clip.
      headline: "(roteiro deste trecho pendente de confirmação)",
      icon: "server",
    },
  },
  {
    type: "video",
    block: {
      id: "desenvolvimento-2",
      video: "videos/desenvolvimento-2.mp4",
      durationInFrames: 244,
      headline: "Corrigimos falhas antes que se tornem problemas",
      icon: "shield",
    },
  },
  {
    type: "interstitial",
    interstitial: {
      id: "monitoramento",
      durationInFrames: 44,
      items: [{ icon: "shield", label: "Monitoramento contínuo" }],
    },
  },
  {
    type: "video",
    block: {
      id: "desenvolvimento-3",
      video: "videos/desenvolvimento-3.mp4",
      durationInFrames: 174,
      headline: "Sua equipe volta a focar no que importa",
      icon: "trending",
    },
  },
  {
    type: "interstitial",
    interstitial: {
      id: "resultado",
      durationInFrames: 44,
      items: [{ icon: "trending", label: "Mais foco, mais resultado" }],
    },
  },
  {
    type: "video",
    block: {
      id: "fechamento",
      video: "videos/fechamento.mp4",
      durationInFrames: 154,
      headline: "Menos dor de cabeça de TI. Mais tempo pra crescer.",
      icon: "chat",
    },
  },
];

// Mirrors how @remotion/transitions/TransitionSeries lays out overlapping
// sequences, so the progress bar can know each on-screen frame range
// without duplicating the transition math.
const sequenceDurations = [
  ...timeline.map((t) => (t.type === "video" ? t.block.durationInFrames : t.interstitial.durationInFrames)),
  OUTRO_FRAMES,
];
const transitionCount = sequenceDurations.length - 1;

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - TRANSITION_FRAMES);
}

export const timelineRanges = timeline.map((t, i) => ({
  start: starts[i],
  end: starts[i] + (t.type === "video" ? t.block.durationInFrames : t.interstitial.durationInFrames),
}));

// Progress bar only tracks the talking-head video segments, not the graphic interstitials.
export const videoRanges = timeline
  .map((t, i) => ({ t, range: timelineRanges[i] }))
  .filter((x) => x.t.type === "video")
  .map((x) => x.range);

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) - TRANSITION_FRAMES * transitionCount;
