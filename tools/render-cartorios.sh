#!/usr/bin/env bash
# Renderiza o vídeo de cartórios e entrega o arquivo final já normalizado.
#
# Uso: tools/render-cartorios.sh [saída.mp4]
#
# O Remotion monta a imagem e mistura voz e trilha; a passagem seguinte só
# ajusta o volume do conjunto para -14 LUFS com pico real em -1,5 dBTP, que é o
# alvo das redes sociais. O vídeo é copiado sem recodificar.

set -euo pipefail

OUT="${1:-out/proadvanced-cartorios.mp4}"
RAW="$(dirname "$OUT")/.$(basename "$OUT" .mp4)-raw.mp4"
mkdir -p "$(dirname "$OUT")"

# concurrency=1 não é sobra de teste: com mais de um processo, cada um rasteriza
# o texto pequeno num deslocamento de subpixel próprio, e como quadros vizinhos
# saem de processos diferentes, as etiquetas em caixa alta ficam alternando entre
# duas versões de si mesmas — o que se vê como tremor. Medido: pico de 97 níveis
# de diferença entre quadros vizinhos com 4 processos, contra 6 com um só.
# Custa tempo de render; é o preço de texto parado.
#
# Quadros em PNG em vez de JPEG, para as letras não passarem por uma compressão
# antes da outra.
RENDER_ARGS=(src/index.ts ProAdvancedCartorios "$RAW"
  --concurrency=1 --image-format=png --crf=16)
# Em máquinas sem o Chromium do Remotion, aponte CHROMIUM para um binário local.
if [ -n "${CHROMIUM:-}" ]; then
  RENDER_ARGS+=(--browser-executable="$CHROMIUM")
fi

npx remotion render "${RENDER_ARGS[@]}"

stats=$(ffmpeg -hide_banner -nostats -v info -i "$RAW" \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" \
  -f null - 2>&1 | tr -d ' \n' | grep -o '{.*}')

measured=$(python3 -c "
import json
d = json.loads('''$stats''')
print('measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}'.format(**d))
")

ffmpeg -y -v error -i "$RAW" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:$measured:linear=true,aresample=48000" \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"

rm -f "$RAW"

ffmpeg -hide_banner -nostats -v info -i "$OUT" -af ebur128 -f null /dev/null 2>&1 |
  grep -A6 "Integrated loudness"
echo "pronto: $OUT"
