/**
 * Legendas transcritas do áudio (Whisper small, pt, via sherpa-onnx) e
 * alinhadas ao clipe já cortado. Os quadros são relativos ao clipe, a 24 fps.
 *
 * O texto é o que ela efetivamente falou, que difere do roteiro escrito em
 * alguns pontos — as diferenças que importam para quem aprova estão no
 * `EDICAO.md`. É aqui que se corrige qualquer palavra.
 *
 * O modelo não devolve timestamps, então cada fronteira foi procurada: uma
 * estimativa silábica semeia os candidatos, cada candidato é pontuado pelos
 * dois lados — a janela que termina ali tem de fechar com a linha que sai, e a
 * que começa ali tem de abrir com a linha que entra — e o empate fica perto da
 * estimativa. Depois disso cada janela foi conferida uma a uma contra o
 * reconhecedor.
 *
 * Duas palavras são leitura, não transcrição limpa:
 *
 * - **"Wispot"** — o reconhecedor devolve "Esport" em toda tentativa, como
 *   devolvia "o spot" na série anterior.
 * - **"Com Wi-Fi inteligente"** — sai como "e se for inteligente" na janela
 *   curta e como "Com UEFA inteligente" na janela longa; o que está lá é
 *   "Wi-Fi".
 */
export type Caption = { text: string; from: number; to: number };

export const captions: Record<string, Caption[]> = {
  abertura: [
    { text: "Se você acha que o Wi-Fi serve", from: 4, to: 41 },
    { text: "apenas para conectar pessoas à internet,", from: 41, to: 97 },
    { text: "você pode estar usando", from: 97, to: 124 },
    { text: "somente uma parte do que ele pode oferecer.", from: 124, to: 179 },
  ],
  "parte-1": [
    { text: "Enquanto seus clientes se conectam,", from: 2, to: 42 },
    { text: "existe uma oportunidade acontecendo ali.", from: 42, to: 111 },
    { text: "Com Wi-Fi inteligente, você consegue entender", from: 111, to: 171 },
    { text: "quem está se conectando,", from: 171, to: 209 },
    { text: "com que frequência", from: 209, to: 230 },
    { text: "e como esse público se comporta.", from: 230, to: 280 },
  ],
  "parte-2": [
    { text: "E não para nos dados.", from: 0, to: 29 },
    { text: "A conexão pode virar uma pesquisa,", from: 29, to: 88 },
    { text: "uma comunicação, relacionamento", from: 88, to: 144 },
    { text: "e novas oportunidades de receita", from: 144, to: 195 },
    { text: "para o seu negócio.", from: 195, to: 217 },
  ],
  "parte-3": [
    { text: "É isso que a Wispot faz.", from: 2, to: 37 },
    { text: "Transforma redes Wi-Fi", from: 37, to: 76 },
    { text: "em uma ferramenta de captação", from: 76, to: 122 },
    { text: "de dados e relacionamento.", from: 122, to: 159 },
  ],
  "encerramento-a": [
    { text: "Porque as pessoas já estão", from: 3, to: 31 },
    { text: "se conectando ao seu Wi-Fi.", from: 31, to: 77 },
    { text: "Por que a sua empresa", from: 77, to: 102 },
    { text: "não deveria aproveitar melhor essa conexão?", from: 102, to: 164 },
  ],
  // Fora do roteiro: ela emenda o convite no fim do take, e ele leva direto ao
  // card final.
  "encerramento-b": [
    { text: "Para mais informações, fale conosco.", from: 2, to: 50 },
  ],
};
