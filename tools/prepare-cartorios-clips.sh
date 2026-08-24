#!/usr/bin/env bash
# Corta e prepara os planos do vídeo de cartórios a partir das gravações originais.
#
# Uso: tools/prepare-cartorios-clips.sh <pasta-com-os-mov>
#
# Os pontos de corte vieram do alinhamento da narração: cada trecho começa um
# pouco antes da primeira palavra e termina um pouco depois da última, deixando
# margem para a transição em fade. As contagens de quadros resultantes estão
# fixadas em src/cartorios/content.ts — mudar um corte aqui exige atualizar
# `frames` lá.
#
# Áudio: corte de graves abaixo de 85 Hz (ruído de sala e do corpo do celular),
# compressão leve para segurar a variação de volume entre as frases, e
# normalização de cada plano para -18 LUFS, para os quatro ficarem no mesmo
# nível.

set -euo pipefail

SRC="${1:?informe a pasta com os arquivos .mov originais}"
DEST="public/videos/cartorios"
mkdir -p "$DEST"

VIDEO_FILTER="eq=contrast=1.06:saturation=1.04:gamma=0.99,scale=1080:1920:flags=lanczos,setsar=1"
VOICE_FILTER="highpass=f=85,acompressor=threshold=-22dB:ratio=2.6:attack=8:release=200"
TARGET_LUFS="-18"

prepare() {
  local input="$SRC/$1" start="$2" duration="$3" output="$DEST/$4"

  # Primeira passagem: mede o trecho já filtrado, para a normalização ser exata.
  local stats
  stats=$(ffmpeg -hide_banner -nostats -v info -ss "$start" -i "$input" -t "$duration" \
    -af "$VOICE_FILTER,loudnorm=I=$TARGET_LUFS:TP=-1.5:LRA=9:print_format=json" \
    -f null - 2>&1 | tr -d ' \n' | grep -o '{.*}')

  local measured
  measured=$(python3 -c "
import json, sys
d = json.loads('''$stats''')
print('measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}'.format(**d))
")

  ffmpeg -y -v error -ss "$start" -i "$input" -t "$duration" \
    -vf "$VIDEO_FILTER" -r 30 -fps_mode cfr \
    -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -profile:v high \
    -af "$VOICE_FILTER,loudnorm=I=$TARGET_LUFS:TP=-1.5:LRA=9:$measured:linear=true,aresample=48000,afade=t=in:st=0:d=0.06,afade=t=out:st=$(python3 -c "print($duration - 0.10)"):d=0.10" \
    -c:a aac -b:a 160k -ar 48000 -movflags +faststart "$output"

  printf '%-24s %s quadros\n' "$4" \
    "$(ffprobe -v error -select_streams v -count_frames \
      -show_entries stream=nb_read_frames -of default=nk=1:nw=1 "$output")"
}

# arquivo                start   duração    saída
prepare IMG_7856.mov     0.900   13.2667    01-abertura.mp4
prepare IMG_7858.mov     0.000   18.3000    02-etapas.mp4
prepare IMG_7860.mov     0.700   11.2667    03-documentacao.mp4
prepare IMG_7867.mov     0.450    8.7667    04-fechamento.mp4
