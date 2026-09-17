# Wi-Fi inteligente — institucional

Vídeo vertical 1080×1920, 24 fps, 47,2 s. Composição Remotion: `WifiInteligente`.

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
| `IMG_8892` | —                            | 1,10 → 13,00 s    | `parte-1.mp4`       |
| `IMG_8893` | —                            | 0 → 9,04 s        | `parte-2.mp4`       |
| `IMG_8896` | —                            | 0,10 → 6,81 s     | `parte-3.mp4`       |
| `IMG_8898` | 0 → 4,02 s (take falho)      | 4,02 → 10,85 s    | `encerramento-a.mp4`|
| `IMG_8898` | 10,85 → 11,35 s (respirada)  | 11,35 → 13,94 s   | `encerramento-b.mp4`|

Só o take do encerramento trazia sujeira: uma tentativa interrompida por volta
de 2,4 s e a respiração antes da tomada boa, as duas fora do corte. O
`IMG_8893` começa com a fala já em curso — não há cabeça de silêncio nele, e é
por isso que a legenda do bloco abre no quadro 0.

**A respirada do encerramento sai por dentro.** Entre a pergunta e o convite
ela para 21 quadros: silêncio, uma piscada e a inspiração, esta medida em -40 dB
contra os -16 da fala. O take vira dois clipes e o corte cai nesse vão. Sobram 7
quadros de silêncio entre "essa conexão?" e "Para mais informações", que é a
pausa de quem encadeia duas frases, não a de quem respira.

A emenda é corte seco, e isso foi medido, não escolhido por gosto: ela mexe a
cabeça e pisca durante a respirada, então a primeira dissolução testada punha
dois rostos deslocados na tela ao mesmo tempo. Com corte seco, a escolha passa a
ser dos quadros. A primeira metade não acaba onde a respirada começa (166), e
sim no 163, último quadro com os olhos abertos e a cabeça no lugar — que é como
a segunda metade abre. Assim o salto lê como corte de edição, não como defeito.

**As partes 2 e 3 acabam na última palavra.** Na parte 2 ela desvia o olhar no
quadro 217, exato instante em que fecha a frase, então o clipe termina ali; como
não sobra silêncio nenhum, o fim leva um fade de áudio de 0,08 s para a cauda de
"negócio" não ser cortada seca. A parte 3 fecha no quadro 160, onde
"relacionamento" termina de decair — ali o corte já cai em silêncio, e não
precisou de fade. Depois das duas, a transição é corte seco (1 quadro, o mínimo
que o `TransitionSeries` aceita).

As fronteiras não foram estimadas no olho: o áudio de cada take foi varrido em
janelas curtas com o reconhecedor, e o corte ficou no vale de silêncio anterior
à primeira palavra, conferido depois palavra a palavra.

**A transição tem de caber no silêncio do fim do bloco.** Ela dura 8 quadros e
sobrepõe as duas sequências, áudio incluído: com o corte encostado na última
palavra, o bloco seguinte começa a falar por cima do anterior. Por isso a
duração é por bloco (`transitionInFrames` em `content.ts`), e não uma só:

| Depois de     | Sobra de silêncio | Transição |
| ------------- | ----------------- | --------- |
| abertura      | 12 quadros        | 8 |
| parte 1       | 7 quadros         | 5 |
| parte 2       | nenhuma           | 1 (corte seco) |
| parte 3       | 1 quadro          | 1 (corte seco) |
| encerramento A| 5 quadros         | 1 (corte seco na emenda) |
| encerramento B| 14 quadros        | 8 |

A barra de progresso mostra cinco traços, não seis: as duas metades do
encerramento contam como um bloco só (`joinsPrevious`), porque para quem assiste
elas são uma frase contínua.

Comando por clipe (rotação do iPhone já aplicada, áudio nivelado em -16 LUFS):

```console
ffmpeg -ss <inicio> -to <fim> -i <origem>.mov \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,\
       colortemperature=temperature=5100,vibrance=intensity=0.35,\
       curves=master='0/0 0.10/0.07 0.45/0.50 0.80/0.84 1/0.98',\
       eq=saturation=1.18:gamma=1.06" \
  -c:v libx264 -preset veryslow -crf 14 -pix_fmt yuv420p -r 24 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.10" \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart <saida>.mp4
```

### O tratamento de cor

Chovia no dia da gravação, e a luz de céu encoberto deixou os takes frios e
chapados. São quatro operações, nesta ordem, no mesmo passe do corte — reencodar
de novo por cima do clipe cortado seria uma geração de perda a troco de nada:

1. **Temperatura para 5100 K.** A 4600 K a pele sai alaranjada; por volta de
   5100 K ela esquenta sem virar âmbar.
2. **Vibrância 0,35.** Age mais sobre as cores lavadas do que sobre as já
   saturadas, que é o que devolve o verde e o bege do fundo sem carregar o tom
   de pele junto.
3. **Curva em S com o topo segurado** (`0.80/0.84`, `1/0.98`). Abre o contraste
   no meio-tom, que é onde está o rosto, e comprime as altas em vez de
   empurrá-las: é o que impede o céu encoberto e o brilho da testa de virarem
   branco chapado.
4. **Saturação 1,18 e gama 1,06.** O gama devolve a luminância que a correção de
   temperatura tira ao derrubar o canal azul.

A conta que fechou a escolha: a saturação média do quadro sobe de 0,26 para
0,37 e a luminância média de 133 para 139, com menos de 1% dos pixels do rosto
chegando a 254. Uma primeira versão sem a curva, só com vibrância e contraste,
chegava a uma saturação parecida, mas com 3% do rosto estourado — testa e maçãs
viravam branco puro. É a diferença entre imagem viva e imagem queimada, e ela
não aparece no olho num quadro parado, só na medição.

A imagem de apoio do bloco 2 fica fora do tratamento: ela já vem quente, de um
café com luz amarela, e é ela que o tratamento dos takes está tentando alcançar.

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
| 2 | Parte 1        | `parte-1.mp4`       | tela cheia sobre o take    |
| 3 | Parte 2        | `parte-2.mp4`       | — |
| 4 | Parte 3        | `parte-3.mp4`       | logomarca |
| 5 | Encerramento   | `encerramento-a.mp4` + `-b` | — |
| — | Card final     | `EndCard.tsx`       | "Fale conosco." + site    |

Um elemento por bloco, e nenhum repetido. A parte 2 fica limpa de propósito: é
o trecho mais denso de fala do vídeo, e a legenda já carrega a enumeração.

### A tela cheia da parte 1

A imagem deste take não vai ao ar: ela fala fora do eixo da câmera na maior
parte dele, inclusive nas últimas palavras. O áudio é bom, então o bloco inteiro
corre por baixo de uma tela cheia (`CoverCard.tsx`) e só a imagem se perde.

O bloco tem duas fases, e a virada é o que ela está dizendo. Enquanto fala dos
clientes que se conectam, quem está no ar é a imagem de apoio enviada pelo
cliente — alguém usando o celular no Wi-Fi de um estabelecimento
(`public/videos/conexao-cafe.mp4`, 1280×720, 8 s, sem áudio). Quando ela passa
para o que a rede entende desse público, a imagem se dissolve no degradê da
marca e entra a lista.

A imagem de apoio entra por `objectFit: cover`, e o recorte central é o que
enquadra o rosto e o celular — conferido ao longo dos 8 s, porque ela se mexe.
Por cima vai um véu azul de 20% e o mesmo degradê de topo e base dos blocos
gravados: põe a imagem na paleta da peça sem apagar a luz quente do café, e
segura a legenda legível embaixo.

A dissolução termina no quadro 186 (`video.until`), antes dos 192 quadros do
arquivo — não há repetição nem congelamento de quadro no fim. O primeiro item
da lista entra no meio dela, no 171, então a troca de fundo e a entrada do
texto são o mesmo movimento.

Os itens se acumulam em vez de se substituírem porque "com que frequência" dura
21 quadros na fala — sozinho na tela, não daria tempo de ler. As deixas (`at`)
são as fronteiras das legendas correspondentes, então cada item entra junto com
a palavra que o nomeia. Por isso mesmo a legenda se cala quando o primeiro item
sobe (`captionsUntil`): dali em diante a lista é que carrega o texto, e a faixa
de legenda sumir evita dizer a mesma coisa duas vezes na mesma tela.

Para devolver a imagem do take ao ar, basta tirar o `cover` do bloco em
`content.ts` — mas o take continua com o mesmo problema. Para trocar a imagem
de apoio, é só pôr outro arquivo em `video.src`; se ele for mais curto que 186
quadros, o `until` desce junto.

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
saem os 47,3 s usados aqui.

```console
ffmpeg -ss 1.9703 -t 47.25 -i <original>.mp3 \
  -af "volume=-4.5dB,alimiter=limit=0.9:level=disabled,afade=t=in:st=0:d=0.6" \
  -c:a libmp3lame -b:a 192k -ar 44100 public/audio/theme.mp3
```

Os -4,5 dB põem a faixa em -16,4 dB RMS, o mesmo ponto do leito anterior da
série — é o que mantém válidas as constantes de `musicVolume` sem remexer
nelas.

**Corte com a grade do compasso.** A faixa é 115 BPM cravados, compasso de
2,08696 s, com o primeiro tempo forte em 0,512 s (medido de novo neste arquivo:
114,7 BPM e fase 0,510 s, dentro do erro da medição). Cortando 1,9703 s da
cabeça, o tempo forte do compasso 23 cai no quadro 1117 — quinze quadros antes
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
Sai um master de 1132 quadros, com a mixagem em -16,2 LUFS integrado e pico
real -1,1 dBTP.

O arquivo entregue é uma cópia menor, reencodada em dois passes a partir do
master — 3500k dá 22 MiB com SSIM 0,992 contra ele, e é o que está em
`delivery/wifi-inteligente.mp4`:

```console
ffmpeg -i out/wifi-inteligente.mp4 -c:v libx264 -preset veryslow \
  -b:v 3500k -pass 1 -an -f null /dev/null
ffmpeg -i out/wifi-inteligente.mp4 -c:v libx264 -preset veryslow \
  -b:v 3500k -pass 2 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -movflags +faststart -c:a aac -b:a 256k -ar 48000 \
  delivery/wifi-inteligente.mp4
```
