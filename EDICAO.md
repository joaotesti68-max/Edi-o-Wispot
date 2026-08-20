# Feature da Semana #2 — notas de edição

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
npx remotion render FeatureDaSemana out/feature-da-semana-02.mp4
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

## Trilha

`public/audio/theme.mp3` com volume variável (`musicVolume` em
`src/content.ts`): abre nos cards e no encerramento, onde ninguém fala, e recua
para um leito por baixo da voz da Mari — cerca de 16 dB abaixo dela. As rampas
caem dentro das transições. Para trocar a música, basta substituir o arquivo.
