# Vídeo "Wi-Fi corporativo" — Pro Advanced

Vertical 1080x1920, 24 fps, ~51 s. Composição `ProAdvancedWifi`. Mesmo sistema
visual do vídeo de backup (`src/backup`), cujos `theme`, `Chip`, `Rise`,
`Headline` e `Watermark` são reaproveitados daqui.

## Tomadas

As tomadas foram identificadas por reconhecimento de fala restrito ao
vocabulário do roteiro (pocketsphinx + dicionário de pronúncia gerado com
espeak-ng) e alinhadas palavra a palavra para posicionar os gráficos.

| Arquivo | Take | Corte (s) | Fala |
|---|---|---|---|
| `01-abertura` | IMG_8734 | 1,10–5,98 | abertura |
| `02-wlan` | IMG_8740 | 1,76–8,08 | "Uma WLAN mal configurada… equipamentos," |
| `03-trava` | IMG_8743 | 1,63–4,45 | "e isso trava a operação…" |
| `04-riscos` | IMG_8745 | 2,10–11,75 | senhas fracas… invasão (**lendo no papel**) |
| `05-problema` | IMG_8747 | 1,56–6,50 | "Isso não é só um problema de internet lenta…" |
| `06-solucao` | IMG_8748 | 1,55–11,40 | rede estruturada… (**lendo no papel**) |
| `07-pro` | IMG_8750 | 0,80–5,64 | "Na Pro Advanced, ajudamos empresas…" |
| `08-servicos` | IMG_8751 | 1,24–6,28 | "com segmentação de acesso…" |
| `09-fechamento` | IMG_8752 | 1,20–5,52 | fechamento + "Fale conosco" |

**Não gravado:** "Toda empresa depende da rede sem fio pra funcionar. Sistemas,
atendimento, dispositivos móveis, tudo passa por ali o dia inteiro." O corte vai
direto da abertura para o bloco da WLAN. Se a fala for gravada, é só gerar o
arquivo e inserir um bloco entre `abertura` e `wlan` em `content.ts`.

## Visuais em tela cheia

`layout: "mockup"` tira a imagem de cena e deixa só o gráfico com a voz. Está
nos dois takes lidos no papel (`riscos`, `solucao`) e na lista de serviços
(`servicos`).

## Tratamento das tomadas

Tudo sai do `ffmpeg` já assado em `public/wifi/`: 1,08x (`setpts` + `atempo`),
`loudnorm` a -16 LUFS e suavização de pele. A suavização é um `bilateral`
aplicado só onde a máscara de tom de pele acende, com a máscara em ~67% e
desfocada para não criar borda:

```
split=3[a][b][c];
[b]bilateral=sigmaS=10:sigmaR=0.045:planes=1[s];
[c]geq=lum='if(between(cb(X/2,Y/2),85,130)*between(cr(X/2,Y/2),132,178)*gt(lum(X,Y),60),170,0)':cb=128:cr=128,format=gray,gblur=sigma=6,format=yuv420p[m];
[a][s][m]maskedmerge
```

O `sigmaR` baixo preserva olhos, sobrancelhas e boca. Mais que isso já fica
com cara de filtro.

## Render

```console
npx remotion render src/index.ts ProAdvancedWifi out/pro-advanced-wifi.mp4 --crf=18
ffmpeg -i out/pro-advanced-wifi.mp4 -c:v copy -af "volume=2dB,alimiter=limit=0.95" \
  -c:a aac -b:a 192k out/pro-advanced-wifi-master.mp4
```

Sem o Chromium do Remotion, use `--browser-executable=<chrome-headless-shell>`.
