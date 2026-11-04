// Black November 2026 (Pro Advanced): roteiro da edição.
// Os trechos em public/videos/black-november/ já vêm cortados; os tempos das
// palavras abaixo são do take original (Whisper) e `cut` é onde o trecho começa.

export const FPS = 30;
export const END = 108;

export const pa = {
  black: "#020509",
  navy: "#000c19",
  navy2: "#08121f",
  blue: "#2ba3db",
  cyan: "#68c5db",
  red: "#f96d64",
  white: "#ffffff",
  grad: "linear-gradient(100deg, #2ba3db 0%, #68c5db 100%)",
};

export type Word = { at: number; end: number; text: string; key?: boolean };

export type Clip = {
  id: string;
  src: string;
  cut: number;
  // Trechos mantidos, em segundos do arquivo cortado (o resto é silêncio).
  keep: [number, number][];
  durationInFrames: number;
  zoom: number;
  words: Word[];
};

const w = (at: number, end: number, text: string, key = false): Word => ({
  at,
  end,
  text,
  key,
});

export const clips: Clip[] = [
  {
    id: "oferta",
    src: "videos/black-november/fala1.mp4",
    cut: 1.3,
    keep: [[0.28, 5.72]],
    durationInFrames: 0,
    zoom: 1.0,
    words: [
      w(1.48, 2.0, "Nesta"),
      w(2.0, 2.26, "Black", true),
      w(2.26, 2.68, "Friday,", true),
      w(2.96, 3.02, "a"),
      w(3.02, 3.46, "Pro Advanced"),
      w(3.46, 3.62, "te"),
      w(3.62, 3.92, "oferece"),
      w(3.92, 4.1, "um"),
      w(4.1, 4.64, "diagnóstico", true),
      w(4.64, 5.12, "gratuito", true),
      w(5.12, 5.32, "de"),
      w(5.32, 5.98, "cibersegurança", true),
      w(5.98, 6.24, "para"),
      w(6.24, 6.32, "a"),
      w(6.32, 6.44, "sua"),
      w(6.44, 6.96, "empresa."),
    ],
  },
  {
    id: "atencao",
    src: "videos/black-november/fala2.mp4",
    cut: 0.98,
    keep: [[0.48, 5.42]],
    durationInFrames: 0,
    zoom: 1.12,
    words: [
      w(1.16, 1.88, "Mesmo"),
      w(1.88, 2.04, "com"),
      w(2.04, 2.18, "tudo"),
      w(2.18, 2.86, "funcionando,"),
      w(3.22, 3.38, "controles", true),
      w(3.38, 3.6, "de", true),
      w(3.6, 3.96, "acesso", true),
      w(3.96, 4.26, "e"),
      w(4.26, 4.98, "monitoramento", true),
      w(4.98, 5.3, "ainda"),
      w(5.3, 5.7, "precisam"),
      w(5.7, 5.84, "de"),
      w(5.84, 6.2, "atenção.", true),
    ],
  },
  {
    id: "avaliacao",
    src: "videos/black-november/fala3.mp4",
    cut: 0.98,
    keep: [
      [0.66, 1.52],
      [1.72, 5.8],
    ],
    durationInFrames: 0,
    zoom: 1.0,
    words: [
      w(1.5, 1.96, "A"),
      w(1.96, 2.62, "avaliação"),
      w(2.62, 3.1, "ajuda"),
      w(3.1, 3.3, "a"),
      w(3.3, 3.64, "detectar"),
      w(3.64, 3.84, "os"),
      w(3.84, 4.3, "riscos", true),
      w(4.3, 4.5, "e"),
      w(4.5, 5.0, "identificar"),
      w(5.0, 5.78, "oportunidades", true),
      w(5.78, 6.02, "no"),
      w(6.02, 6.24, "seu"),
      w(6.24, 6.6, "sistema."),
    ],
  },
  {
    id: "cta",
    src: "videos/black-november/fala4.mp4",
    cut: 0.82,
    keep: [
      [0.4, 2.36],
      [2.62, 5.4],
    ],
    durationInFrames: 0,
    zoom: 1.12,
    words: [
      w(1.3, 1.72, "Aproveite"),
      w(1.72, 1.84, "a"),
      w(1.84, 1.98, "Black", true),
      w(1.98, 2.26, "November", true),
      w(2.26, 2.48, "da"),
      w(2.48, 3.16, "Pro Advanced"),
      w(3.16, 3.7, "e"),
      w(3.7, 4.54, "solicite"),
      w(4.54, 4.76, "o"),
      w(4.76, 4.96, "seu"),
      w(4.96, 5.48, "diagnóstico", true),
      w(5.48, 5.7, "sem", true),
      w(5.7, 6.14, "custo.", true),
    ],
  },
];

for (const c of clips) {
  c.durationInFrames = c.keep.reduce((n, [a, b]) => n + Math.round((b - a) * FPS), 0);
}

// Onde cada trecho mantido começa na timeline da fala.
export const keepStarts = (clip: Clip) => {
  let acc = 0;
  return clip.keep.map(([a, b]) => {
    const start = acc;
    acc += Math.round((b - a) * FPS);
    return start;
  });
};

// Frame (dentro da fala, já sem os silêncios) em que um instante do take original acontece.
export const at = (clip: Clip, sourceSeconds: number) => {
  const local = sourceSeconds - clip.cut;
  const starts = keepStarts(clip);
  for (let i = 0; i < clip.keep.length; i++) {
    const [a, b] = clip.keep[i];
    if (local < b || i === clip.keep.length - 1) {
      return starts[i] + Math.round((Math.max(local, a) - a) * FPS);
    }
  }
  return 0;
};

export const clipStarts = clips.reduce<number[]>((acc, c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + clips[i - 1].durationInFrames);
  return acc;
}, []);

export const endStart =
  clipStarts[clips.length - 1] + clips[clips.length - 1].durationInFrames;
export const totalDurationInFrames = endStart + END;

// Legenda em blocos curtos: quebra em pausas ou a cada 3 palavras.
export type Chunk = { from: number; to: number; words: Word[] };
export const chunksFor = (clip: Clip): Chunk[] => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  clip.words.forEach((word, i) => {
    const prev = clip.words[i - 1];
    const gap = prev ? word.at - prev.end : 0;
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0);
    if (cur.length && (gap > 0.25 || cur.length >= 3 || chars + word.text.length > 20)) {
      out.push(cur);
      cur = [];
    }
    cur.push(word);
    if (/[.,?]$/.test(word.text)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out.map((ws, i) => ({
    from: at(clip, ws[0].at) - 2,
    to:
      i < out.length - 1
        ? at(clip, out[i + 1][0].at) - 2
        : Math.min(clip.durationInFrames, at(clip, ws[ws.length - 1].end) + 14),
    words: ws,
  }));
};
