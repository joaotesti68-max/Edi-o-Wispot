# Vídeo "Backup fora da empresa" — Pro Advanced

Vertical 1080x1920, 24 fps, ~44 s. Composição `ProAdvancedBackup`.

## Como as tomadas foram escolhidas

Os 13 clipes brutos foram transcritos (Whisper small, pt-BR) e cada corte foi
posicionado pela transcrição, não pela duração. O que ficou de fora:

| Clipe | O que tem | Destino |
|---|---|---|
| `c959243b` | abertura, limpa | **usado** 1,24–6,28 |
| `34c391bc` | "Na Pro Advanced… padrão Tier 3" | **usado** 1,33–6,92 |
| `4bd9cd78` | "Tá gravando?" + specs + "Então é isso?" | **usado só** 2,81–6,81 |
| `d53f9b88` | a regra 3-2-1 **três vezes** ("mais uma vez…") | **usado só** 9,43–12,20 (a última) |
| `690fe7b6` | detalhe da regra 3-2-1, limpo | **usado** 1,81–6,87 |
| `1e7c961a` | riscos + "pode cortar, ficou bem bom" | **usado só** 0,00–5,44 |
| `9bb9d7be` | "você mantém uma cópia preservada…" | **usado** 1,03–5,25 |
| `edd3a48e` | "E essa mesma infraestrutura…" | **usado** 0,77–5,04 |
| `78e65ae9` | fechamento, limpo | **usado** 0,94–6,02 |
| `8db9e6cb` | conversa e risada, depois o CTA | **usado só** 6,30–9,70 |
| `2e9ab0fc` | regra 3-2-1 interrompida + "pode cortar" | descartado |
| `33d18225` | mesma frase de `edd3a48e`, entrada cortada | descartado |
| `40515b17` | CTA, mas ele olha para o lado em ~3,8–4,1 s | descartado |

## Ritmo

As tomadas em `public/shots/` já saem do `ffmpeg` a 1,08x (`setpts` no vídeo,
`atempo` no áudio, que preserva o tom). Cada corte entra e sai rente à fala —
sobra de 0,04 a 0,14 s de silêncio nas pontas, medida na envoltória de áudio do
próprio corte — e os cross-fades são de 2 frames (3 ao entrar e sair dos
mockups). É o que mantém as frases coladas sem cortar consoante.

## Tratamento de imagem

O material bruto vinha com o azul por cima nos tons médios: a camiseta preta
media R70 G67 **B79** e a pele saía com G−B de apenas +3, o que dá a sensação
de imagem fria. O grade aplicado no corte (`colorbalance` nos médios e altas,
sem mexer nas sombras para não amarelar o preto, mais um toque de contraste e
saturação) leva a camiseta para R69 G64 B66 e a pele para G−B ≈ +12:

```
colorbalance=rm=0.032:bm=-0.038:rh=0.016:bh=-0.024,eq=contrast=1.06:saturation=1.08:brightness=0.006
```

Vale só para as tomadas. Os gráficos e os fundos dos mockups continuam com o
azul da marca, porque o grade é assado nos arquivos de `public/shots/`.

## Duas frases do roteiro não existem no material

Nenhum clipe contém:

1. "Por isso, uma estratégia de backup segura precisa ter pelo menos uma cópia
   fora do ambiente principal."
2. "…como hospedagem de ambientes e equipamentos em hosting ou colocation."

O corte segue sem elas. A primeira é coberta pelo texto do bloco `tier3`
("Protegida fora da empresa…") e a segunda pelos cards de hosting/colocation
sobre o bloco `infraestrutura`. Gravando as falas, é só inserir os blocos.

## Estrutura visual

- **Olhando para a câmera** (`layout: "full"`): rosto em tela cheia, headline
  embaixo e gráfico de apoio acima dela.
- **Lendo no papel** (`layout: "mockup"`): a imagem sai de cena por completo —
  fica só o mockup em tela cheia e a voz. São os blocos `datacenter-specs`
  (`4bd9cd78`) e `regra321-detalhe` (`690fe7b6`), os dois únicos em que ele lê.
Os gráficos entram na palavra certa: os tempos em `graphicDelay` e os
escalonamentos internos vieram de transcrições em janelas incrementais de cada
take.

## Como trocar uma tomada

Todo o corte vive em `content.ts`. Gere o novo arquivo em `public/shots/` e
ajuste `video` + `durationInFrames` do bloco.

## Render

```console
npx remotion render src/index.ts ProAdvancedBackup out/pro-advanced-backup.mp4 --crf=18
# master para as plataformas (o render sai em ~-16 LUFS)
ffmpeg -i out/pro-advanced-backup.mp4 -c:v copy -af "volume=2.2dB" -c:a aac -b:a 192k \
  out/pro-advanced-backup-master.mp4
```

Em ambientes sem download do Chromium do Remotion, aponte para um binário local
com `--browser-executable=<caminho>`.

Trilha: `public/audio/funky-jazz.mp3` (Alex Morgan — *Funky Jazz Cocktail Bar*),
em 0.085 sob a voz e 0.22 na cartela final.
