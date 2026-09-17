# Wi-Fi inteligente — institucional

Vídeo vertical 1080×1920, 24 fps, 48,0 s. Composição Remotion: `WifiInteligente`.

Peça institucional sobre o tema *Wi-Fi inteligente como ferramenta de dados e
relacionamento*, sobre roteiro do cliente, em cinco blocos: abertura, três
partes e encerramento. Diferente da série de perguntas e respostas, não há card
mudo no meio — ela fala do primeiro ao último bloco, e o vídeo é cortado só na
fala.

## Material bruto

Os `.mov` originais não ficam no repositório. Eles chegaram pela release
[`Brutomemo`](https://github.com/joaotesti68-max/Edi-o-Wispot/releases/tag/Brutomemo),
que é o caminho que funciona para arquivo grande: o upload pelo navegador do
GitHub trava em 25 MB por arquivo, o anexo de release vai até 2 GB, e o
ambiente de edição alcança a release por HTTP. O Google Drive não serve aqui —
a saída para `drive.google.com` é bloqueada pela política de rede da sessão.

Cinco takes, 4K HEVC 24 fps em retrato, na ordem da gravação.

## Cortes

| Origem     | Trecho cortado               | Trecho mantido    | Saída               |
| ---------- | ---------------------------- | ----------------- | ------------------- |
| `IMG_8889` | —                            | 1,70 → 9,62 s     | `abertura.mp4`      |
| `IMG_8892` | —                            | 1,10 → 13,22 s    | `parte-1.mp4`       |
| `IMG_8893` | —                            | 0 → 9,50 s        | `parte-2.mp4`       |
| `IMG_8896` | —                            | 0,10 → 7,18 s     | `parte-3.mp4`       |
| `IMG_8898` | 0 → 4,02 s (take falho)      | 4,02 → 13,94 s    | `encerramento.mp4`  |

Só o take do encerramento trazia sujeira: uma tentativa interrompida por volta
de 2,4 s e a respiração antes da tomada boa, as duas fora do corte. O
`IMG_8893` começa com a fala já em curso — não há cabeça de silêncio nele, e é
por isso que a legenda do bloco abre no quadro 0.

As fronteiras não foram estimadas no olho: o áudio de cada take foi varrido em
janelas curtas com o reconhecedor, e o corte ficou no vale de silêncio anterior
à primeira palavra, conferido depois palavra a palavra.

**O rabo de cada clipe é mais longo que a fala.** A transição entre blocos dura
8 quadros e sobrepõe as duas sequências, áudio incluído: com o corte encostado
na última palavra, o bloco seguinte começava a falar por cima do anterior em
dois dos cinco cortes. Cada clipe termina com cerca de 0,3 s de silêncio da
própria gravação, e a sobreposição cai toda dentro dele — sobram de 4 a 7
quadros de respiro entre o fim de uma fala e o começo da seguinte.

Comando por clipe (rotação do iPhone já aplicada, áudio nivelado em -16 LUFS):

```console
ffmpeg -ss <inicio> -to <fim> -i <origem>.mov \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1" \
  -c:v libx264 -preset veryslow -crf 14 -pix_fmt yuv420p -r 24 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.10" \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart <saida>.mp4
```

O CRF 14 aqui é o teto de qualidade do vídeo inteiro: o render final reencoda
por cima destes arquivos, então o que se perde no corte não volta. Os dois
takes gravados a 23,976 fps (`IMG_8892` e `IMG_8898`) saem a 24 como os outros;
0,1% de diferença de cadência não produz repetição de quadro perceptível.

## Estrutura

O roteiro fica em `src/content.ts` — duração de cada bloco e os elementos que
sobem sobre ele.

| # | Bloco          | Clipe               | Elemento por cima          |
| - | -------------- | ------------------- | -------------------------- |
| 1 | Abertura       | `abertura.mp4`      | tarja "Wi-Fi inteligente"  |
| 2 | Parte 1        | `parte-1.mp4`       | três itens que se acumulam |
| 3 | Parte 2        | `parte-2.mp4`       | — |
| 4 | Parte 3        | `parte-3.mp4`       | logomarca |
| 5 | Encerramento   | `encerramento.mp4`  | — |
| — | Card final     | `EndCard.tsx`       | — |

Um elemento por bloco, e nenhum repetido. A parte 2 fica limpa de propósito: é
o trecho mais denso de fala do vídeo, e a legenda já carrega a enumeração.

Os itens da parte 1 se acumulam em vez de se substituírem porque "com que
frequência" dura 21 quadros na fala — sozinho na tela, não daria tempo de ler.
As deixas deles (`at`) são as fronteiras das legendas correspondentes, então
cada item entra junto com a palavra que o nomeia.

A logomarca da parte 3 sobe quando ela diz o nome da empresa e sai antes do
corte. Nesse bloco a marca d'água do rodapé é suprimida: duas assinaturas ao
mesmo tempo é uma a mais.

### Onde a fala diverge do roteiro

As legendas seguem o que ela falou, não o roteiro escrito. As diferenças que
importam para quem for aprovar:

- **Abertura.** O roteiro diz "você está usando só uma parte do que ele pode
  fazer"; ela diz "você pode estar usando somente uma parte do que ele pode
  oferecer".
- **Parte 1.** O roteiro lista "quem se conecta, quando, com que frequência e
  como esse público se comporta". O **quando** não entra na fala — e, por isso,
  também não entra nos itens na tela.
- **Parte 2.** O roteiro fala em "pesquisa, comunicação, relacionamento"; ela
  diz "uma pesquisa, uma comunicação, relacionamento". O sentido é o mesmo.
- **Parte 3.** O roteiro diz "Transformamos redes Wi-Fi em uma ferramenta
  inteligente de dados e relacionamento"; ela diz "Transforma redes Wi-Fi em
  uma ferramenta **de captação** de dados e relacionamento". São duas
  diferenças na frase-chave da peça: a pessoa do verbo e o adjetivo.
- **Encerramento.** O roteiro abre com "Porque se as pessoas já estão se
  conectando"; ela diz "Porque as pessoas já estão se conectando". E emenda, já
  fora do roteiro, **"Para mais informações, fale conosco."** — a linha ficou na
  edição, porque leva direto ao card final. Tirá-la é encurtar a última legenda
  e o clipe em `content.ts`.

## Legendas

`src/captions.ts` — texto e quadros de cada legenda, relativos ao clipe.

O texto veio de transcrição do próprio áudio (Whisper small em português, via
sherpa-onnx), **não** do roteiro. Corrija palavras nesse arquivo.

O modelo não devolve timestamps, então cada fronteira foi procurada. Uma
estimativa silábica semeia os candidatos; cada candidato é pontuado pelos dois
lados — a janela que termina ali tem de fechar com a linha que sai, e a que
começa ali tem de abrir com a linha que entra — e o empate fica perto da
estimativa. Depois disso, cada janela foi conferida contra o reconhecedor uma a
uma.

Duas palavras são leitura, não transcrição limpa, e estão escritas à mão:

- **"Wispot"** — o reconhecedor devolve "Esport" em toda tentativa, como
  devolvia "o spot" na série anterior.
- **"Com Wi-Fi inteligente"** — sai como "e se for inteligente" na janela curta
  e como "Com UEFA inteligente" na janela longa. O que está lá é "Wi-Fi".

## Trilha

`public/audio/theme.mp3` — *Nastelbom / Funky*, 115 BPM, instrumental, a mesma
faixa da série anterior, reenviada pelo cliente. Do arquivo original (79,1 s)
saem os 48,1 s usados aqui.

```console
ffmpeg -ss 1.0953 -t 48.10 -i <original>.mp3 \
  -af "volume=-4.5dB,alimiter=limit=0.9:level=disabled,afade=t=in:st=0:d=0.6" \
  -c:a libmp3lame -b:a 192k -ar 44100 public/audio/theme.mp3
```

Os -4,5 dB põem a faixa em -16,4 dB RMS, o mesmo ponto do leito anterior da
série — é o que mantém válidas as constantes de `musicVolume` sem remexer
nelas.

**Corte com a grade do compasso.** A faixa é 115 BPM cravados, compasso de
2,08696 s, com o primeiro tempo forte em 0,512 s (medido de novo neste arquivo:
114,7 BPM e fase 0,510 s, dentro do erro da medição). Cortando 1,0953 s da
cabeça, o tempo forte do compasso 23 cai no quadro 1138 — quinze quadros antes
do fim. O vídeo fecha em cima da batida em vez de cortar no meio de um
compasso, e o `MUSIC_FADE_OUT` é curto justamente para entrar só depois dela.

Como ninguém fica em silêncio no meio do vídeo, a trilha fica num leito baixo do
começo ao fim e só abre no card final, onde não há fala. Ao mexer na duração do
vídeo, refaça a conta do corte de cabeça.

## Renderizar

O Chrome headless do Remotion não baixa neste ambiente (`remotion.media` fora da
allowlist), então aponte para o Chromium já instalado:

```console
npx remotion render WifiInteligente out/wifi-inteligente.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

O `remotion.config.ts` já carrega os parâmetros de qualidade: quadros
intermediários em PNG (o padrão é JPEG, que é uma geração de perda no meio do
caminho, e ainda marca a saída como `yuvj420p`), CRF 13, preset `veryslow` e
áudio em 320k.
Sai um master de 1153 quadros, 68 MiB a 11,8 Mbps, com a mixagem em -16,2 LUFS
integrado e pico real -1,1 dBTP.

O arquivo entregue é uma cópia menor, reencodada em dois passes a partir do
master — 3500k dá 22 MiB com SSIM 0,990 contra ele, e é o que está em
`delivery/wifi-inteligente.mp4`:

```console
ffmpeg -i out/wifi-inteligente.mp4 -c:v libx264 -preset veryslow \
  -b:v 3500k -pass 1 -an -f null /dev/null
ffmpeg -i out/wifi-inteligente.mp4 -c:v libx264 -preset veryslow \
  -b:v 3500k -pass 2 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -movflags +faststart -c:a aac -b:a 256k -ar 48000 \
  delivery/wifi-inteligente.mp4
```
