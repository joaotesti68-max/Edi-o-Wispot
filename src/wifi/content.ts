export const FPS = 24;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const OUTRO_FRAMES = 74;
/** Default cross-fade between shots. */
export const TRANSITION_FRAMES = 2;

export type GraphicKey =
  | "none"
  | "unstable"
  | "wlanIssues"
  | "stalled"
  | "risks"
  | "notJustSlow"
  | "structured"
  | "services"
  | "cta";

export type Shot = {
  id: string;
  /** Trimmed, skin-smoothed, loudness-normalised take under public/wifi, sped up to 1.08x. */
  video: string;
  durationInFrames: number;
  /** What is said in this take. */
  line: string;
  /** Empty when the graphic already says it. */
  headline: string;
  /**
   * full   — talking head fills the frame, graphic supports it from below.
   * mockup — the visual covers the whole screen and the take is only heard.
   *          Used on the two takes read off the page and on the service list.
   */
  layout: "full" | "mockup";
  graphic: GraphicKey;
  /** Frames before the graphic starts; the graphic's inner beats follow the words. */
  graphicDelay: number;
  headlineDelay?: number;
  /** Cross-fade length in front of this shot. */
  transitionIn?: number;
};

export const shots: Shot[] = [
  {
    id: "abertura",
    video: "wifi/01-abertura.mp4",
    durationInFrames: 108,
    line: "Sua rede Wi-Fi corporativa aguenta o tamanho da sua operação, ou já virou motivo de reclamação?",
    headline: "Sua rede Wi-Fi aguenta a sua operação?",
    layout: "full",
    graphic: "unstable",
    graphicDelay: 14,
  },
  {
    id: "wlan",
    video: "wifi/02-wlan.mp4",
    durationInFrames: 140,
    line: "Uma WLAN mal configurada gera quedas de conexão, lentidão nos horários de pico e interferência entre equipamentos,",
    headline: "WLAN mal configurada",
    layout: "full",
    graphic: "wlanIssues",
    graphicDelay: 40,
  },
  {
    id: "trava",
    video: "wifi/03-trava.mp4",
    durationInFrames: 62,
    line: "e isso trava a operação sem ninguém entender o motivo.",
    headline: "E ninguém entende o motivo",
    layout: "full",
    graphic: "stalled",
    graphicDelay: 4,
    headlineDelay: 30,
  },
  {
    id: "riscos",
    video: "wifi/04-riscos.mp4",
    durationInFrames: 214,
    line: "Senhas fracas, redes abertas, falta de segmentação e dispositivos conectados sem controle transformam a rede em uma porta aberta pra qualquer tipo de invasão.",
    headline: "",
    layout: "mockup",
    graphic: "risks",
    graphicDelay: 0,
    transitionIn: 3,
  },
  {
    id: "problema",
    video: "wifi/05-problema.mp4",
    durationInFrames: 110,
    line: "Isso não é só um problema de internet lenta. É um problema de segurança, de continuidade e de produtividade.",
    headline: "Não é só internet lenta",
    layout: "full",
    graphic: "notJustSlow",
    graphicDelay: 62,
    transitionIn: 3,
  },
  {
    id: "solucao",
    video: "wifi/06-solucao.mp4",
    durationInFrames: 219,
    line: "Com uma rede sem fio bem estruturada, segmentada e monitorada, a empresa ganha estabilidade, mais capacidade de crescer e controle real sobre quem acessa o quê.",
    headline: "",
    layout: "mockup",
    graphic: "structured",
    graphicDelay: 0,
    transitionIn: 3,
  },
  {
    id: "pro",
    video: "wifi/07-pro.mp4",
    durationInFrames: 107,
    line: "Na Pro Advanced, ajudamos empresas a estruturar redes Wi-Fi seguras e estáveis,",
    headline: "Redes Wi-Fi seguras e estáveis",
    layout: "full",
    graphic: "none",
    graphicDelay: 0,
    headlineDelay: 56,
    transitionIn: 3,
  },
  {
    id: "servicos",
    video: "wifi/08-servicos.mp4",
    durationInFrames: 112,
    line: "com segmentação de acesso, monitoramento contínuo e gestão completa da infraestrutura de TI.",
    headline: "",
    layout: "mockup",
    graphic: "services",
    graphicDelay: 0,
    transitionIn: 3,
  },
  {
    id: "fechamento",
    video: "wifi/09-fechamento.mp4",
    durationInFrames: 96,
    line: "Rede instável não é só desconforto. É risco pra operação inteira. Fale conosco.",
    headline: "Rede instável é risco pra operação inteira",
    layout: "full",
    graphic: "cta",
    graphicDelay: 74,
    headlineDelay: 30,
    transitionIn: 3,
  },
];

const transitions = [
  ...shots.map((s, i) => (i === 0 ? 0 : (s.transitionIn ?? TRANSITION_FRAMES))),
  TRANSITION_FRAMES,
];
const sequenceDurations = [...shots.map((s) => s.durationInFrames), OUTRO_FRAMES];

export const shotTransitions = transitions;

const starts: number[] = [0];
for (let i = 1; i < sequenceDurations.length; i++) {
  starts.push(starts[i - 1] + sequenceDurations[i - 1] - transitions[i]);
}

export const shotRanges = shots.map((s, i) => ({
  start: starts[i],
  end: starts[i] + s.durationInFrames,
}));

export const outroRange = {
  start: starts[starts.length - 1],
  end: starts[starts.length - 1] + OUTRO_FRAMES,
};

export const totalDurationInFrames =
  sequenceDurations.reduce((sum, d) => sum + d, 0) -
  transitions.reduce((sum, t) => sum + t, 0);
