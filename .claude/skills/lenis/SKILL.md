---
name: lenis
description: Lenis smooth scroll (darkroom.engineering) — setup, options, events, GSAP ScrollTrigger integration, scrollTo, anchors, stop/start, nested scroll, React/Vue/snap packages and known limitations. Use when adding or debugging smooth scrolling, syncing Lenis with GSAP ScrollTrigger, or when scroll-driven animations stutter with native smooth scroll.
license: MIT
---

# Lenis

Reference for Lenis, the smooth-scroll library from darkroom.engineering. The full upstream docs are in `references/README.md` (core), plus `references/react.md`, `references/vue.md` and `references/snap.md`. Read the relevant file before writing Lenis code.

## Essentials

- Vanilla setup with GSAP (the pattern used in this repo's pages):

```js
const lenis = new Lenis({ duration: 1.2, wheelMultiplier: 1 })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add(t => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

- Include the recommended CSS from `references/README.md` (`html.lenis`, `.lenis-stopped`, etc.) when Lenis controls the page.
- Anchor links: `lenis.scrollTo(target, { offset, duration })`; pause during loaders with `lenis.stop()` / `lenis.start()`.
- Nested scroll areas: add `data-lenis-prevent` to the scrollable element.
- Pinning with ScrollTrigger works with the sync above; call `ScrollTrigger.refresh()` after layout changes.
- Respect `prefers-reduced-motion`: skip creating Lenis when the user prefers reduced motion.
- CDN used in this repo: `https://unpkg.com/lenis@1.1.13/dist/lenis.min.js`.
