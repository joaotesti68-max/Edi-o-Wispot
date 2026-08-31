// Tokens retirados do "Manual de Marca - Wispot - 2026" (Drive):
// azul institucional #25a8e0, branco #ffffff, cinza #514d4b,
// degradê #25a8e0 -> #0b91c1 e tipografia Montserrat.
export const wispot = {
  blue: "#25a8e0",
  blueDeep: "#0b91c1",
  blueNight: "#08384d",
  gray: "#514d4b",
  white: "#ffffff",
  ink: "#08222e",
  // O manual pede prioridade para as versões de 100% e 80% da cor principal.
  blue80: "rgba(37,168,224,0.8)",
  blue40: "rgba(37,168,224,0.4)",
  blue20: "rgba(37,168,224,0.2)",
  gradient: "linear-gradient(145deg, #25a8e0 0%, #1a9dd4 48%, #0b91c1 100%)",
  gradientDeep:
    "linear-gradient(160deg, #0d5f81 0%, #0b91c1 55%, #25a8e0 100%)",
  logo: {
    color: "wiquest/brand/logo-color.png",
    white: "wiquest/brand/logo-white.png",
    wordmarkWhite: "wiquest/brand/wordmark-white.png",
    iconWhite: "wiquest/brand/icon-white.png",
    iconColor: "wiquest/brand/icon-color.png",
  },
  site: "wispot.com.br",
} as const;

export const font = "Montserrat";
