---
name: react-bits
description: React Bits component library (DavidHDev) — 100+ animated components, backgrounds, text animations and micro-interactions (DotGrid, LetterGlitch, Hyperspeed, PixelTransition, SplitText, MagnetLines, GridScan, FaultyTerminal and more), with full JS+CSS sources. Use when looking for creative animated backgrounds, text effects, cursor effects or interactive UI pieces, either to install in a React app or to port the technique to vanilla JS/canvas/WebGL.
license: MIT
---

# React Bits

Reference library of animated UI pieces. The index with every component, its purpose and dependencies is `references/llms.txt`. Sources (JS + CSS variant) live in `references/components/<Category>/<Name>/`, with categories `Animations`, `Backgrounds`, `Components`, `Micro`, `TextAnimations`.

## How to use

1. Search `references/llms.txt` (or `ls references/components/<Category>`) for the effect you need.
2. Read the component's `.jsx` (and `.css`) before using it; note its dependencies (gsap, motion, three, ogl, ...).
3. In a React project install it with the CLI: `npx shadcn@latest add https://reactbits.dev/r/<Component>-JS-CSS` (or `jsrepo`).
4. For vanilla pages (like the RD Station landing pages in this repo) port the technique: lift the canvas/shader/GSAP logic out of the React hooks into plain functions, keep the same parameters, and load libraries from a CDN instead of npm.

Keep effects in service of the content: performance budget, `prefers-reduced-motion`, and readability come first.
