// Cortes dos clipes brutos do João.
//
// Cada `Take` é um trecho do arquivo bruto que entra no corte final. Os limites
// vieram da transcrição dos brutos (whisper), conferidos trecho a trecho contra
// o roteiro — o resto do material é repetição, conversa de bastidor e risada.
//
// Frames são do arquivo de origem, que roda a 24 fps igual à composição, então
// `from`/`to` correspondem a segundo × 24. `to` é exclusivo.

export const JOAO_FPS = 24;
export const JOAO_WIDTH = 1080;
export const JOAO_HEIGHT = 1920;

// Fade de áudio nas emendas, pra não estalar no corte.
export const JOIN_FADE_FRAMES = 2;

export type Take = {
  /** Trecho falado, do jeito que ele fala no bruto. */
  text: string;
  from: number;
  to: number;
};

export type ScriptClip = {
  id: string;
  /** Nome do clipe como o João mandou o roteiro. */
  label: string;
  /** Arquivo bruto em public/. */
  source: string;
  /** Texto que esse clipe precisa entregar. */
  script: string;
  takes: Take[];
};

export const clips: ScriptClip[] = [
  {
    id: "psi-regras",
    label: "Vídeo 1",
    source: "videos/joao/raw-psi-regras.mp4",
    script:
      "É a PSI que define as regras: quem pode acessar cada informação, como os dados devem ser " +
      "protegidos, como os backups devem funcionar e como a equipe deve agir diante de um incidente.",
    takes: [
      // 4,90s – 8,30s
      { text: "É a PSI que define as regras, quem pode acessar cada informação", from: 118, to: 199 },
      // 25,78s – 27,52s
      { text: "como os dados devem ser protegidos", from: 619, to: 660 },
      // 81,26s – 86,15s (última take, é a única com a frase inteira e sem tropeço)
      {
        text: "como os backups devem funcionar e como a equipe deve agir diante de um incidente",
        from: 1950,
        to: 2068,
      },
    ],
  },
  {
    id: "diretriz",
    label: "Clipe 2",
    source: "videos/joao/raw-diretriz.mp4",
    script:
      "Sem essa diretriz, o cartório pode até investir em tecnologia, mas cada solução acaba " +
      "funcionando de forma isolada.",
    takes: [
      // 2,06s – 6,85s
      { text: "Sem essa diretriz, o cartório pode até investir em tecnologia", from: 49, to: 164 },
      // 11,88s – 16,06s (a segunda take, em 17,22s, também serve se essa não agradar)
      { text: "mas cada solução acaba funcionando de forma isolada", from: 285, to: 385 },
    ],
  },
  {
    id: "considerar",
    label: "Clipe 3",
    source: "videos/joao/raw-considerar.mp4",
    script:
      "Ela precisa considerar os sistemas utilizados, os riscos da operação e a rotina real do cartório.",
    takes: [
      // 0,56s – 3,52s
      { text: "Ela precisa considerar os sistemas utilizados", from: 13, to: 84 },
      // 29,72s – 31,75s (alternativa equivalente em 13,20s)
      { text: "os riscos da operação", from: 713, to: 762 },
      // 56,98s – 58,60s (alternativa em 48,72s) — o "e" já vem junto nessa take
      { text: "e a rotina real do cartório", from: 1367, to: 1406 },
    ],
  },
];

export const takeDuration = (take: Take) => take.to - take.from;

export const clipDuration = (clip: ScriptClip) =>
  clip.takes.reduce((sum, take) => sum + takeDuration(take), 0);

export const clipById = (id: string) => {
  const clip = clips.find((c) => c.id === id);
  if (!clip) {
    throw new Error(`Clipe desconhecido: ${id}`);
  }
  return clip;
};
