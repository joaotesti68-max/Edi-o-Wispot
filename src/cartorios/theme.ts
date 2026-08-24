import { brand } from "../shared/brand";

/**
 * Extensão institucional do manual de marca para o vídeo de cartórios.
 *
 * O manual define azul (#3696cd / #20a3d6), cinza (#676868), branco e
 * Montserrat. Para o tom mais formal deste vídeo os painéis usam fundos navy
 * escuros — que são o azul da marca puxado para o escuro, não uma cor nova — e
 * o azul institucional fica reservado para destaques, réguas e ícones.
 */
export const theme = {
  color: {
    ...brand.colors,
    navy: "#0b1b26",
    navyMid: "#123045",
    navyEdge: "#1a4863",
    line: "rgba(255,255,255,0.14)",
    lineStrong: "rgba(255,255,255,0.30)",
    muted: "rgba(255,255,255,0.66)",
    faint: "rgba(255,255,255,0.40)",
  },

  panelBackground:
    "linear-gradient(158deg, #0b1b26 0%, #123045 52%, #1a4863 100%)",

  /** Brilho suave atrás do conteúdo do painel, para dar profundidade. */
  panelGlow:
    "radial-gradient(120% 60% at 50% 26%, rgba(54,150,205,0.30) 0%, rgba(54,150,205,0) 62%)",

  /** Escurecimento na base do vídeo, para o texto do lower third respirar. */
  footerScrim:
    "linear-gradient(to bottom, rgba(0,0,0,0) 46%, rgba(6,14,20,0.62) 74%, rgba(4,10,14,0.90) 100%)",

  /** Escurecimento leve no topo, para o logo e a barra de progresso. */
  headerScrim:
    "linear-gradient(to bottom, rgba(4,10,14,0.55) 0%, rgba(4,10,14,0) 100%)",

  font: brand.fontFamily,

  /** Margem lateral única, usada por todas as camadas. */
  gutter: 76,

  type: {
    eyebrow: {
      fontWeight: 600,
      fontSize: 27,
      letterSpacing: 3.4,
      textTransform: "uppercase" as const,
    },
    headline: {
      fontWeight: 800,
      fontSize: 62,
      lineHeight: 1.1,
      letterSpacing: -0.8,
    },
    panelTitle: {
      fontWeight: 800,
      fontSize: 78,
      lineHeight: 1.03,
      letterSpacing: -1.4,
    },
    item: {
      fontWeight: 700,
      fontSize: 42,
      letterSpacing: -0.3,
    },
    body: {
      fontWeight: 500,
      fontSize: 32,
      lineHeight: 1.34,
      letterSpacing: 0,
    },
  },
} as const;
