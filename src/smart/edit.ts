export const FPS = 30;
export const END_FRAMES = 78;

// Each take was trimmed to its speech when transcoded (public/videos/smart);
// `in`/`out` are frames inside that file that survive the final cut.
export type Clip = {
  id: string;
  in: number;
  out: number;
  // Punch-in for the jump cut; alternate takes sit tighter.
  zoom: number;
};

const clip = (
  id: string,
  inFrame: number,
  outFrame: number,
  zoom: number,
): Clip => ({ id, in: inFrame, out: outFrame, zoom });

export const clips: Clip[] = [
  // A prefeitura de São Paulo admitiu um vazamento no Smart Sampa.
  clip("img9448", 0, 114, 1),
  // E o problema não foi um hacker.
  clip("img9450", 3, 66, 1.14),
  // O Smart Sampa é um sistema de monitoramento e reconhecimento facial...
  // (covered by the city map)
  clip("img9452", 4, 186, 1),
  // ...com mais de 50 mil câmeras.
  clip("img9453", 2, 66, 1),
  // Um servidor publicou dados do sistema na internet de forma ilegal.
  clip("img9457", 2, 127, 1.12),
  // A prefeitura diz que não houve falha na plataforma.
  clip("img9459", 15, 104, 1),
  // E é exatamente isso que deveria preocupar a sua empresa.
  clip("img9461", 12, 102, 1.12),
  // Quando o vazamento vem de dentro, firewall nenhum resolve.
  clip("img9467", 0, 93, 1),
  // Segurança não é só proteger quem está de fora.
  clip("img9468", 10, 103, 1.12),
  // É saber quem lá dentro está acessando o quê.
  clip("img9469", 0, 116, 1),
  // Quer saber se a sua empresa está preparada?
  clip("img9470", 0, 63, 1.12),
  // Fale com a Pro Advanced.
  clip("img9471", 3, 50, 1),
];

export const clipStarts: number[] = [];
{
  let from = 0;
  for (const c of clips) {
    clipStarts.push(from);
    from += c.out - c.in;
  }
}

export const talkFrames =
  clipStarts[clips.length - 1] +
  clips[clips.length - 1].out -
  clips[clips.length - 1].in;
export const totalDurationInFrames = talkFrames + END_FRAMES;

// Absolute frame of a moment `sec` seconds into a trimmed take (the word
// timings from the transcript are in these units).
export const at = (id: string, sec: number) => {
  const i = clips.findIndex((c) => c.id === id);
  if (i < 0) throw new Error(`unknown clip ${id}`);
  return clipStarts[i] + Math.round(sec * FPS) - clips[i].in;
};

export const startOf = (id: string) => at(id, clips.find((c) => c.id === id)!.in / FPS);
export const endOf = (id: string) => at(id, clips.find((c) => c.id === id)!.out / FPS);
