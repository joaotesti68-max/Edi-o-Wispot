// Black Friday Wispot · ad edit (9:16, 30 fps).
// Raw takes: 16 iPhone clips from the Drive folder. Four were picked, one per
// line of the script, and pre-trimmed with ffmpeg into public/videos/black-november/
// (loudness normalised to -15 LUFS) and cropped from the 4K source with a small
// bottom-anchored zoom (1.1 to 1.3) that takes the air conditioner out of the top. Times below are seconds inside each trimmed take.
//
//   take-0413  hook      "Começou a Black Friday na Wispot. Ganhe 3 meses grátis..."
//   take-0414  oferta    "São 21 meses de Wi-Fi inteligente pagando apenas 18..."
//   take-0415  público   "Ideal para restaurantes, varejo, supermercados..."
//   take-0420  urgência  "Mas atenção, a oferta só é válida até o dia 30 de novembro..."

export const FPS = 30;
export const END_FRAMES = 105; // 3.5 s end card

export type Caption = { text: string; from: number; to: number; mark?: boolean };

export type Take = {
  id: "hook" | "oferta" | "publico" | "urgencia";
  src: string;
  seconds: number;
  captions: Caption[];
};

export const takes: Take[] = [
  {
    id: "hook",
    src: "videos/black-november/take-0413.mp4",
    seconds: 5.95,
    captions: [
      { text: "Começou a", from: 0.12, to: 0.74 },
      { text: "Black Friday", from: 0.74, to: 1.3, mark: true },
      { text: "na Wispot!", from: 1.3, to: 2.4 },
      { text: "Ganhe 3 meses grátis", from: 2.5, to: 3.8, mark: true },
      { text: "na contratação", from: 3.8, to: 4.46 },
      { text: "de um plano de", from: 4.46, to: 5.02 },
      { text: "18 meses", from: 5.02, to: 5.95, mark: true },
    ],
  },
  {
    id: "oferta",
    src: "videos/black-november/take-0414.mp4",
    seconds: 7.55,
    captions: [
      { text: "São 21 meses", from: 0.05, to: 1.15, mark: true },
      { text: "de Wi-Fi inteligente", from: 1.15, to: 2.29 },
      { text: "pagando apenas 18", from: 2.29, to: 3.55, mark: true },
      { text: "Transforme a ferramenta", from: 3.68, to: 4.61 },
      { text: "que você já entrega", from: 4.61, to: 5.77 },
      { text: "em uma nova", from: 5.77, to: 6.25 },
      { text: "fonte de receita", from: 6.25, to: 7.55, mark: true },
    ],
  },
  {
    id: "publico",
    src: "videos/black-november/take-0415.mp4",
    seconds: 8.55,
    captions: [
      { text: "Ideal para", from: 0.05, to: 0.92 },
      { text: "restaurantes,", from: 0.92, to: 1.84 },
      { text: "varejo,", from: 1.84, to: 2.38 },
      { text: "supermercados,", from: 2.38, to: 3.45 },
      { text: "provedores de internet", from: 3.5, to: 4.46 },
      { text: "e todos os", from: 4.46, to: 5.46 },
      { text: "estabelecimentos", from: 5.46, to: 6.3 },
      { text: "que querem entregar", from: 6.3, to: 7.16 },
      { text: "além da conexão", from: 7.16, to: 8.55, mark: true },
    ],
  },
  {
    id: "urgencia",
    src: "videos/black-november/take-0420.mp4",
    seconds: 7.25,
    captions: [
      { text: "Mas atenção!", from: 0.1, to: 1.2, mark: true },
      { text: "A oferta só é válida", from: 1.25, to: 2.37 },
      { text: "até 30 de novembro", from: 2.37, to: 3.75, mark: true },
      { text: "Corre, garanta já", from: 3.85, to: 4.95 },
      { text: "antes que acabe", from: 5.1, to: 6.0 },
      { text: "Fale com a gente", from: 6.1, to: 7.25, mark: true },
    ],
  },
];

export const s = (seconds: number) => Math.round(seconds * FPS);

export const timeline = (() => {
  let from = 0;
  return takes.map((take) => {
    const durationInFrames = s(take.seconds);
    const item = { take, from, durationInFrames };
    from += durationInFrames;
    return item;
  });
})();

export const talkFrames = timeline.reduce((n, t) => n + t.durationInFrames, 0);
export const totalDurationInFrames = talkFrames + END_FRAMES;
