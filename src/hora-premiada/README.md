# Wispot — Hora Premiada

Vertical (1080x1920, 30 fps) feature video with Vanessa on camera, built from the
17/09 script in *Roteiros de Gravação — Wispot, Setembro 2026*.

Composition id: `WispotHoraPremiada`.

## Brand

Everything comes from *Manual de Marca - Wispot - 2026*:

| Token | Value |
| --- | --- |
| Azul | `#25a8e0` |
| Degradê | `#25a8e0` → `#0b91c1` |
| Branco | `#ffffff` |
| Cinza | `#514d4b` |
| Tipografia | Montserrat (400 / 600 / 700 / 800) |

The manual pairs Montserrat with Adineue Pro; only Montserrat is self-hosted here,
so it carries the whole piece. Logo and icon in `public/brand/wispot/` were cut
from the official `wispot_colorido.png` and recoloured to the two approved
versions (`#25a8e0` and `#ffffff`).

## Source clips

The four takes were rotated upright, trimmed and re-encoded into
`public/hora-premiada/`. Cut points, in seconds on the original file:

| Script block | Source | In | Out |
| --- | --- | --- | --- |
| Abertura | `IMG_8280.mov` | 5.20 | 16.85 |
| Desenvolvimento 1 | `IMG_8281.mov` | 0.30 | 20.90 |
| Desenvolvimento 2 + 3 | `IMG_8285.mov` | 0.00 | 20.74 |
| Fechamento | `IMG_8287.mov` | 3.25 | 18.55 |

`IMG_8280` opens with two false starts (speech at 2.00–3.85 and 4.20–4.85); the
take used is the continuous run from 5.35. `IMG_8285` begins at full speech level
on frame 0, so the first word of "Serve para movimentar…" is missing from the
source — nothing in the edit can recover it.

Clips are mapped to script blocks in numeric order. That ordering, and the cue
times in `Scenes.tsx`, are placed against measured speech runs (listed in
`content.ts`), not against a transcript.

## Rendering

```console
npx remotion render src/index.ts WispotHoraPremiada out/wispot-hora-premiada.mp4
```

On a machine that cannot reach `remotion.media` to fetch Remotion's own Chromium,
add `--browser-executable=<path to a local Chrome or Chromium>`.
