// Paleta e tipografia conforme o "Manual de Marca - Wispot - 2026".
// `ground` e `groundDeep` não constam no manual: são escurecimentos do azul
// institucional, usados como fundo de palco para o screencast (que é quase
// todo branco) sem brigar com o contraste exigido pelo manual.
export const brand = {
  colors: {
    blue: "#25a8e0",
    blueDeep: "#0b91c1",
    gray: "#514d4b",
    white: "#ffffff",
    ground: "#0a3d52",
    groundDeep: "#062533",
  },
  gradient: "linear-gradient(135deg, #25a8e0 0%, #0b91c1 100%)",
  groundGradient: "linear-gradient(160deg, #0a3d52 0%, #062533 100%)",
  fontFamily: "Montserrat",
  logo: {
    white: "brand/wispot-logo-white.png",
    color: "brand/wispot-logo-color.png",
  },
  site: "wispot.com.br",
};
