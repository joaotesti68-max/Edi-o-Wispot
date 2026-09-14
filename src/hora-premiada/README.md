# Wispot — Hora Premiada

Vertical (1080x1920, 30 fps) feature video with Vanessa Furiato on camera, built
from the 17/09 script in *Roteiros de Gravação — Wispot, Setembro 2026*.

Composition id: `WispotHoraPremiada`.

## Brand

Wispot tokens come from *Manual de Marca - Wispot - 2026*:

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

The product carries its own lockup in `public/brand/hora-premiada/`, keyed off the
supplied artwork in its own green (`#8cc63e`). The green version runs over footage,
the white one over the blue end card.

## Source clips

The four takes were rotated upright, trimmed and re-encoded into
`public/hora-premiada/`. Cut points, in seconds on the original file:

| Script block | Source | In | Out |
| --- | --- | --- | --- |
| Abertura | `IMG_8280.mov` | 5.20 | 16.85 |
| Desenvolvimento 1 | `IMG_8281.mov` | 0.30 | 20.90 |
| Desenvolvimento 2 + 3 | `IMG_8285.mov` | 0.00 | 20.74 |
| Fechamento, first half | `IMG_8287.mov` | 3.25 | 12.30 |
| Fechamento, second half | `IMG_8287.mov` | 15.00 | 18.55 |

`IMG_8280` opens with two false starts (speech at 2.00–3.85 and 4.20–4.85); the
take used is the continuous run from 5.35. `IMG_8285` begins at full speech level
on frame 0, so the first word of "Serve para movimentar…" is missing from the
source — nothing in the edit can recover it. `IMG_8287` is fumbled in the middle
(12.80–14.80), so it is cut in two around that and the halves are joined with a
straight cut plus a small punch-in, which reads as a change of framing rather
than a jump.

Clips are mapped to script blocks in numeric order. That ordering, and the cue
times in `Scenes.tsx`, are placed against measured speech runs (listed in
`content.ts`), not against a transcript.

## Music

`public/audio/motivation-corporate.mp3`, mastered hot at -7.9 LUFS, so it runs at
0.06 gain under the voice (roughly 12 dB down) and opens to 0.2 on the end card.

## Rendering

```console
npx remotion render src/index.ts WispotHoraPremiada out/wispot-hora-premiada.mp4
```

On a machine that cannot reach `remotion.media` to fetch Remotion's own Chromium,
add `--browser-executable=<path to a local Chrome or Chromium>`.
