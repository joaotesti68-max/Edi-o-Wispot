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
| Desenvolvimento 1 | `IMG_8281.mov` | 0.30 | 19.45 |
| Desenvolvimento 2 + 3 | `IMG_8285.mov` | 0.00 | 20.74 |
| Fechamento, first half | `IMG_8287.mov` | 3.25 | 10.07 |
| Fechamento, second half | `IMG_8287.mov` | 12.60 | 18.55 |

`IMG_8280` opens with two false starts (speech at 2.00–3.85 and 4.20–4.85); the
take used is the continuous run from 5.35. `IMG_8285` begins at full speech level
on frame 0, so the first word of "Serve para movimentar…" is missing from the
source — nothing in the edit can recover it. `IMG_8281` ends on a stray line after the take (19.60–20.70), which is dropped.
`IMG_8287` stumbles between 9.90 and 12.80, so it is cut in two around that
stretch and the halves are joined with a straight cut plus a small punch-in,
which reads as a change of framing rather than a jump. The out point sits inside
the 0.26 s pause at 9.90–10.16, the last clean gap before the fumble starts.

Clips are mapped to script blocks in numeric order. That ordering, and the cue
times in `Scenes.tsx`, are placed against measured speech runs (listed in
`content.ts`), not against a transcript.

## Overlay style

The overlay system is built off the Wispot mark rather than a generic tech look:
every corner is a full radius or close to it, icon badges are circles filled with
the institutional gradient, and statements ride white pills with ink text instead
of dark glass. Negatives ("sem promotor") invert that — translucent white, struck
through in blue. Cards (the time strip, the coupon, the platform insets) are white
on a scrim tinted with the brand blue rather than neutral black, and the progress
bar fills with the gradient.

## Platform animations

Two supplied screen recordings of the product run as insets, framed as white cards
over the shot:

| Inset | Source | Segment | Shown in |
| --- | --- | --- | --- |
| Monte o cupom | `Hora_Premiada_editar_cupom.mp4` | 10.5–17.6 | Desenvolvimento 1, 5.9–13.2 |
| Crie a campanha | `Hora_Premiada_criar_campanha.mp4` | 8.0–17.0 | Desenvolvimento 2, 10.9–20.7 |

Each segment covers the stretch where the thing is actually assembled — the
coupon art filling in panel by panel, the campaign form switching its fields on —
and ends on the finished state. `rate` on `PlatformInset` is set so the clip
reaches that final state a beat before its cue ends and then holds there. The
campaign inset carries the whole back half of desenvolvimento 2, with the
"configura uma vez, roda sozinha" caption landing under it as she says the line.

## Pace

The footage runs at `SPEED` (1.1) via Remotion's `playbackRate`, which
time-stretches the audio with `atempo` and leaves the pitch alone. Every cue
time in `Scenes.tsx` and every speech run in `content.ts` is written in seconds
of the recording; `Cue` divides by `SPEED`, so changing that one constant
re-times the whole piece.

## Music

`public/audio/motivation-corporate.mp3`, mastered hot at -7.9 LUFS, so it runs at
0.06 gain under the voice (roughly 12 dB down) and opens to 0.2 on the end card.

## Rendering

```console
npx remotion render src/index.ts WispotHoraPremiada out/wispot-hora-premiada.mp4
```

On a machine that cannot reach `remotion.media` to fetch Remotion's own Chromium,
add `--browser-executable=<path to a local Chrome or Chromium>`.
