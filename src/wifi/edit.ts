import { clips, type Clip } from "./transcript";

export const FPS = 30;
export const OUTRO_FRAMES = 75;
export const OUTRO_FADE = 10;

export type Keyword = { text: string; at: number };

// A stretch of the source clip that survives the silence cuts.
export type Part = { srcStart: number; from: number; durationInFrames: number };

export type Segment = {
  clip: Clip;
  from: number;
  durationInFrames: number;
  parts: Part[];
  // Clips where the speaker reads off-camera are covered by a motion graphic
  // (rendered outside Remotion from motion-graphics/*.html); the voice stays.
  motionGraphic?: string;
  zoom: number;
  keywords: Keyword[];
};

const plan: Record<
  string,
  Omit<Segment, "clip" | "from" | "durationInFrames" | "parts">
> = {
  img8734: {
    zoom: 1,
    keywords: [{ text: "Wi-Fi corporativo", at: 0.6 }],
  },
  img8740: {
    zoom: 1.06,
    keywords: [
      { text: "Quedas", at: 1.82 },
      { text: "Lentidão", at: 2.93 },
      { text: "Interferência", at: 3.86 },
    ],
  },
  img8743: {
    zoom: 1.1,
    keywords: [{ text: "Operação travada", at: 0.55 }],
  },
  img8745: { zoom: 1, keywords: [], motionGraphic: "videos/mg/riscos.mp4" },
  img8747: {
    zoom: 1,
    keywords: [
      { text: "Produtividade", at: 3.38 },
      { text: "Continuidade", at: 4.19 },
    ],
  },
  img8748: { zoom: 1, keywords: [], motionGraphic: "videos/mg/solucao.mp4" },
  img8750: {
    zoom: 1.06,
    keywords: [{ text: "Wi-Fi seguro e estável", at: 3.2 }],
  },
  img8751: {
    zoom: 1,
    keywords: [
      { text: "Segmentação", at: 0.32 },
      { text: "Infraestrutura de TI", at: 1.58 },
      { text: "Suporte 24 horas", at: 3.96 },
    ],
  },
  img8752: {
    zoom: 1.08,
    keywords: [
      { text: "Risco para a operação", at: 1.81 },
      { text: "Fale conosco", at: 3.59 },
    ],
  },
};

// Speech ranges (source seconds) found by energy analysis: pauses inside and
// around each take are cut out.
const speech: Record<string, [number, number][]> = {
  img8734: [[1.13, 6.01]],
  img8740: [
    [1.77, 5.87],
    [6.0, 7.9],
  ],
  img8743: [[1.65, 4.44]],
  img8745: [
    [2.14, 7.88],
    [8.04, 11.71],
  ],
  img8747: [
    [1.57, 3.64],
    [3.84, 6.48],
  ],
  img8748: [
    [1.58, 5.31],
    [5.46, 7.18],
    [7.31, 11.37],
  ],
  img8750: [[0.82, 5.53]],
  img8751: [[1.25, 6.2]],
  img8752: [
    [1.22, 4.48],
    [4.65, 5.43],
  ],
};

export const segments: Segment[] = [];
{
  let from = 0;
  for (const clip of clips) {
    const parts: Part[] = [];
    let local = 0;
    for (const [a, b] of speech[clip.id]) {
      const durationInFrames = Math.round((b - a) * FPS);
      parts.push({
        srcStart: Math.round(a * FPS),
        from: local,
        durationInFrames,
      });
      local += durationInFrames;
    }
    segments.push({
      clip,
      from,
      durationInFrames: local,
      parts,
      ...plan[clip.id],
    });
    from += local;
  }
}

export const talkFrames = segments.reduce(
  (sum, s) => sum + s.durationInFrames,
  0,
);
export const totalDurationInFrames = talkFrames + OUTRO_FRAMES - OUTRO_FADE;

// Maps a time in the original take (seconds after clip.trimIn, as the keyword
// cues are written) to a frame in the cut segment.
export const toSegmentFrame = (segment: Segment, at: number) => {
  const src = (segment.clip.trimIn + at) * FPS;
  for (const part of segment.parts) {
    if (src < part.srcStart) return part.from;
    if (src < part.srcStart + part.durationInFrames)
      return part.from + Math.round(src - part.srcStart);
  }
  return segment.durationInFrames;
};
