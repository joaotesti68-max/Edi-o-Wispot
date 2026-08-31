# WiQuest — vídeo institucional (composição `WiQuest`)

Vertical 1080x1920, 30 fps, ~51 s. Fonte: os quatro takes da Mari
(`IMG_7918`, `IMG_7922`, `IMG_7929`, `IMG_7932`), transcodificados para
`public/wiquest/videos/`.

## Referências de marca

Tiradas do **Manual de Marca – Wispot – 2026** (Google Drive):

| item | valor |
| --- | --- |
| azul institucional | `#25a8e0` |
| branco | `#ffffff` |
| cinza | `#514d4b` |
| degradê | `#25a8e0 → #0b91c1` |
| tipografia | Montserrat (o manual também cita Adineue Pro, que não está no repo) |

O logo e o ícone em `public/wiquest/brand/` foram recortados do
`wispot_colorido.png` original (Drive) — versões branca e colorida, sem
alterar proporção nem cor da marca, como pede o manual.

## Ordem dos blocos

O vídeo abre direto no take, sem cartela, e segue a ordem do roteiro:

| ordem | take | fala útil | trecho do roteiro |
| --- | --- | --- | --- |
| 1 | `IMG_7918` | 11,2 s | Desenvolvimento 1 — "O WiQuest é a ferramenta..." |
| 2 | `IMG_7922` | 12,3 s | Desenvolvimento 2 — "Ele responde em segundos..." |
| 3 | `IMG_7929` | 15,6 s | Desenvolvimento 3 — "Do outro lado, esse feedback..." |
| 4 | `IMG_7932` | 7,5 s | Fechamento — "WiQuest, da Wispot..." |

**Não veio take da abertura do roteiro** ("Você sabe o que o seu cliente achou
da visita de hoje?"). Se ele aparecer, é só acrescentar um bloco no começo de
`blocks`, em `content.ts` — barra de progresso, legendas e inserts são todos
derivados dessa lista.

## Corte de silêncio

Cada take foi analisado por envelope de RMS (janela de 30 ms, limiar 16 dB
abaixo do pico do take). Só entra na edição o que está acima do limiar, com
0,08 s de folga na entrada e 0,15 s na saída; pausas menores que 0,22 s são
mantidas para a fala não ficar picotada. Os pontos resultantes estão em
`content.ts` (`blocks[].shots[].src`, em segundos do arquivo original).

Isso tira ~11 s de silêncio dos 58 s brutos. Como os cortes internos geram
saltos de imagem, takes vizinhos alternam entre enquadramento cheio e um
punch-in de 5% (`Shot.tsx`). O áudio tem só 1 frame de rampa em cada emenda —
o suficiente para não estalar, sem abrir buraco nos cortes justos.

Os takes também chegaram com 3,5 dB de diferença de volume de fala entre si;
`blocks[].gain` iguala os quatro em RMS -23,5 dB, com pico real abaixo de
-1,8 dBFS.

## Inserts

Três inserts em tela cheia entram por cima da imagem enquanto o áudio da Mari
continua rodando:

1. `PhoneSurvey` — a pergunta dentro da tela de conexão do Wi-Fi.
2. `SpeedCompare` — resposta agora × pesquisa por e-mail três dias depois.
3. `Dashboard` — o feedback caindo no painel junto com frequência de visita e
   tempo de permanência. Os números do painel são ilustrativos e a peça diz
   isso em tela.

## Trilha

`public/wiquest/audio/leberch-corporate.mp3` (3:28; o vídeo usa os primeiros
51 s). A faixa vem masterizada em RMS -14 dB, bem mais quente que a fala
(RMS -23,5 dB), por isso o ganho é baixo: 0,05 no corpo do vídeo — 17 dB
abaixo da voz — subindo para 0,2 na cartela final e fechando com 1 s de
fade. A curva está em `musicVolume`, em `WiQuestVideo.tsx`.

## Render

```console
npx remotion render src/index.ts WiQuest out/wiquest-wispot.mp4 --crf=18
```

Em ambientes sem o Chrome Headless Shell da Remotion, aponte para um Chromium
local com `--browser-executable=<caminho>`.
