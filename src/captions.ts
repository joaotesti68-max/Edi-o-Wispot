/**
 * Legendas transcritas do áudio (Whisper small, pt, via sherpa-onnx) e alinhadas
 * ao clipe já cortado.
 *
 * O texto é o que a Mari efetivamente falou, que difere do roteiro escrito; é
 * aqui que se corrige qualquer palavra. Os quadros são relativos ao clipe.
 *
 * O modelo não devolve timestamps, então cada fronteira foi procurada: uma
 * estimativa silábica semeia os candidatos, cada candidato é pontuado pelos
 * dois lados — a janela que termina ali tem de fechar com a linha que sai, e a
 * que começa ali tem de abrir com a linha que entra — e o vencedor é encostado
 * no vale de silêncio mais próximo, que é onde a troca passa despercebida.
 * As fronteiras foram conferidas uma a uma depois disso.
 */
export type Caption = { text: string; from: number; to: number };

export const captions: Record<string, Caption[]> = {
  "abertura": [
    { text: "Olá, pessoal! Aqui é a Mari de novo.", from: 1, to: 58 },
    { text: "Então vamos para mais um vídeo", from: 58, to: 113 },
    { text: "respondendo perguntas sobre a Wispot.", from: 113, to: 179 },
  ],
  "resposta-1": [
    { text: "A Wispot é indicada para empresas", from: 1, to: 51 },
    { text: "que possuem algum espaço físico.", from: 51, to: 103 },
    { text: "Então hotéis, grandes hospitais,", from: 103, to: 191 },
    { text: "redes de varejo como farmácias,", from: 191, to: 261 },
    { text: "supermercados, cidades inteligentes", from: 261, to: 351 },
    { text: "e até para provedores de internet.", from: 351, to: 416 },
  ],
  "resposta-2": [
    { text: "A Wispot pode ser classificada", from: 1, to: 48 },
    { text: "como serviço de valor adicionado.", from: 48, to: 121 },
    { text: "Então, além de gerar uma fonte de receita", from: 121, to: 205 },
    { text: "a mais para o provedor de internet,", from: 205, to: 266 },
    { text: "também contribui na questão tributária dos impostos,", from: 266, to: 366 },
    { text: "sempre de acordo com o segmento da empresa", from: 366, to: 445 },
    { text: "e também dentro das conformidades", from: 445, to: 500 },
    { text: "jurídicas e contábeis.", from: 500, to: 551 },
  ],
  "resposta-3": [
    { text: "Hoje a Wispot trabalha", from: 1, to: 27 },
    { text: "com mais de 20 fabricantes.", from: 27, to: 82 },
    { text: "Dentre eles temos Huawei, Cambium,", from: 82, to: 129 },
    { text: "Cisco, Aruba, MikroTik.", from: 129, to: 229 },
    { text: "E assim a Wispot consegue se adaptar", from: 229, to: 307 },
    { text: "a várias estruturas de rede.", from: 307, to: 362 },
  ],
  "resposta-4": [
    // "Com a WiQuest," sozinho ficaria meio segundo no ar — curto demais para
    // ler —, então abre junto com a linha seguinte.
    { text: "Com a WiQuest, a ferramenta de pesquisas da Wispot,", from: 1, to: 82 },
    { text: "você consegue aplicar pesquisas", from: 82, to: 153 },
    { text: "com o cliente final", from: 153, to: 197 },
    { text: "dentro do seu estabelecimento,", from: 197, to: 260 },
    { text: "recebendo essas respostas em tempo real", from: 260, to: 319 },
    { text: "dentro do painel.", from: 319, to: 355 },
  ],
  "fechamento": [
    { text: "Para entender como a Wispot funciona", from: 1, to: 49 },
    { text: "para o seu negócio,", from: 49, to: 86 },
    { text: "entre em contato conosco.", from: 86, to: 128 },
  ],
};
