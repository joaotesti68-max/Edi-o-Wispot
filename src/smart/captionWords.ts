// Caption chunks per take: [word, start second in the take]. Times come
// from the Whisper transcript, with each take's first word moved to the
// speech onset. Takes whose sentence is already spelled out by the kinetic
// type (the hook, "Segurança não é só...", "...está preparada?") have none;
// an empty chunk just ends the one before it.
export type CaptionWord = [text: string, start: number];

export const captions: Record<string, CaptionWord[][]> = {
  img9450: [
    [["E", 0.25], ["o", 0.38], ["problema", 0.52]],
    [["não", 0.98], ["foi", 1.36], ["um", 1.54], ["hacker", 1.78]],
  ],
  img9452: [
    [["O", 0.18], ["Smart", 0.44], ["Sampa", 0.78]],
    [["é", 1.1], ["um", 1.46], ["sistema", 1.64]],
    [["de", 2.1], ["monitoramento", 2.38]],
    [["e", 3.16], ["reconhecimento", 3.56], ["facial", 4.16]],
    [["na", 4.74], ["cidade", 5.14]],
    [["de", 5.42], ["São", 5.58], ["Paulo", 5.78]],
  ],
  img9453: [
    [["com", 0.31], ["mais", 0.5], ["de", 0.78]],
    [["50", 1.02], ["mil", 1.32], ["câmeras", 1.5]],
  ],
  img9457: [
    [["Um", 0.09], ["servidor", 0.26]],
    [["publicou", 0.8], ["dados", 1.64]],
    [["do", 1.96], ["sistema", 2.14]],
    [["na", 2.66], ["internet", 2.92]],
    [["de", 3.28], ["forma", 3.48], ["ilegal", 3.72]],
  ],
  img9459: [
    [["A", 0.63], ["prefeitura", 0.86], ["diz", 1.34]],
    [["que", 1.62], ["não", 1.84], ["houve", 2.0]],
    [["falha", 2.24], ["na", 2.5], ["plataforma", 2.62]],
  ],
  img9461: [
    [["E", 0.49], ["é", 0.66], ["exatamente", 0.84], ["isso", 1.3]],
    // the alert graphic spells out the rest
    [["", 1.6]],
  ],
  img9467: [
    [["Quando", 0.07], ["o", 0.34], ["vazamento", 0.5]],
    [["vem", 0.84], ["de", 1.02], ["dentro,", 1.18]],
    [["firewall", 1.79], ["nenhum", 2.1]],
    [["resolve", 2.42]],
  ],
  img9469: [
    [["É", 0.76], ["saber", 0.9]],
    [["quem", 1.44], ["lá", 1.72], ["dentro", 1.98]],
    [["está", 2.54], ["acessando", 2.92]],
    [["o", 3.48], ["quê?", 3.58]],
  ],
  img9471: [
    [["Fale", 0.2], ["com", 0.46], ["a", 0.66]],
    [["Pro", 0.8], ["Advanced", 1.05]],
  ],
};
