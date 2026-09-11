import { continueRender, delayRender, staticFile } from "remotion";

export const fontFamily = "Montserrat";

const weights = ["700", "800"] as const;
const subsets = ["latin", "latin-ext"] as const;

// Mesmo carregamento que o loadFont de @remotion/fonts faria, mas com rede de
// segurança. Lá o delayRender só é liberado quando a promise da FontFace
// resolve, e nesse headless_shell ela às vezes não resolve nunca: o render do
// episódio 2 morreu depois de 118s esperando. Aqui o continueRender roda no
// finally e também num timeout curto, então uma fonte que não carrega degrada
// para a fonte de sistema em vez de derrubar o render inteiro.
const LOAD_BUDGET_MS = 8000;

for (const weight of weights) {
  for (const subset of subsets) {
    const handle = delayRender(`Carregando Montserrat ${subset} ${weight}`);
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      continueRender(handle);
    };

    const face = new FontFace(
      fontFamily,
      `url(${staticFile(`fonts/montserrat-${subset}-${weight}-normal.woff2`)})`,
      { weight, style: "normal" },
    );

    face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
      })
      .catch(() => {
        // deixa cair no fallback de sistema
      })
      .finally(release);

    setTimeout(release, LOAD_BUDGET_MS);
  }
}
