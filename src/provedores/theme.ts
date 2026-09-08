import { brand } from "../brand";

/**
 * Sóbrio por escolha: o vídeo fala com dono de provedor, então a paleta é mais
 * fechada que a do institucional e o azul da marca aparece só como acento.
 */
export const theme = {
  ink: "#070A0D",
  inkSoft: "#10161C",
  accent: brand.colors.primary,
  accentBright: brand.colors.primaryLight,
  white: brand.colors.white,
  muted: "rgba(255,255,255,0.62)",
  rule: "rgba(255,255,255,0.18)",
  scrim:
    "linear-gradient(to bottom, rgba(4,6,9,0.55) 0%, rgba(4,6,9,0) 26%, rgba(4,6,9,0) 44%, rgba(4,6,9,0.78) 76%, rgba(3,5,7,0.94) 100%)",
};
