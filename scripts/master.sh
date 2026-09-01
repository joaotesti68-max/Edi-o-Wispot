#!/usr/bin/env bash
# Masteriza o áudio do render pra entrega em rede social.
#
# O Remotion escreve o vídeo com o nível que veio dos brutos, que é baixo
# (~-23 LUFS). Instagram e TikTok normalizam pra perto de -14 LUFS, então quem
# sobe o arquivo cru fica com um vídeo mais baixo que o resto do feed.
#
# Dois passos porque o loudnorm só acerta o alvo quando mede o arquivo inteiro
# antes de aplicar o ganho.
#
# Uso: scripts/master.sh out/JoaoPSI.mp4 out/JoaoPSI-master.mp4

set -euo pipefail

IN=${1:?arquivo de entrada}
OUT=${2:?arquivo de saída}
LUFS=-14
TRUE_PEAK=-1
LRA=11

measured=$(ffmpeg -hide_banner -nostats -i "$IN" \
  -af "loudnorm=I=$LUFS:TP=$TRUE_PEAK:LRA=$LRA:print_format=json" -f null - 2>&1 |
  awk '/^\{/,/^\}/')

get () { printf '%s' "$measured" | grep "\"$1\"" | sed 's/.*: *"\(.*\)".*/\1/'; }

ffmpeg -y -hide_banner -loglevel error -i "$IN" \
  -af "loudnorm=I=$LUFS:TP=$TRUE_PEAK:LRA=$LRA:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true:print_format=summary" \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"

echo "→ $OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 |
  grep -A2 "Integrated loudness" | head -3
