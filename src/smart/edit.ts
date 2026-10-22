export const FPS = 30;
export const END_FRAMES = 78;
// The takes in public/videos/smart were transcoded at this speed (atempo,
// pitch kept); every time in this file is in the take before the speed-up.
export const SPEED = 1.1;

export type Clip = {
  id: string;
  // Stretches of the take (seconds) that survive the silence cuts.
  parts: [number, number][];
  // Punch-in for the jump cut; alternate takes sit tighter.
  zoom: number;
};

export const clips: Clip[] = [
  // A prefeitura de São Paulo admitiu um vazamento no Smart Sampa.
  { id: "img9448", parts: [[0.03, 3.77]], zoom: 1 },
  // E o problema não foi um hacker.
  { id: "img9450", parts: [[0.18, 2.16]], zoom: 1.14 },
  // O Smart Sampa é um sistema de monitoramento e reconhecimento facial
  // na cidade de São Paulo. (covered by the city map)
  { id: "img9452", parts: [[0.12, 6.12]], zoom: 1 },
  // ...com mais de 50 mil câmeras.
  { id: "img9453", parts: [[0.24, 2.15]], zoom: 1 },
  // Um servidor publicou dados do sistema na internet de forma ilegal.
  { id: "img9457", parts: [[0.04, 4.25]], zoom: 1.12 },
  // A prefeitura diz que não houve falha na plataforma.
  { id: "img9459", parts: [[0.56, 3.42]], zoom: 1 },
  // E é exatamente isso que deveria preocupar a sua empresa.
  { id: "img9461", parts: [[0.42, 3.34]], zoom: 1.12 },
  // Quando o vazamento vem de dentro, firewall nenhum resolve.
  {
    id: "img9467",
    parts: [
      [0.02, 1.66],
      [1.75, 3.09],
    ],
    zoom: 1,
  },
  // Segurança não é só proteger quem está de fora.
  { id: "img9468", parts: [[0.38, 3.4]], zoom: 1.12 },
  // É saber quem lá dentro está acessando o quê.
  {
    id: "img9469",
    parts: [
      [0.0, 0.34],
      [0.74, 3.84],
    ],
    zoom: 1,
  },
  // Quer saber se a sua empresa está preparada?
  { id: "img9470", parts: [[0.02, 2.1]], zoom: 1.12 },
  // Fale com a Pro Advanced.
  { id: "img9471", parts: [[0.14, 1.64]], zoom: 1 },
];

// Output frames for a stretch of the take.
const frames = (sec: number) => Math.round((sec * FPS) / SPEED);

export type Part = { srcStart: number; from: number; durationInFrames: number };

// Per clip: where each part starts in the sped-up file and in the clip.
export const clipParts: Part[][] = clips.map((c) => {
  let from = 0;
  return c.parts.map(([a, b]) => {
    const part = { srcStart: frames(a), from, durationInFrames: frames(b) - frames(a) };
    from += part.durationInFrames;
    return part;
  });
});

export const clipDurations = clipParts.map((ps) =>
  ps.reduce((sum, p) => sum + p.durationInFrames, 0),
);

export const clipStarts: number[] = [];
{
  let from = 0;
  for (const d of clipDurations) {
    clipStarts.push(from);
    from += d;
  }
}

export const talkFrames = clipStarts[clips.length - 1] + clipDurations[clips.length - 1];
export const totalDurationInFrames = talkFrames + END_FRAMES;

const indexOf = (id: string) => {
  const i = clips.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown clip ${id}`);
  return i;
};

// Absolute frame of a moment `sec` seconds into a take (the word timings
// from the transcript are in these units). Moments inside a cut land on the
// start of the next part.
export const at = (id: string, sec: number) => {
  const i = indexOf(id);
  const src = frames(sec);
  for (const p of clipParts[i]) {
    if (src < p.srcStart) return clipStarts[i] + p.from;
    if (src < p.srcStart + p.durationInFrames)
      return clipStarts[i] + p.from + src - p.srcStart;
  }
  return clipStarts[i] + clipDurations[i];
};

export const startOf = (id: string) => clipStarts[indexOf(id)];
export const endOf = (id: string) => clipStarts[indexOf(id)] + clipDurations[indexOf(id)];
