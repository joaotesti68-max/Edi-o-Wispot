/**
 * Legendas transcritas do áudio (Whisper small, pt, via sherpa-onnx) e alinhadas
 * ao clipe já cortado.
 *
 * O texto é o que a Mari efetivamente falou, que difere do roteiro escrito; é
 * aqui que se corrige qualquer palavra. Os quadros são relativos ao clipe.
 *
 * O modelo não devolve timestamps, então cada fronteira foi procurada: para
 * cada linha, janelas de 2,2 s a partir de vários instantes foram reconhecidas
 * e ficou o instante cuja transcrição melhor abria com as palavras esperadas.
 * Um segundo passe pontuou cada fronteira pelos dois lados e a encostou no vale
 * de silêncio mais próximo, que é onde a troca passa despercebida.
 */
export type Caption = { text: string; from: number; to: number };

export const captions: Record<string, Caption[]> = {
  "abertura": [
    { text: "Fechando o mês com mais uma rodada", from: 4, to: 57 },
    { text: "de dúvidas sobre a Wispot.", from: 57, to: 86 },
    { text: "Eu sou a Mari, e hoje é comigo.", from: 86, to: 155 },
  ],
  "resposta-1": [
    { text: "Dá sim.", from: 1, to: 26 },
    { text: "Os dados que são coletados", from: 26, to: 64 },
    { text: "não ficam presos dentro da nossa ferramenta.", from: 64, to: 140 },
    { text: "Eles alimentam as ferramentas", from: 140, to: 198 },
    { text: "que o seu time usa no dia a dia.", from: 198, to: 254 },
  ],
  "resposta-2": [
    { text: "Nosso time continua junto.", from: 1, to: 42 },
    { text: "Você tem total suporte", from: 42, to: 86 },
    { text: "para qualquer mudança que você queira fazer no painel.", from: 86, to: 191 },
    { text: "Seja uma campanha,", from: 191, to: 215 },
    { text: "seja um dado que você queira captar novo dos seus visitantes.", from: 215, to: 329 },
    { text: "Você vai ter todo o suporte necessário", from: 329, to: 384 },
    { text: "para operar o seu painel Wispot.", from: 384, to: 460 },
  ],
  "resposta-3": [
    { text: "Consegue sim.", from: 5, to: 36 },
    { text: "A gente consegue unificar todas as suas unidades", from: 36, to: 122 },
    { text: "ou as suas filiais no mesmo painel,", from: 122, to: 196 },
    { text: "e separá-las para que você consiga", from: 196, to: 254 },
    { text: "visualizá-las totalmente separadamente,", from: 254, to: 327 },
    { text: "e também fazer configurações diferentes", from: 327, to: 406 },
    { text: "para cada um desses locais.", from: 406, to: 453 },
  ],
  "fechamento": [
    { text: "Esse foi o último vídeo do mês,", from: 1, to: 53 },
    { text: "mas a série continua em setembro.", from: 53, to: 105 },
    { text: "Então nos acompanhe para conhecer mais", from: 105, to: 167 },
    { text: "sobre as funcionalidades da Wispot na prática.", from: 167, to: 244 },
    { text: "Segue aqui para não perder.", from: 244, to: 284 },
  ],
};
