# Perguntas e Respostas — fechamento de agosto

Vídeo vertical 1080×1920, 30 fps, ~63,1 s. Composição Remotion: `FeatureDaSemana`.

Terceiro vídeo da série de perguntas e respostas, gravado com a Mari. Fecha o
mês: a abertura anuncia a última rodada de agosto e o encerramento aponta para
setembro.

## Cortes

Cada take de pergunta e resposta começava com a pergunta feita fora de quadro,
captada fraca pela lapela da Mari (6–10 dB abaixo da voz dela). Esses trechos
foram removidos no corte — as perguntas agora aparecem como cards.

Os `.mov` originais não ficam no repositório. Pontos usados para gerar
`public/videos/`:

| Origem     | Trecho cortado (pergunta) | Trecho mantido   | Saída            |
| ---------- | ------------------------- | ---------------- | ---------------- |
| `IMG_7683` | —                         | 1,00 → 6,20 s    | `abertura.mp4`   |
| `IMG_7686` | 1,00 → 2,90 s             | 3,08 → 11,60 s   | `resposta-1.mp4` |
| `IMG_7688` | 0,80 → 2,45 s             | 2,70 → 18,10 s   | `resposta-2.mp4` |
| `IMG_7689` | 0,85 → 3,40 s             | 3,62 → 18,95 s   | `resposta-3.mp4` |
| `IMG_7691` | —                         | 0,85 → 10,45 s   | `fechamento.mp4` |

As fronteiras não foram estimadas no olho: em cada take o áudio foi varrido em
janelas curtas com o reconhecedor, e o corte ficou no primeiro instante em que a
transcrição já abria pela resposta da Mari, dentro do vale de silêncio entre a
pergunta e ela.

Comando por clipe (rotação do iPhone já aplicada, áudio nivelado em -16 LUFS):

```console
ffmpeg -ss <inicio> -to <fim> -i <origem>.mov \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -r 30 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.10" \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart <saida>.mp4
```

## Estrutura

O roteiro fica em `src/content.ts` — texto das perguntas, duração de cada
segmento e a faixa de lembrete que aparece sobre as respostas.

| # | Pergunta (card) | Resposta |
| - | --------------- | -------- |
| 1 | Dá pra integrar com o CRM que eu já uso? | `resposta-1.mp4` |
| 2 | Depois que instala, quem atende? | `resposta-2.mp4` |
| 3 | Tenho vários pontos de acesso. Consigo ver tudo junto? | `resposta-3.mp4` |

Ressalva na pergunta 1: a sigla sai muito abafada no take (a pergunta é feita
longe da lapela) e o reconhecedor devolve "série"/"serre" em toda tentativa,
com ganho ou sem. "CRM" é a leitura que casa com o som e com a resposta dela,
sobre os dados alimentarem as ferramentas que o time já usa — mas é uma leitura,
não uma transcrição limpa. Se tiver sido outra palavra, é trocar em
`src/content.ts`.

## Renderizar

```console
npx remotion render FeatureDaSemana out/perguntas-respostas-agosto.mp4
```

## Marca

Cores e tipografia saíram do *Manual de Marca - Wispot - 2026* (Drive), em
`src/brand.ts`:

| | |
| --- | --- |
| Azul | `#25a8e0` |
| Cinza | `#514d4b` |
| Branco | `#ffffff` |
| Degradê | `#25a8e0` → `#0b91c1` |

Tipografia institucional: Adineue Pro e Montserrat. Adineue Pro é licenciada e
não está empacotada — o vídeo usa Montserrat, que o manual lista com o mesmo
peso de uso.

A logomarca oficial saiu do `wispot_colorido.png` (Drive), recortada no alpha.
O manual só autoriza duas versões, branca e `#25a8e0`, e é o que
`src/WispotMark.tsx` expõe:

| Arquivo | Uso |
| --- | --- |
| `wispot-white.png` | rodapé dos clipes e card final |
| `wispot-color.png` | versão azul, sobre fundo claro |
| `wispot-icon-*.png` | símbolo de Wi-Fi (arcos + ponto), ao lado de texto curto |

## Legendas

`src/captions.ts` — texto e quadros de cada legenda, relativos ao clipe.

O texto veio de transcrição do próprio áudio (Whisper small em português, via
sherpa-onnx), **não** do roteiro: a Mari improvisa bastante, e o que ela fala
difere do texto escrito. Corrija palavras nesse arquivo, não no roteiro.

O modelo não devolve timestamps, então cada fronteira foi procurada. Primeiro
passe: para cada linha, janelas de 2,2 s a partir de vários instantes são
reconhecidas e fica o instante cuja transcrição melhor abre com as palavras
esperadas, com a busca semeada por uma estimativa silábica sobre o tempo de
fala. Segundo passe: cada fronteira é pontuada pelos dois lados — a linha que
fecha e a que abre — e encostada no vale de silêncio mais próximo, que é onde a
troca passa despercebida. Isso substituiu o ajuste fixo de +3 quadros da versão
anterior, que existia só para compensar a distribuição silábica.

## Trilha

`public/audio/theme.mp3` — *Lite Saturation Motivation*, 110 BPM, instrumental,
fornecida pelo cliente. Do arquivo original (93,9 s) saem os 64,6 s usados aqui.

Dois tratamentos antes de entrar:

- **Corte com a grade do compasso.** O primeiro tempo forte da faixa cai em
  2,181 s e o compasso dura 2,1818 s. Cortando 0,673 s da cabeça, o tempo forte
  do compasso 28 cai no quadro 1878 — quinze quadros antes do fim. O vídeo
  fecha em cima da batida em vez de cortar no meio de um compasso, e o fade
  final (`MUSIC_FADE_OUT`) é curto justamente para entrar só depois dela.
- **Nivelamento entre seções.** A faixa abre discreta, ganha os chimbais aos
  19 s e estoura no refrão aos 36 s — uma variação de 12 dB. Sob a voz da Mari
  isso significaria trilha inaudível no começo e brigando com ela no fim. Um
  compressor lento fecha essa variação para 4,8 dB, preservando o arco:

```console
ffmpeg -ss 0.673 -t 64.6 -i <original>.mp3 \
  -af "acompressor=threshold=-26dB:ratio=3:attack=300:release=2500,volume=8dB,\
       alimiter=limit=0.94:level=disabled,afade=t=in:st=0:d=0.6" \
  -c:a libmp3lame -b:a 192k -ar 44100 public/audio/theme.mp3
```

Resultado: -19,1 dB RMS na abertura, -14,3 dB no trecho final, pico -0,5 dBFS.

Por cima disso o volume ainda varia no `musicVolume` (`src/content.ts`): abre
nos cards e no encerramento, onde ninguém fala, e recua para um leito por baixo
da voz da Mari — cerca de 17 dB abaixo dela. As rampas caem dentro das
transições. Para trocar a música, refaça o corte acima com a faixa nova — os
números do compasso mudam com o BPM.

Mixagem final: -16,4 LUFS integrado, pico real -1,1 dBTP.
