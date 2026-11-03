import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same palette and type as the Black November LP (landing-black-friday/src/style.css):
// black stage, Wispot blue #25A8E0 / #0B91C1, white. Titles in Outfit (web stand-in
// for the brand's Adineue Pro), text in Montserrat.
export const bn = {
  ink: "#050608",
  blue: "#25a8e0",
  blueDeep: "#0b91c1",
  white: "#ffffff",
  soft: "#c9d2d9",
  mute: "#9aa3ab",
  gradient: "linear-gradient(120deg, #25a8e0, #0b91c1)",
  title: "Outfit",
  text: "Montserrat",
  logoWhite: "wispot/logo-white.png",
};

for (const weight of ["600", "700", "800"] as const) {
  loadFont({
    family: bn.title,
    url: staticFile(`fonts/outfit-latin-${weight}-normal.woff2`),
    weight,
  });
}
for (const weight of ["700", "800"] as const) {
  for (const subset of ["latin", "latin-ext"] as const) {
    loadFont({
      family: bn.text,
      url: staticFile(`fonts/montserrat-${subset}-${weight}-normal.woff2`),
      weight,
    });
  }
}
