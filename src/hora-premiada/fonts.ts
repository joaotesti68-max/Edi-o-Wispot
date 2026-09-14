import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// The brand manual pairs Adineue Pro with Montserrat; only Montserrat is
// licensed for self-hosting here, so it carries the whole piece.
export const fontFamily = "Montserrat";

const weights = ["400", "600", "700", "800"] as const;
const subsets = ["latin", "latin-ext"] as const;

for (const weight of weights) {
  for (const subset of subsets) {
    loadFont({
      family: fontFamily,
      url: staticFile(`fonts/montserrat-${subset}-${weight}-normal.woff2`),
      weight,
      style: "normal",
    });
  }
}
