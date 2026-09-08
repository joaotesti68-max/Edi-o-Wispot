/**
 * Paleta oficial da Wispot, amostrada das peças sociais da marca
 * (WISPOT_SOCIAL_*) e do logotipo: ciano como cor de ação, petróleo como
 * base escura, branco para o texto.
 */
export const wispot = {
  cyan: "#00AAE3",
  cyanDeep: "#0090C4",
  navy: "#003F5B",
  navyDeep: "#00293B",
  ink: "#001824",
  white: "#FFFFFF",
  mist: "#F2FBFD",
  muted: "rgba(255,255,255,0.66)",
  rule: "rgba(255,255,255,0.24)",
  logo: {
    white: "brand/wispot/logo-branco.png",
    color: "brand/wispot/logo-cor.png",
  },
  /**
   * Escurece a crista e a base. O texto sobe acima dos ~250px que Reels e
   * TikTok cobrem com a própria interface, então o degradê de baixo começa
   * mais alto do que o de um vídeo feito só para tela cheia.
   */
  scrim:
    "linear-gradient(to bottom, rgba(0,24,36,0.74) 0%, rgba(0,24,36,0.22) 18%, rgba(0,24,36,0) 34%, rgba(0,24,36,0.30) 52%, rgba(0,24,36,0.74) 74%, rgba(0,20,30,0.92) 100%)",
};
