// Gera src/fonts.generated.ts com as Montserrat embutidas como data URI.
//
// Motivo: carregar a fonte por URL faz ela disputar as 6 conexões por origem
// que o Chrome permite, no mesmo servidor local de onde o OffthreadVideo puxa
// os frames. No episódio 2, que tem 7 vídeos, a requisição da fonte ficava na
// fila e o delayRender do carregamento estourava, derrubando o render.
//
// Rodar depois de trocar qualquer arquivo em public/fonts:
//   node scripts/build-fonts.mjs
import { readFileSync, writeFileSync } from "node:fs";

const faces = [
  { subset: "latin", weight: "700" },
  { subset: "latin", weight: "800" },
  { subset: "latin-ext", weight: "700" },
  { subset: "latin-ext", weight: "800" },
];

const css = faces
  .map(({ subset, weight }) => {
    const file = `public/fonts/montserrat-${subset}-${weight}-normal.woff2`;
    const b64 = readFileSync(file).toString("base64");
    return `@font-face{font-family:"Montserrat";font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
  })
  .join("\n");

writeFileSync(
  "src/fonts.generated.ts",
  `// GERADO por scripts/build-fonts.mjs — não editar à mão.\n` +
    `export const fontFaceCss = ${JSON.stringify(css)};\n`,
);
console.log(`src/fonts.generated.ts: ${(css.length / 1024).toFixed(0)} KB de CSS`);
