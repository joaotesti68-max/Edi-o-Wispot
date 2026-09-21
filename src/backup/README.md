# Vídeo "Backup fora da empresa" — Pro Advanced

Vertical 1080x1920, 24 fps, ~59 s. Composição `ProAdvancedBackup`.

## Como as tomadas foram escolhidas

Os 13 clipes brutos foram transcritos (Whisper small, pt-BR) e cada corte foi
posicionado pela transcrição, não pela duração. O que ficou de fora:

| Clipe | O que tem | Destino |
|---|---|---|
| `c959243b` | abertura, limpa | **usado** 1,05–6,62 |
| `34c391bc` | "Na Pro Advanced… padrão Tier 3" | **usado** 0,92–7,50 |
| `4bd9cd78` | "Tá gravando?" + specs + "Então é isso?" | **usado só** 2,70–7,05 |
| `d53f9b88` | a regra 3-2-1 **três vezes** ("mais uma vez…") | **usado só** 9,25–12,50 (a última) |
| `690fe7b6` | detalhe da regra 3-2-1, limpo | **usado** 1,70–7,28 |
| `1e7c961a` | riscos + "pode cortar, ficou bem bom" | **usado só** 0,00–5,55 |
| `9bb9d7be` | "você mantém uma cópia preservada…" | **usado** 0,55–5,68 |
| `edd3a48e` | "E essa mesma infraestrutura…" | **usado** 0,66–5,14 |
| `78e65ae9` | fechamento, limpo | **usado** 0,52–6,12 |
| `40515b17` | CTA, sorrindo | **usado** 0,90–5,59 |
| `2e9ab0fc` | regra 3-2-1 interrompida + "pode cortar" | descartado |
| `33d18225` | mesma frase de `edd3a48e`, entrada cortada | descartado |
| `8db9e6cb` | conversa e risada antes do CTA | descartado |

## Duas frases do roteiro não existem no material

Nenhum clipe contém:

1. "Por isso, uma estratégia de backup segura precisa ter pelo menos uma cópia
   fora do ambiente principal."
2. "…como hospedagem de ambientes e equipamentos em hosting ou colocation."

Enquanto não forem gravadas, os dois trechos viram cartelas sem locução
(`layout: "card"`, `video: null`), com o texto do próprio roteiro e a trilha
subindo por cima. Gravando as falas, é só trocar `video` e `layout` nos blocos
`card-fora-do-ambiente` e `card-servicos`.

## Estrutura visual

- **Olhando para a câmera** (`layout: "full"`): rosto em tela cheia, headline
  embaixo e gráfico de apoio acima dela.
- **Lendo no papel** (`layout: "mockup"`): a imagem sai de cena por completo —
  fica só o mockup em tela cheia e a voz. São os blocos `datacenter-specs`
  (`4bd9cd78`) e `regra321-detalhe` (`690fe7b6`), os dois únicos em que ele lê.
- **Cartela** (`layout: "card"`): os dois trechos sem locução.

Os gráficos entram na palavra certa: os tempos em `graphicDelay` e os
escalonamentos internos vieram de transcrições em janelas incrementais de cada
take.

## Como trocar uma tomada

Todo o corte vive em `content.ts`. Gere o novo arquivo em `public/shots/` e
ajuste `video` + `durationInFrames` do bloco.

## Render

```console
npx remotion render src/index.ts ProAdvancedBackup out/pro-advanced-backup.mp4 --crf=18
```

Em ambientes sem download do Chromium do Remotion, aponte para um binário local
com `--browser-executable=<caminho>`.
