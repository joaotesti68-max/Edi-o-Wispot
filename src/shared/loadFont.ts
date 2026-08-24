import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const fontFamily = "Montserrat";

const weights = ["400", "500", "600", "700", "800"] as const;
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
