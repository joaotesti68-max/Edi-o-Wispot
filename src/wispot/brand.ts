// Official palette from Manual de Identidade Wispot (2026):
// Azul #25A8E0, Branco #FFFFFF, Cinza #514D4B, Degradê #25A8E0 -> #0B91C1.
// Primary typeface is Adineue Pro; we don't have that font file, so we fall
// back to Montserrat (the manual's approved secondary family).
export const brand = {
  colors: {
    blue: "#25A8E0",
    blueDark: "#0B91C1",
    white: "#FFFFFF",
    gray: "#514D4B",
  },
  gradient: "linear-gradient(135deg, #25A8E0 0%, #0B91C1 100%)",
  fontFamily: "Montserrat",
  cta: "wispot.com.br",
};
