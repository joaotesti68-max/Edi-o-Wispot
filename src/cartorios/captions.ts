/**
 * Legendas do vídeo de cartórios, uma lista por bloco.
 *
 * Arquivo gerado por tools/align_captions.py: os tempos vêm do
 * alinhamento da narração e o texto, do roteiro revisado. Para mudar uma
 * frase, mude o texto em SCRIPT dentro do script e gere de novo, para o
 * texto e o tempo não saírem de sincronia.
 */

export type SpeechCaption = {
  from: number;
  to: number;
  lines: string[];
};

export const speechCaptions: Record<string, SpeechCaption[]> = {
  "abertura": [
    { from: 0.32, to: 2.56, lines: ["Uma nova lei já está em vigor"] },
    { from: 2.56, to: 4.88, lines: ["e pode multar cartórios", "que não estejam"] },
    { from: 4.88, to: 6.88, lines: ["adequados e seguros", "digitalmente."] },
    { from: 6.88, to: 8.40, lines: ["Se você ainda não está adequado,"] },
    { from: 8.40, to: 9.76, lines: ["esse vídeo aqui é pra você."] },
    { from: 9.76, to: 11.28, lines: ["Fica aqui comigo", "que eu vou te mostrar"] },
    { from: 11.28, to: 13.06, lines: ["um pouquinho de como", "a ProAdvanced pode te ajudar."] },
  ],
  "etapas": [
    { from: 0.16, to: 2.88, lines: ["Primeiro, analisamos", "e identificamos onde"] },
    { from: 2.88, to: 4.88, lines: ["estão os dados sensíveis", "dentro do seu ambiente"] },
    { from: 4.88, to: 7.04, lines: ["e qual é a exposição", "atual do risco."] },
    { from: 7.04, to: 9.68, lines: ["Depois disso, a gente", "entra com a parte técnica,"] },
    { from: 9.68, to: 11.52, lines: ["onde vamos fazer", "controle de acesso,"] },
    { from: 11.52, to: 13.84, lines: ["backup, gestão de usuários,"] },
    { from: 13.84, to: 16.00, lines: ["monitoramento ativo", "desse ambiente,"] },
    { from: 16.00, to: 17.94, lines: ["tudo dentro do que a lei", "está exigindo."] },
  ],
  "documentacao": [
    { from: 0.24, to: 3.04, lines: ["Por fim, nós documentamos", "e entregamos"] },
    { from: 3.04, to: 6.24, lines: ["a você todos os registros", "e evidências,"] },
    { from: 6.24, to: 7.60, lines: ["comprovando a partir de agora"] },
    { from: 7.60, to: 9.76, lines: ["que o seu cartório", "está dentro dos parâmetros"] },
    { from: 9.76, to: 11.22, lines: ["exigidos por essa nova lei."] },
  ],
  "fechamento": [
    { from: 0.16, to: 2.48, lines: ["Ainda dá tempo", "de se enquadrar à nova lei."] },
    { from: 2.48, to: 4.56, lines: ["Contate agora", "um de nossos especialistas"] },
    { from: 4.56, to: 6.48, lines: ["e inicie um diagnóstico", "para adequação"] },
    { from: 6.48, to: 8.50, lines: ["do seu cartório antes", "que o prazo feche."] },
  ],
};
