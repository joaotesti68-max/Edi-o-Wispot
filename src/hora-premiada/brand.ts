// Tokens taken from "Manual de Marca - Wispot - 2026" (Gestão de cores / Tipografia).
export const brand = {
  colors: {
    // Institutional palette: azul, branco, cinza.
    blue: "#25a8e0",
    blueDeep: "#0b91c1",
    white: "#ffffff",
    gray: "#514d4b",
    ink: "#0c1316",
  },
  // The manual builds tints by lowering the opacity of the primary blue and
  // asks for 100% and 80% to be preferred, so those are the ones exposed here.
  blueAlpha: (opacity: number) => `rgba(37, 168, 224, ${opacity})`,
  // "DEGRADÊ #25a8e0 - 0b91c1"
  gradient: "linear-gradient(140deg, #25a8e0 0%, #1a9ed3 45%, #0b91c1 100%)",
  fontFamily: "Montserrat",
  logo: {
    color: "brand/wispot/logo-color.png",
    white: "brand/wispot/logo-white.png",
    iconColor: "brand/wispot/icon-color.png",
    iconWhite: "brand/wispot/icon-white.png",
  },
  site: "wispot.com.br",
} as const;

/** The product has its own lockup, in its own green. */
export const horaPremiada = {
  green: "#8cc63e",
  greenAlpha: (opacity: number) => `rgba(140, 198, 62, ${opacity})`,
  gradient: "linear-gradient(140deg, #a3d65c 0%, #8cc63e 55%, #6faf2c 100%)",
  logo: {
    color: "brand/hora-premiada/logo-color.png",
    white: "brand/hora-premiada/logo-white.png",
  },
} as const;
