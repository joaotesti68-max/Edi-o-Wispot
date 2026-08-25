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
    { from: 0.00, to: 1.92, lines: ["Uma nova lei já está em vigor"] },
    { from: 1.92, to: 4.16, lines: ["e pode multar cartórios", "que não estejam"] },
    { from: 4.16, to: 5.84, lines: ["adequados e seguros", "digitalmente."] },
    { from: 5.84, to: 8.32, lines: ["Se você ainda não está adequado,", "esse vídeo aqui é pra você."] },
    { from: 8.32, to: 9.68, lines: ["Fica aqui comigo", "que eu vou te mostrar"] },
    { from: 9.68, to: 11.46, lines: ["um pouquinho de como", "a ProAdvanced pode te ajudar."] },
  ],
  "etapas": [
    { from: 0.00, to: 2.48, lines: ["Primeiro, analisamos", "e identificamos"] },
    { from: 2.48, to: 4.80, lines: ["onde estão os dados sensíveis", "dentro do seu ambiente"] },
    { from: 4.80, to: 6.72, lines: ["e qual é a exposição", "atual do risco."] },
    { from: 6.72, to: 8.88, lines: ["Depois disso, a gente", "entra com a parte técnica,"] },
    { from: 8.88, to: 10.64, lines: ["onde vamos fazer", "controle de acesso,"] },
    { from: 10.64, to: 12.96, lines: ["backup, gestão de usuários,"] },
    { from: 12.96, to: 15.12, lines: ["monitoramento ativo", "desse ambiente,"] },
    { from: 15.12, to: 17.06, lines: ["tudo dentro do que a lei", "está exigindo."] },
  ],
  "documentacao": [
    { from: 0.00, to: 1.84, lines: ["Por fim, nós documentamos"] },
    { from: 1.84, to: 4.40, lines: ["e entregamos a você", "todos os registros"] },
    { from: 4.40, to: 6.96, lines: ["e evidências, comprovando", "a partir de agora"] },
    { from: 6.96, to: 9.04, lines: ["que o seu cartório", "está dentro dos parâmetros"] },
    { from: 9.04, to: 10.42, lines: ["exigidos por essa nova lei."] },
  ],
  "fechamento": [
    { from: 0.00, to: 2.32, lines: ["Ainda dá tempo", "de se enquadrar à nova lei."] },
    { from: 2.32, to: 4.40, lines: ["Contate agora", "um de nossos especialistas"] },
    { from: 4.40, to: 6.32, lines: ["e inicie um diagnóstico", "para adequação"] },
    { from: 6.32, to: 8.26, lines: ["do seu cartório antes", "que o prazo feche."] },
  ],
};
