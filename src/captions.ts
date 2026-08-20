/**
 * Legendas transcritas do áudio (Whisper small, pt) e alinhadas ao tempo de
 * fala de cada clipe, com +3 quadros de ajuste — o offset que deu a melhor
 * sobreposição ao reconhecer de volta cada janela de legenda.
 *
 * O texto é o que a Mari efetivamente falou, que difere do roteiro escrito;
 * é aqui que se corrige qualquer palavra. Os quadros são relativos ao clipe.
 */
export type Caption = { text: string; from: number; to: number };

export const captions: Record<string, Caption[]> = {
  "abertura": [
    { text: "Olá, eu sou a Mari.", from: 9, to: 39 },
    { text: "Reunimos com o time comercial quais são", from: 39, to: 106 },
    { text: "as principais dúvidas que aparecem no dia", from: 106, to: 179 },
    { text: "a dia dos atendimentos.", from: 179, to: 214 },
    { text: "Então, bora lá para mais uma série de perguntas", from: 214, to: 304 },
    { text: "e respostas sobre as funcionalidades da Wispot.", from: 304, to: 381 },
  ],
  "resposta-1": [
    { text: "No geral, poucos dias.", from: 12, to: 37 },
    { text: "A configuração é feita em conjunto", from: 37, to: 97 },
    { text: "com o seu time de TI ou com um parceiro", from: 97, to: 163 },
    { text: "que cuida da sua infraestrutura,", from: 163, to: 231 },
    { text: "e a gente acompanha o processo até o portal estar no ar.", from: 231, to: 323 },
  ],
  "resposta-2": [
    { text: "Não precisa.", from: 11, to: 29 },
    { text: "Ele vai buscar a sua rede Wi-Fi,", from: 29, to: 82 },
    { text: "o portal cativo vai abrir para ele,", from: 82, to: 147 },
    { text: "ele vai fazer um cadastro em poucos segundos", from: 147, to: 220 },
    { text: "e já vai sair navegando.", from: 220, to: 263 },
    { text: "Sem a necessidade de um aplicativo", from: 263, to: 335 },
    { text: "e muito menos de senha na parede.", from: 335, to: 385 },
  ],
  "fechamento": [
    { text: "Tire a sua dúvida também.", from: 18, to: 53 },
    { text: "Deixe uma mensagem para a gente ou um comentário", from: 53, to: 131 },
    { text: "aqui embaixo, que a gente vai responder", from: 131, to: 185 },
    { text: "a sua dúvida no próximo vídeo.", from: 185, to: 229 },
  ],
};
