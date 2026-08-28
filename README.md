# Vídeo ProAdvanced — prazo da nova lei para cartórios

Vídeo vertical (1080x1920, 24fps) montado em [Remotion](https://remotion.dev),
com o João Dourado na câmera.

## Fluxo de edição

O material bruto não fica no repositório. O processo é de dois passos:

1. Coloque as gravações em `footage/raw/` (`.MOV` ou `.mp4`).
2. Rode `npm run footage`.

O script `scripts/prepare-footage.mjs` faz três coisas para cada arquivo:

- converte para MP4 vertical 1080x1920 em `public/videos/`;
- mede a duração real com `ffprobe`;
- detecta os silêncios e monta os trechos de fala.

Pausas acima de 0,62s são removidas, com 0,14s de sobra nas bordas para não
decepar o ataque das palavras.

Alguns cortes a detecção não pega: as deixas da direção fora de quadro
("pode ir", "boa") e um "hm" solto têm o mesmo nível da fala do João. Esses
saem por janela manual, no mapa `KEEP` do script — as janelas foram medidas
com `silencedetect` a -38dB, ilha por ilha.

Cada take também é normalizado para -16 LUFS com teto de -1,5dB, porque são
gravações separadas e chegam em volumes diferentes.

A fala é acelerada em 8% (`SPEED`). O `atempo` corrige o pitch, então a voz
não fica fina, e o `setpts` acelera a imagem junto para o sincronismo labial
não quebrar nos blocos em que ele aparece em cena. Duas armadilhas aqui:

- a taxa final vai no encoder (`-r`), não num filtro `fps` depois do `setpts`
  — o filtro `fps` re-cronometra os quadros e desfaz a aceleração;
- o recorte manual vai no lado da **entrada** (`-ss`/`-t` antes do `-i`) —
  do lado da saída o `-to` passa a valer sobre a linha de tempo já acelerada
  e corta o clipe no lugar errado.

O resultado vai para `src/footage.ts`, que a composição consome.

Depois é só `npm run dev` para abrir o estúdio.

## Onde mexer

| Arquivo | O que faz |
| --- | --- |
| `src/content.ts` | Roteiro: blocos, headlines, kickers e o mapa fala → clipe (`CLIP_IDS`) |
| `src/Clip.tsx` | Toca os trechos de fala em sequência e reenquadra a cada corte |
| `src/Visuals.tsx` | Os cinco elementos gráficos (prazo, calendário, risco, etapas, CTA) |
| `src/Headline.tsx` | Kicker + headline com o destaque na cor da marca |
| `src/NameCard.tsx` | Card de identificação na abertura |
| `src/Music.tsx` | Dinâmica da trilha (entra, recua na fala, cresce no fechamento) |
| `src/BlockView.tsx` | Empilha vídeo, máscara, marca d'água, name card, gráfico e headline |
| `src/Takeover.tsx` | Estoura o gráfico em tela cheia sobre o vídeo de ambiente |
| `src/brand.ts` | Cores, tipografia e logos do manual de marca |

Se a ordem das tomadas for diferente da esperada, o ajuste é só em `CLIP_IDS`
em `src/content.ts` — os ids vêm do nome do arquivo (`IMG_7949.MOV` → `img-7949`).

## Dinamismo

A gravação é bem estática, então o movimento vem da montagem:

- uma aproximação lenta e contínua ao longo do vídeo inteiro: a escala é
  função do frame absoluto da composição, não do trecho, então os cortes de
  silêncio e as viradas de take não mexem no enquadramento. O movimento nunca
  salta nem oscila — só se aproxima (`ZOOM_FROM`/`ZOOM_TO` em `Clip.tsx`);
- os painéis gráficos acompanham a fala: o checklist marca cada etapa quando
  ele a cita, e a CTA do fechamento entra junto com "fale com a gente agora"
  (ver `takeStartsFor` em `content.ts`);
- a trilha recua durante a fala e cresce no fechamento.

## Identidade

Tudo sai do *Brandbook ProAdvanced — Manual de Marca 2026*: `#3696cd`,
`#20a3d6`, `#676868`, `#ffffff`, tipografia Montserrat e o sistema de
transparências (30% / 60% / 100%) da cor principal.

## Enquadramento

O material chega como 1920x1080 com `rotation=-90` nos metadados: é vertical,
gravado com o sensor girado. O ffmpeg aplica a rotação sozinho e entrega
1080x1920, então o transcode é passagem direta no tamanho final.

João aparece sentado, com as mãos gesticulando entre 62% e 88% da altura do
quadro. O conjunto de gráfico + headline fica ancorado abaixo dessa faixa
para os gestos continuarem visíveis — é o pouco de movimento que a gravação
tem, e cobrir isso anula o resto do trabalho.

## Prazos da norma

O gráfico do bloco de prazo segue o [Provimento CNJ 213/2026](https://atos.cnj.jus.br/atos/detalhar/6734),
com os prazos ampliados pelo Provimento 243/2026: o limite depende da classe
de faturamento da serventia, não de uma data única.

| Classe | Etapas iniciais | Conclusão |
| --- | --- | --- |
| 3 (maior porte) | 180 dias | 24 meses |
| 2 (porte médio) | 240 dias | 30 meses |
| 1 (menor porte) | 300 dias | 36 meses |

Corregedorias locais podem conceder prorrogação fundamentada em casos
excepcionais.

**Atenção:** a narração gravada ainda diz "entre agosto e outubro deste ano"
e "faltam poucas semanas", que vêm da redação antiga do roteiro. O gráfico
está correto, a fala não — essas duas linhas precisam ser regravadas para o
vídeo ficar consistente.

## Takeover de tela cheia

Na abertura o João aparece só nos 2s iniciais — o suficiente para o público
ver quem fala, com o name card cumprindo a função. Dali em diante a imagem
passa para os vídeos de ambiente, rebaixados e desfocados, com a tinta da
marca por cima e o elemento de prazo em tela cheia.

A fala continua rodando por baixo: o que troca é a imagem, não o áudio.

A configuração fica em `takeover` no bloco, em frames relativos ao bloco:

- `from` / `to` — quando entra e sai. Um `to` além da duração do bloco (aqui
  320 contra 304 frames) mantém a tela cheia até o fim, e a transição leva
  direto ao bloco seguinte em vez de voltar ao João por um instante.
- `beats` — o texto e o vídeo de fundo viram junto com a fala. A segunda frase
  da abertura começa em 6,79s, então o segundo tempo entra no frame 200.
  Cada tempo tem seu `clip`: `ambiente-monitoramento.mp4` (dashboards) no
  trecho sobre segurança da informação, `ambiente-cartorio.mp4` (atendimento,
  documentos) no "se você ainda não se preparou".

O fundo faz travessia cruzada, para a cena trocar sem piscar. O texto não: um
sai antes do outro entrar, porque dois textos sobrepostos ficam ilegíveis no
meio da travessia. São duas curvas separadas, `beatOpacity` e
`beatTextOpacity`.

Cada fundo fica dentro de uma `Sequence`, para o clipe começar do zero quando
o tempo entra em vez de continuar do tempo do bloco.

Os overlays normais (name card, gráfico, headline, marca d'água) somem na
mesma curva, via `takeoverProgress`.

Para achar janelas assim em outros blocos: amostre o clipe com
`ffmpeg -i ... -vf fps=5,drawtext=...` e olhe o contact sheet.
