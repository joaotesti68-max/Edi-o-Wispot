# DESIGN.md: LP Certificação TPN (Pro Advanced)

## 1. Product truth
- **Users:** owners, IT and security leads at audiovisual production and post-production companies, on desktop and phone.
- **Purpose:** explain the TPN (Trusted Partner Network) certification and get a conversation with a Pro Advanced specialist.
- **Constraints:** copy comes from the current page (lps.proadvanced.com.br/lp-tpn), no invented proof or numbers. Pro Advanced logo, colors and font from proadvanced.com.br. Runs inside an RD Station HTML block (960px column, bleed script). Form posts to RD conversion `lp-tpn`.
- **Success means:** the visitor fills in the form (name, e-mail, phone, company, role).
- **Real content available:** the page copy, the YouTube video `7Vt1_PHt0eE`, the logo in `src/assets/`.

## 2. Design Read
Reading this as: TPN certification landing page for audiovisual companies, a persuade surface in the Pro Advanced site language (navy, blue accent, the font Montserrat), static HTML/CSS/JS in RD Station.

| Surface | Type | V | M | D |
|---|---|---|---|---|
| LP TPN | persuade | 7 | 6 | 4 |

## 3. Visual direction and project bans
- Same system as the Black November LP: giant certification name in the hero, a radar that finds leaks (red) and seals them (blue), a word-fill statement, a dial for the four benefits, rising shield-tier bars and a 3-step path.
- Each section has its own shape: reading statement, split video, one lead benefit plus a ruled list, a 3-step path, a plain closing band.
- Bans: eyebrows above headings, decorative 01/02 numbers, icon tiles on cards, gradient text, selos/badges as decoration, glass panels (the form is opaque).
- Allowed exception: light blur on the sticky header only, because the moving film scrolls under it. The gradient on the primary button is the site's own button.

## 4. Color tokens

```design-tokens
fonts: Montserrat
colors: #000c19, #08121f, #0e2a3f, #ffffff, #c9d6e4, #a8b6c6, #2ba3db, #68c5db, #f96d64, #7d8ea1, #045089, #022647, #e4ebf2, #e8c46a, #ffd76a
radii: 6px, 8px, 12px, 999px, 50%
```

| Token | Value | Job |
|---|---|---|
| `--bg` | #000c19 | page background |
| `--s1` / `--s2` | #08121f / #0e2a3f | form panel / lead benefit panel |
| `--ink` / `--ink2` / `--ink3` | #fff / #c9d6e4 / #a8b6c6 | headings / body / fine print |
| `--accent` | #2ba3db | primary action, the headline highlight, the path line |
| `--accent2` | #68c5db | focus ring, links, gradient end of the button |
| `--danger` | #f96d64 | form errors and the leak pixels in the film |
| `--royal` / final gradient | #045089 / #022647 | dial and closing band, same as the Black November LP |
| shield tiers | #e4ebf2, #e8c46a, #ffd76a | only on the Silver, Gold and Gold Star bars and labels (the tier names are colors) |

## 5. Typography
- The font Montserrat, weights 400/500/600 (display at 600, body 400/500).
- Scale 1.25 on 16px: 12.8 · 16 · 20 · 25 · 39 (clamp) · 61 (clamp). Titles `text-wrap: balance`, paragraphs `pretty`.

## 6. Spacing and layout
- 4px scale: 4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128. 12-column thinking: 7/5 hero, 4/8 statement and video, 5/7 benefits, 6/6 closing.

## 7. Components
- Radius by role: inputs 6px, video 8px, panels 12px, buttons pill, round play button and step markers 50%.
- No shadows; surfaces separate by value or a 1px hairline.

## 8. Motion
- Film strip (three.js) is the only continuous motion; it fades to half strength after the hero so text over it stays readable.
- One entrance per block: 16px rise, 0.4s ease-out, GSAP; skipped entirely with `prefers-reduced-motion`.

## 11. Decision log
- 2026-10-27: rebuilt with the antiwebslop skill. Removed eyebrows, the gradient headline, the rotating seal, icon-tile cards with fake 01-04 numbers, hero tick list (it repeated later copy). Benefits became one lead item plus a ruled list; Pro Advanced reasons became a 3-step path because Gap Analysis, compliance and support are an actual sequence.
- 2026-10-30: content restructured into question blocks (question as H2, key points, full text), quick FAQ, numbered sources (MPA, TV Technology on the Shield tiers, IBM 2025, Verizon DBIR 2025) and Article + FAQPage JSON-LD, per the project rules in CLAUDE.md. Added a Shield tiers block.
- 2026-11-13: rebuilt on the Black November LP system at the client's request (same layout, components and RD form bridge). The three.js film strip was replaced by the hero radar; benefits moved to the dial (4 sectors), Shield tiers became rising bars, the video thumbnail is embedded at build.
