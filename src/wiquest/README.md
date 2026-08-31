# WiQuest — vídeo institucional (composição `WiQuest`)

Vertical 1080x1920, 30 fps, ~56 s. Fonte: os quatro takes da Mari
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

## Corte de silêncio

Cada take foi analisado por envelope de RMS (janela de 30 ms, limiar 16 dB
abaixo do pico do take). Só entra na edição o que está acima do limiar, com
0,10 s de folga na entrada e 0,22 s na saída; pausas menores que 0,35 s são
mantidas para a fala não ficar picotada. Os pontos resultantes estão em
`content.ts` (`blocks[].shots[].src`, em segundos do arquivo original).

Isso tira ~10 s de silêncio dos 58 s brutos. Como os cortes internos geram
saltos de imagem, takes vizinhos alternam entre enquadramento cheio e um
punch-in de 5% (`Shot.tsx`), e o áudio tem fade de 3 frames em cada emenda.

## Mapeamento take → roteiro

O roteiro tem cinco partes e vieram quatro takes. A associação foi deduzida
da duração de fala e do desenho das pausas de cada take:

| take | fala útil | trecho do roteiro |
| --- | --- | --- |
| `IMG_7922` | 12,5 s | Desenvolvimento 1 — "O WiQuest é a ferramenta..." |
| `IMG_7918` | 11,4 s | Desenvolvimento 2 — "Ele responde em segundos..." |
| `IMG_7929` | 15,9 s | Desenvolvimento 3 — "Do outro lado, esse feedback..." |
| `IMG_7932` | 7,6 s | Fechamento — "WiQuest, da Wispot..." |

`IMG_7932` é o mais seguro: as duas falas dele medem 1,6 s e 5,7 s, que é
exatamente o desenho de "WiQuest, da Wispot." + a frase final. Os três takes
de desenvolvimento batem com a contagem de sílabas de cada parágrafo na mesma
velocidade de fala (~4,7 sílabas/s) do take de fechamento.

**Não veio take da abertura.** A pergunta de abertura entra como cartela
tipográfica (`Hook.tsx`), sem locução, por cima da trilha. Se o take aparecer,
basta acrescentar um bloco no começo de `blocks` em `content.ts`.

Para trocar a ordem dos parágrafos, basta reordenar `blocks` — o restante da
linha do tempo (barra de progresso, legendas e inserts) é derivado dela.

## Inserts

Três inserts em tela cheia entram por cima da imagem enquanto o áudio da Mari
continua rodando:

1. `PhoneSurvey` — a pergunta dentro da tela de conexão do Wi-Fi.
2. `SpeedCompare` — resposta agora × pesquisa por e-mail três dias depois.
3. `Dashboard` — o feedback caindo no painel junto com frequência de visita e
   tempo de permanência. Os números do painel são ilustrativos e a peça diz
   isso em tela.

## Render

```console
npx remotion render src/index.ts WiQuest out/wiquest-wispot.mp4 --crf=18
```

Em ambientes sem o Chrome Headless Shell da Remotion, aponte para um Chromium
local com `--browser-executable=<caminho>`.
