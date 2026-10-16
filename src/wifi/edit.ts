import { clips, type Clip, type Word } from "./transcript";

export const FPS = 30;
export const OUTRO_FRAMES = 75;
export const OUTRO_FADE = 10;

export type Tone = "red" | "amber" | "blue" | "green";
export type Keyword = { text: string; at: number; tone: Tone };

export type Segment = {
  clip: Clip;
  from: number;
  durationInFrames: number;
  // Clips where the speaker reads off-camera are covered by a motion graphic
  // (rendered outside Remotion from motion-graphics/*.html); the voice stays.
  motionGraphic?: string;
  zoom: number;
  keywords: Keyword[];
};

const plan: Record<string, Omit<Segment, "clip" | "from" | "durationInFrames">> = {
  img8734: { zoom: 1, keywords: [{ text: "WI-FI CORPORATIVO", at: 0.6, tone: "blue" }] },
  img8740: {
    zoom: 1.12,
    keywords: [
      { text: "QUEDAS", at: 1.82, tone: "red" },
      { text: "LENTIDÃO", at: 2.93, tone: "red" },
      { text: "INTERFERÊNCIA", at: 3.86, tone: "red" },
    ],
  },
  img8743: { zoom: 1.25, keywords: [{ text: "OPERAÇÃO TRAVADA", at: 0.55, tone: "red" }] },
  img8745: { zoom: 1, keywords: [], motionGraphic: "videos/mg/riscos.mp4" },
  img8747: {
    zoom: 1,
    keywords: [
      { text: "PRODUTIVIDADE", at: 3.38, tone: "amber" },
      { text: "CONTINUIDADE", at: 4.19, tone: "amber" },
    ],
  },
  img8748: { zoom: 1, keywords: [], motionGraphic: "videos/mg/solucao.mp4" },
  img8750: { zoom: 1.12, keywords: [{ text: "WI-FI SEGURO E ESTÁVEL", at: 3.2, tone: "green" }] },
  img8751: {
    zoom: 1,
    keywords: [
      { text: "SEGMENTAÇÃO", at: 0.32, tone: "blue" },
      { text: "INFRA DE TI", at: 1.58, tone: "blue" },
      { text: "SUPORTE 24H", at: 3.96, tone: "blue" },
    ],
  },
  img8752: {
    zoom: 1.15,
    keywords: [
      { text: "RISCO PARA A OPERAÇÃO", at: 1.81, tone: "red" },
      { text: "FALE CONOSCO", at: 3.59, tone: "green" },
    ],
  },
};

export const segments: Segment[] = [];
{
  let from = 0;
  for (const clip of clips) {
    const durationInFrames = Math.round((clip.trimOut - clip.trimIn) * FPS);
    segments.push({ clip, from, durationInFrames, ...plan[clip.id] });
    from += durationInFrames;
  }
}

export const talkFrames = segments.reduce((sum, s) => sum + s.durationInFrames, 0);
export const totalDurationInFrames = talkFrames + OUTRO_FRAMES - OUTRO_FADE;

// Caption pages: up to 3 words, broken at punctuation and pauses.
export type TimedWord = { text: string; start: number; end: number };
export type CaptionPage = { words: TimedWord[]; start: number; end: number };

const allWords: TimedWord[] = segments.flatMap((seg) =>
  seg.clip.words.map((w: Word) => ({
    text: w.w,
    start: seg.from + Math.round(w.s * FPS),
    end: seg.from + Math.round(w.e * FPS),
  })),
);

export const captionPages: CaptionPage[] = [];
{
  let current: TimedWord[] = [];
  const flush = () => {
    if (current.length === 0) return;
    captionPages.push({ words: current, start: current[0].start, end: current[current.length - 1].end });
    current = [];
  };
  allWords.forEach((word, i) => {
    const prev = allWords[i - 1];
    const chars = current.reduce((n, w) => n + w.text.length + 1, 0) + word.text.length;
    if (current.length >= 3 || chars > 17 || (prev && word.start - prev.end > 8)) flush();
    current.push(word);
    if (/[.,!?]$/.test(word.text)) flush();
  });
  flush();
  // Hold each page until the next one starts (short gaps only).
  captionPages.forEach((page, i) => {
    const next = captionPages[i + 1];
    page.end = next ? Math.min(next.start, page.end + 12) : page.end + 12;
  });
}
