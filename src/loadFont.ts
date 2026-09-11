import { fontFaceCss } from "./fonts.generated";

export const fontFamily = "Montserrat";

// As Montserrat vão embutidas como data URI (ver scripts/build-fonts.mjs), não
// por URL. Carregar por URL fazia a fonte disputar as 6 conexões por origem do
// Chrome com os frames que o OffthreadVideo puxa do mesmo servidor local; no
// episódio 2, com 7 vídeos, a fonte ficava na fila e o delayRender que
// esperava por ela estourava, derrubando o render.
//
// Sem rede não há espera, então também não há delayRender: nada aqui pode
// travar o render.
if (typeof document !== "undefined" && !document.getElementById("wispot-fonts")) {
  const style = document.createElement("style");
  style.id = "wispot-fonts";
  style.textContent = fontFaceCss;
  document.head.appendChild(style);
}
