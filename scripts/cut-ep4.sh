#!/bin/sh
# Monta public/videos/ep4-sending.mp4 a partir da gravação bruta da tela.
#
# Cada linha é "início duração nome" em segundos do bruto. Os cortes seguem as
# pausas da locução (ver o comentário do episódio em src/content.ts); todos os
# pedaços rodam em velocidade natural.
#
# Uso:  sh scripts/cut-ep4.sh <bruto.mp4> <saida.mp4>
set -e
BRUTO="$1"; SAIDA="$2"; TMP=$(mktemp -d)
cat > "$TMP/segs" <<'SEGS'
15.00 10.98 dashboard
36.90 21.60 database
58.50 22.47 campanhas_empresa
106.50 6.00 minha_conta
115.00 5.50 permissoes
122.50 6.00 configuracoes
139.50 5.50 informacoes_empresa
168.00 4.15 lembretes
SEGS
i=0
: > "$TMP/list"
while read ss t nome; do
  i=$((i+1)); o=$(printf "%s/p%02d.mp4" "$TMP" "$i")
  # -nostdin: sem isso o ffmpeg engole a lista de segmentos deste laço.
  npx remotion ffmpeg -nostdin -y -ss "$ss" -i "$BRUTO" -t "$t" -an \
    -vf "scale=1092:614" -r 30 -c:v libx264 -preset veryfast -crf 20 \
    -pix_fmt yuv420p "$o" -loglevel error
  echo "file '$o'" >> "$TMP/list"
done < "$TMP/segs"
npx remotion ffmpeg -nostdin -y -f concat -safe 0 -i "$TMP/list" -c copy "$SAIDA" -loglevel error
echo "$SAIDA pronto — depois passe scripts/redact-ep4.py para desfocar os dados do cliente."
