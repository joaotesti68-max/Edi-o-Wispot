import { CLIP_TRANSITION_FRAMES, buildTimeline, type Block } from "./types";

export const FPS = 30;
export const OUTRO_FRAMES = 90;
/** Between blocks — a directional slide, long enough to read as a beat. */
export const TRANSITION_FRAMES = 12;

const clip = (name: string, seconds: number) => ({
  src: `videos/logistica/${name}.mp4`,
  durationInFrames: Math.floor(seconds * FPS),
});

/** Clips inside a block overlap by CLIP_TRANSITION_FRAMES, like TransitionSeries lays them out. */
const block = (b: Omit<Block, "durationInFrames">): Block => {
  const clips = b.clips ?? [];
  return {
    ...b,
    durationInFrames:
      clips.reduce((sum, c) => sum + c.durationInFrames, 0) -
      CLIP_TRANSITION_FRAMES * Math.max(0, clips.length - 1),
  };
};

/**
 * Roteiro "Logística" (04/09, 14h), montado na ordem do roteiro.
 *
 * Cada fragmento foi conferido por transcrição antes de entrar: só a fala
 * correta do João, sem as tentativas erradas nem a conversa de bastidor.
 * Ficaram de fora "Vamos lá" (8206), "de novo / já esqueci / memória fraca"
 * e a tentativa incompleta (8213), as duas primeiras tentativas do
 * fechamento (8215) e a voz fora do lapela no fim da abertura (8191).
 */
export const blocks: Block[] = [
  block({
    id: "abertura",
    // "Na logística, não é preciso um caminhão parar para a operação inteira ficar comprometida."
    clips: [clip("01_abertura", 5.733)],
    headline: "Não é só o caminhão que para a operação",
    icon: "truck",
    nameCard: "João",
  }),
  block({
    id: "desenvolvimento-1",
    // "Um sistema de gestão indisponível, o rastreamento fora do ar,
    //  podem afetar o estoque, entregas, clientes e toda a operação."
    clips: [
      clip("02_d1a", 2.833),
      clip("03_d1b", 2.366),
      clip("04_d1c", 2.366),
      clip("05_d1d", 3.633),
    ],
    headline: "Sistema fora do ar afeta estoque, entregas e clientes",
    icon: "alert",
  }),
  block({
    id: "desenvolvimento-2",
    // "É por isso que infraestrutura e segurança precisam caminhar juntos.
    //  Na Pro Advanced, nós atuamos com cibersegurança, monitoramento 24 horas,
    //  backup, data center e infraestrutura de TI."
    clips: [
      clip("06_d2a", 5.166),
      clip("07_d2b", 4.166),
      clip("08_d2c", 3.466),
      clip("09_d2d", 3.6),
    ],
    headline: "Infraestrutura e segurança precisam caminhar juntas",
    icon: "shield",
  }),
  block({
    id: "desenvolvimento-3",
    // "Identificar ameaças e falhas com mais rapidez e ter uma estrutura
    //  preparada para recuperar a operação."
    clips: [clip("10_d3a", 3.8), clip("11_d3b", 5.533)],
    headline: "Identificar mais rápido, recuperar a operação",
    icon: "radar",
  }),
  block({
    id: "fechamento",
    // "Na logística, tecnologia parada também significa operação parada.
    //  Fale conosco e proteja a estrutura que mantém o seu negócio funcionando."
    clips: [clip("12_f1", 4.733), clip("13_f2", 5.5)],
    headline: "Tecnologia parada também é operação parada",
    icon: "chat",
  }),
];

const timeline = buildTimeline(
  blocks.map((b) => b.durationInFrames),
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
);

export const blockRanges = timeline.blockRanges;
export const outroRange = timeline.outroRange;
export const totalDurationInFrames = timeline.totalDurationInFrames;
