# Feature da Semana #3 — notas de edição

Vídeo vertical 1080×1920, 30 fps, ~51,8 s. Composição Remotion: `FeatureDaSemana`.

## Cortes

Cada take de pergunta e resposta começava com a pergunta feita fora de quadro,
captada fraca pela lapela da Mari (8–10 dB abaixo da voz dela). Esses trechos
foram removidos no corte — as perguntas agora aparecem como cards.

Os `.mov` originais não ficam no repositório. Pontos usados para gerar
`public/videos/`:

| Origem      | Trecho cortado (pergunta) | Trecho mantido  | Saída            |
| ----------- | ------------------------- | --------------- | ---------------- |
| `IMG_7670`  | —                         | 1,00 → 14,30 s  | `abertura.mp4`   |
| `IMG_7672`  | 1,70 → 3,02 s             | 3,30 → 14,10 s  | `resposta-1.mp4` |
| `IMG_7677`  | 1,48 → 4,22 s             | 4,32 → 17,25 s  | `resposta-2.mp4` |
| `IMG_7680`  | 0,00 → 0,60 s (sobra)     | 1,70 → 9,45 s   | `fechamento.mp4` |

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

## Renderizar

```console
npx remotion render FeatureDaSemana out/feature-da-semana-03.mp4
```

## Logo

`src/WispotMark.tsx` recria a marca (arcos de Wi-Fi + "wispot" em Montserrat)
porque o repositório ainda tem só os assets da ProAdvanced. Com o PNG oficial em
`public/brand/`, basta trocar o conteúdo desse componente por um `<Img>`.
