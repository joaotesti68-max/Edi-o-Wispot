# Perguntas e Respostas — setembro

Vídeo vertical 1080×1920, 30 fps, 52,0 s. Composição Remotion: `FeatureDaSemana`.

Quarto vídeo da série de perguntas e respostas, gravado com a Mari. Três
perguntas no ar: segmentos atendidos, fabricantes suportados e pesquisa de
público com o WiQuest.

A quarta gravada, sobre receita para provedor de internet, saiu desta edição a
pedido do cliente e foi entregue solta. O take continua em
`public/videos/resposta-2.mp4` com as legendas dele em `captions.ts`: recolocar
os dois segmentos em `src/content.ts` traz a pergunta de volta, e só os `index`
dos cards seguintes mudam.

## Cortes

Só o take da pergunta 1 trazia a pergunta feita fora de quadro, captada fraca
pela lapela da Mari; os outros já abriam pela resposta. A pergunta foi removida
no corte e todas as perguntas entram como card, para a série manter o mesmo ritmo.
O take da pergunta 3 começava por uma tentativa interrompida ("hoje a
Wispot…", riso), que também saiu.

Os `.mov` originais não ficam no repositório. Pontos usados para gerar
`public/videos/`:

| Origem     | Trecho cortado          | Trecho mantido   | Saída            |
| ---------- | ----------------------- | ---------------- | ---------------- |
| `IMG_8494` | —                       | 0,79 → 6,92 s    | `abertura.mp4`   |
| `IMG_8496` | 1,00 → 3,10 s (pergunta)| 3,62 → 17,62 s   | `resposta-1.mp4` |
| `IMG_8497` | —                       | 0,29 → 18,80 s   | `resposta-2.mp4` |
| `IMG_8500` | 1,30 → 3,75 s (take falho) | 4,60 → 16,78 s | `resposta-3.mp4` |
| `IMG_8501` | —                       | 1,41 → 13,42 s   | `resposta-4.mp4` |
| `IMG_8502` | —                       | 1,56 → 5,90 s    | `fechamento.mp4` |

As fronteiras não foram estimadas no olho: o áudio de cada take foi varrido em
janelas curtas com o reconhecedor, e o corte ficou no primeiro instante em que a
transcrição já abria pela resposta da Mari, dentro do vale de silêncio anterior.

Comando por clipe (rotação do iPhone já aplicada, áudio nivelado em -16 LUFS):

```console
ffmpeg -ss <inicio> -to <fim> -i <origem>.mov \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1" \
  -c:v libx264 -preset veryslow -crf 14 -pix_fmt yuv420p -r 30 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.10" \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart <saida>.mp4
```

O CRF 14 aqui é o teto de qualidade do vídeo inteiro: o render final reencoda
por cima destes arquivos, então o que se perde no corte não volta.

## Estrutura

O roteiro fica em `src/content.ts` — texto das perguntas, duração de cada
segmento e a faixa de lembrete que aparece sobre as respostas.

| # | Pergunta (card) | Resposta |
| - | --------------- | -------- |
| 1 | Para quais tipos de negócio a Wispot é indicada? | `resposta-1.mp4` |
| 2 | Quais equipamentos funcionam com a Wispot? | `resposta-3.mp4` |
| 3 | Como saber o que o público acha do meu espaço? | `resposta-4.mp4` |
| — | Como a Wispot pode gerar receita para um provedor de internet? | `resposta-2.mp4`, fora desta edição |

O número do card é o que o espectador lê, então ele acompanha a ordem no ar; os
ids e os nomes de arquivo continuam presos ao take que os originou.

### Ritmo

A Mari fala num andamento confortável demais para o formato — cerca de 145
palavras por minuto —, então os takes rodam a `SPEED` (1,12) pelo `playbackRate`
do Remotion, que estica o áudio com atempo e deixa o tom onde está. Medido na
abertura, a f0 dela sai em 195/189/216 Hz contra 195/191/216 Hz da fonte: a
diferença está dentro do erro da medição, ou seja não há transposição.

Os cards ficam de fora da conta: tempo de leitura não acelera junto com a fala.

Tudo que foi medido contra a gravação continua escrito em quadros da fonte — o
`sourceFrames` de cada clipe e os quadros em `captions.ts` —, e é dividido por
`SPEED` na hora de usar. Mudar essa constante re-cronometra o vídeo inteiro. A
duração de cada sequência usa piso, nunca teto, para uma sequência não durar
mais que a footage dela.

### Onde a fala diverge do roteiro

As legendas seguem o que a Mari falou, não o roteiro escrito. As diferenças que
importam para quem for aprovar o vídeo:

- **Pergunta 1.** O roteiro lista varejo, hotelaria, saúde, educação, cidades
  inteligentes e provedores. Ela cita hotéis, grandes hospitais, redes de varejo
  como farmácias e supermercados, cidades inteligentes e provedores — educação
  não entra.
- **Pergunta 2 (fora desta edição).** O roteiro fala em "composição tributária
  mais eficiente"; ela diz que "contribui na questão tributária dos impostos". A
  ressalva sobre regime da empresa e validação contábil e jurídica ela mantém.
- **Pergunta 3.** O roteiro diz 21 fabricantes e lista Cisco, Aruba, Ubiquiti,
  Huawei, Intelbras, MikroTik e TP-Link. Ela diz "mais de 20 fabricantes" e cita
  Huawei, Cambium, Cisco, Aruba e MikroTik.
- **Pergunta 4.** O roteiro menciona pesquisas "com o visual da sua marca"; ela
  fala em aplicar a pesquisa dentro do estabelecimento e acompanhar as respostas
  em tempo real no painel.

Três palavras são leitura, não transcrição limpa, e estão em `src/captions.ts`
caso precisem de troca:

- **"Cambium"** — o reconhecedor devolve "câmbio" em toda tentativa. É o
  fabricante que casa com o som e com a lista.
- **"A Wispot pode ser classificada"** — o modelo devolve "o spot… classificado".
  A marca é tratada no feminino no resto do vídeo, e é assim que ficou.
- **"entre em contato conosco"** — a vogal final sai átona demais para o modelo
  decidir entre "entre" e "entra".

## Legendas

`src/captions.ts` — texto e quadros de cada legenda, relativos ao clipe.

O texto veio de transcrição do próprio áudio (Whisper small em português, via
sherpa-onnx), **não** do roteiro. Corrija palavras nesse arquivo.

O modelo não devolve timestamps, então cada fronteira foi procurada. Uma
estimativa silábica semeia os candidatos; cada candidato é pontuado pelos dois
lados — a janela que termina ali tem de fechar com a linha que sai, e a que
começa ali tem de abrir com a linha que entra — e o vencedor é encostado no vale
de silêncio mais próximo. As fronteiras são resolvidas da esquerda para a
direita, reestimando o que falta a cada acerto, senão uma linha que corre longa
arrasta todas as seguintes. Depois disso cada fronteira foi conferida à mão com
o reconhecedor.

## Trilha

`public/audio/theme.mp3` — *Nastelbom / Funky*, 115 BPM, instrumental, fornecida
pelo cliente. Do arquivo original (79,1 s) saem os 52,2 s usados aqui.

Esta faixa não precisou de compressão: o arco dela já varia só 4,6 dB entre as
seções, e boa parte disso é a própria cauda baixando no fim. O tratamento foi
nível e corte:

```console
ffmpeg -ss 1.1859 -t 52.15 -i <original>.mp3 \
  -af "volume=-4.5dB,alimiter=limit=0.9:level=disabled,afade=t=in:st=0:d=0.6" \
  -c:a libmp3lame -b:a 192k -ar 44100 public/audio/theme.mp3
```

Os -4,5 dB põem a faixa em -16,4 dB RMS, o mesmo ponto em que o leito anterior
da série ficava — é o que mantém válidas as constantes de `musicVolume` sem
remexer nelas.

**Corte com a grade do compasso.** A faixa é 115 BPM cravados, compasso de
2,08696 s, com o primeiro tempo forte em 0,512 s. Cortando 1,1859 s da cabeça, o
tempo forte do compasso 26 cai no quadro 1545 — quinze quadros antes do fim. O
vídeo fecha em cima da batida em vez de cortar no meio de um compasso, e o
`MUSIC_FADE_OUT` é curto justamente para entrar só depois dela.

Por cima disso o volume ainda varia no `musicVolume` (`src/content.ts`): abre
nos cards e no encerramento, onde ninguém fala, e recua para um leito por baixo
da voz da Mari. Ao mexer na duração do vídeo, refaça a conta do corte de cabeça;
ao trocar a faixa, refaça também a medição de BPM e fase.

## Marca

Cores e tipografia saíram do *Manual de Marca - Wispot - 2026* (Drive), em
`src/brand.ts` — azul `#25a8e0`, cinza `#514d4b`, degradê `#25a8e0` → `#0b91c1`.
A logomarca em `src/WispotMark.tsx` só expõe as duas versões que o manual
autoriza. Tipografia: Montserrat, que o manual lista ao lado da Adineue Pro
(licenciada, não empacotada).

## Renderizar

O Chrome headless do Remotion não baixa neste ambiente (`remotion.media` fora da
allowlist), então aponte para o Chromium já instalado:

```console
npx remotion render FeatureDaSemana out/perguntas-respostas-setembro.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

O `remotion.config.ts` já carrega os parâmetros de qualidade: quadros
intermediários em PNG (o padrão é JPEG, que é uma geração de perda no meio do
caminho, e ainda marca a saída como `yuvj420p`), CRF 13, preset `veryslow` e
áudio em 320k. Sai um master de 1560 quadros, 59 MiB a 9,2 Mbps, com a mixagem
em -16,9 LUFS integrado e pico real -1,3 dBTP.

Para uma cópia menor sem perda visível, reencode em dois passes a partir do
master — 3500k dá 23 MiB com SSIM 0,994 contra ele:

```console
ffmpeg -i out/perguntas-respostas-setembro.mp4 -c:v libx264 -preset veryslow \
  -b:v 3500k -pass 1 -an -f null /dev/null
ffmpeg -i out/perguntas-respostas-setembro.mp4 -c:v libx264 -preset veryslow \
  -b:v 3500k -pass 2 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -movflags +faststart -c:a aac -b:a 256k -ar 48000 \
  out/perguntas-respostas-setembro-hq.mp4
```
