/**
 * Deslocamento que desaparece quando a animação assenta.
 *
 * Um `transform` parado — mesmo um `translateX(0px)` — mantém o elemento numa
 * camada composta, e o Chromium reescreve o texto dessa camada com frações de
 * pixel um pouco diferentes de um quadro para o outro. Em texto pequeno e
 * espaçado, como as etiquetas em caixa alta, isso aparece como um tremor. Sem
 * transform nenhum, a rasterização é a mesma todo quadro.
 *
 * Por isso as entradas devolvem o estilo por aqui, em vez de escrever o
 * `transform` direto: assim que o valor chega a zero, a propriedade some.
 */
const REST = 0.01;

export const slideY = (pixels: number) =>
  Math.abs(pixels) < REST ? {} : { transform: `translateY(${pixels}px)` };

export const slideX = (pixels: number) =>
  Math.abs(pixels) < REST ? {} : { transform: `translateX(${pixels}px)` };

/**
 * Mesma ideia para o crescimento de réguas e filetes — e há um segundo motivo
 * para eles crescerem por `scaleX` e não por `width`: animar largura remexe o
 * layout da linha inteira a cada quadro, e o texto ao lado acaba rasterizado em
 * posições ligeiramente diferentes. Transform não toca no layout.
 */
export const scaleX = (factor: number) =>
  Math.abs(factor - 1) < REST ? {} : { transform: `scaleX(${factor})` };

export const scaleY = (factor: number) =>
  Math.abs(factor - 1) < REST ? {} : { transform: `scaleY(${factor})` };
