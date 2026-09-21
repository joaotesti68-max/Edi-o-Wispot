# Vídeo "Backup fora da empresa" — Pro Advanced

Vertical 1080x1920, 24 fps, ~58 s. Composição `ProAdvancedBackup`.

## Seleção das tomadas

13 clipes foram enviados; 8 entraram no corte final. A escolha considerou:
fala contínua (sem gaguejo/pausa longa), take mais completo da frase e energia
na entrega.

| # | Frase do roteiro | Clipe usado | Trecho | Descartados |
|---|---|---|---|---|
| 1 | "Se todas as cópias do seu backup estão dentro da empresa…" | `78e65ae9` | 0,45–6,30 s | `c959243b` (outro take) |
| 2 | "Por isso, uma estratégia de backup segura…" | `34c391bc` | 0,85–7,35 s | — |
| 3 | "Na Pro Advanced, essa cópia pode ficar protegida… Tier 3…" | `4bd9cd78` (lendo no papel) | 0,55–7,15 s + 9,10–11,82 s | — |
| 4 | "Também aplicamos a regra 3-2-1…" | `690fe7b6` (lendo no papel) | 1,60–7,45 s | `2e9ab0fc` (take interrompido) |
| 5 | "Assim, se houver uma falha de equipamento, incêndio…" | `d53f9b88` | 1,00–12,45 s | — |
| 6 | "E essa mesma infraestrutura… hosting ou colocation." | `1e7c961a` | 0,00–8,17 s | `9bb9d7be` (take mais curto) |
| 7 | "Backup não é só fazer uma cópia…" | `33d18225` | 0,50–5,25 s | `edd3a48e` (áudio mais baixo) |
| 8 | "Fale com a Pro Advanced…" | `40515b17` | 1,30–5,63 s | — |
| — | — | — | — | `8db9e6cb` (erro/risada) |

No clipe 3 há uma pausa longa no meio da leitura: ela foi cortada e a emenda
fica escondida atrás do mockup do data center, que ocupa a tela inteira.

## Estrutura visual

- **Tomadas olhando para a câmera** (`layout: "full"`): rosto em tela cheia,
  headline embaixo e gráfico de apoio acima dela.
- **Tomadas lendo no papel** (`layout: "mockup"`): mockup em tela cheia, o
  apresentador entra num PiP no canto — resolve o olhar para baixo e ilustra o
  assunto. São os blocos do data center (Tier 3) e da regra 3-2-1.

Os gráficos entram sincronizados com a fala: os tempos em `graphicDelay` e os
escalonamentos internos foram medidos na envoltória de áudio de cada corte.

## Como trocar uma tomada

Todo o corte vive em `content.ts`. Para trocar um take, basta gerar o novo
arquivo em `public/shots/` e ajustar `video` + `durationInFrames` do bloco.

## Render

```console
npx remotion render src/index.ts ProAdvancedBackup out/pro-advanced-backup.mp4 --crf=18
```

Em ambientes sem download do Chromium do Remotion, aponte para um binário local
com `--browser-executable=<caminho>`.
