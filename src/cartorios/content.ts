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

/**
 * Identificação de quem fala. O nome sai daqui — é o único lugar a mudar se a
 * grafia ou a pessoa em cena mudar.
 */
export type NameCardCue = {
  name: string;
  from: number;
  to: number;
};

export type PanelCue = {
  kind: PanelKind;
  from: number;
  /** Ignorado quando `holdToEnd` está ligado. */
  to: number;
  /**
   * Segura o painel até o fim do bloco, em vez de esmaecer sozinho antes da
   * transição. Sem isso, o painel some, o plano gravado acende por três ou
   * quatro quadros e só então vem a transição — o que se lê como uma piscada.
   */
  holdToEnd?: boolean;
};

export type Block = {
  id: string;
  video: string;
  frames: number;
  captions: Caption[];
  panels: PanelCue[];
  nameCard?: NameCardCue;
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
    frames: 340,
    // A tarja de abertura sairia repetindo a legenda; fica só a do trecho em
    // que ele apresenta o processo.
    captions: [
      {
        from: 6.05,
        to: 11.33,
        eyebrow: "ProAdvanced",
        text: "A adequação na prática",
      },
    ],
    // Entra e sai em cima das emendas do corte, que somem sob o painel.
    panels: [{ kind: "alerta", from: 1.9, to: 5.9 }],
    // Sai antes do painel de alerta entrar, que ocupa o mesmo canto da tela.
    nameCard: { name: "Vinícius Miranda", from: 0.3, to: 1.9 },
  },
  {
    // "Primeiro, analisamos e identificamos onde estão os dados sensíveis (...)
    // Depois disso, a gente entra com a parte técnica (...)"
    id: "etapas",
    video: "videos/cartorios/02-etapas.mp4",
    frames: 520,
    captions: [
      {
        from: 6.65,
        to: 8.8,
        eyebrow: "Etapa 02",
        text: "Ajustes técnicos",
      },
    ],
    panels: [
      { kind: "diagnostico", from: 1.1, to: 6.55 },
      { kind: "tecnicos", from: 8.8, to: 17.06, holdToEnd: true },
    ],
  },
  {
    // "Por fim, nós documentamos e entregamos a você todos os registros e
    // evidências comprovando (...) que o seu cartório está dentro dos
    // parâmetros exigidos por essa nova lei."
    id: "documentacao",
    video: "videos/cartorios/03-documentacao.mp4",
    frames: 311,
    captions: [],
    panels: [{ kind: "documentacao", from: 1.1, to: 10.1, holdToEnd: true }],
  },
  {
    // "Ainda dá tempo de se enquadrar à nova lei. Contate agora (...) antes que
    // o prazo feche."
    id: "fechamento",
    video: "videos/cartorios/04-fechamento.mp4",
    frames: 251,
    // No fechamento a legenda já carrega a chamada; tarja aqui seria eco.
    captions: [],
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
