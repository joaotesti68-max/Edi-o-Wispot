export const FPS = 30;

/**
 * Roteiro do vídeo de cartórios, montado sobre a fala real gravada.
 *
 * Os tempos de `captions` e `panels` são segundos contados do início de cada
 * bloco e foram tirados do alinhamento da narração — por isso os números não
 * são redondos. A coreografia interna de cada painel fica no próprio
 * componente do painel.
 *
 * `frames` é a contagem exata de quadros do mp4 correspondente: mudar o corte
 * do vídeo exige atualizar esse número junto.
 */

export type PanelKind = "alerta" | "diagnostico" | "tecnicos" | "documentacao";

export type Caption = {
  from: number;
  to: number;
  eyebrow: string;
  text: string;
};

export type PanelCue = {
  kind: PanelKind;
  from: number;
  to: number;
};

export type Block = {
  id: string;
  video: string;
  frames: number;
  captions: Caption[];
  panels: PanelCue[];
};

export const TRANSITION_FRAMES = 8;
export const ENDCARD_FRAMES = 90;

export const blocks: Block[] = [
  {
    // "Uma nova lei já está em vigor e pode multar cartórios que não estejam
    // adequados e seguros digitalmente. Se você ainda não está adequado, esse
    // vídeo aqui é para você..."
    id: "abertura",
    video: "videos/cartorios/01-abertura.mp4",
    frames: 398,
    captions: [
      {
        from: 0.35,
        to: 2.7,
        eyebrow: "Segurança digital em cartórios",
        text: "Nova lei já em vigor",
      },
      {
        from: 6.95,
        to: 13.27,
        eyebrow: "ProAdvanced",
        text: "A adequação na prática",
      },
    ],
    panels: [{ kind: "alerta", from: 2.6, to: 6.8 }],
  },
  {
    // "Primeiro, analisamos e identificamos onde estão os dados sensíveis (...)
    // Depois disso, a gente entra com a parte técnica (...)"
    id: "etapas",
    video: "videos/cartorios/02-etapas.mp4",
    frames: 549,
    captions: [
      {
        from: 6.95,
        to: 9.35,
        eyebrow: "Etapa 02",
        text: "Ajustes técnicos",
      },
    ],
    panels: [
      { kind: "diagnostico", from: 1.3, to: 6.55 },
      { kind: "tecnicos", from: 9.25, to: 17.75 },
    ],
  },
  {
    // "Por fim, nós documentamos e entregamos a você todos os registros e
    // evidências comprovando (...) que o seu cartório está dentro dos
    // parâmetros exigidos por essa nova lei."
    id: "documentacao",
    video: "videos/cartorios/03-documentacao.mp4",
    frames: 338,
    captions: [],
    panels: [{ kind: "documentacao", from: 1.35, to: 10.1 }],
  },
  {
    // "Ainda dá tempo de se enquadrar à nova lei. Contate agora (...) antes que
    // o prazo feche."
    id: "fechamento",
    video: "videos/cartorios/04-fechamento.mp4",
    frames: 264,
    captions: [
      {
        from: 0.3,
        to: 2.45,
        eyebrow: "Prazo",
        text: "Ainda dá tempo\nde se adequar",
      },
      {
        from: 2.75,
        to: 8.8,
        eyebrow: "Próximo passo",
        text: "Fale com um especialista\ne comece seu diagnóstico",
      },
    ],
    panels: [],
  },
];

/**
 * Espelha como o TransitionSeries encadeia as sequências: cada bloco começa
 * TRANSITION_FRAMES antes do fim do anterior. A barra de progresso e a trilha
 * usam esses limites sem repetir a conta.
 */
const durations = [...blocks.map((b) => b.frames), ENDCARD_FRAMES];

const starts = durations.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + durations[i - 1] - TRANSITION_FRAMES);
  return acc;
}, []);

export const blockStarts = starts.slice(0, blocks.length);
export const endcardStart = starts[starts.length - 1];
export const totalFrames = endcardStart + ENDCARD_FRAMES;
