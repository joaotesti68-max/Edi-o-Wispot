// Shared helpers for the scenes. Every scene builds one paused GSAP timeline
// and exposes window.seek(t) so render.mjs can step through it frame by frame.

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function addParticles(stage, tl, duration, { count = 26, color = "#20a3d6", seed = 7 } = {}) {
  const rand = seeded(seed);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 6 + rand() * 12;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${rand() * 1080}px`;
    p.style.top = `${rand() * 1920}px`;
    p.style.background = color;
    p.style.opacity = String(0.15 + rand() * 0.35);
    stage.appendChild(p);
    tl.to(p, { y: -120 - rand() * 220, x: (rand() - 0.5) * 120, duration, ease: "none" }, 0);
  }
}

function shake(tl, target, at, strength = 18, times = 8) {
  for (let i = 0; i < times; i++) {
    const k = 1 - i / times;
    tl.to(target, {
      x: (i % 2 ? -1 : 1) * strength * k,
      y: (i % 3 - 1) * strength * 0.6 * k,
      duration: 0.035,
      ease: "none",
    }, at + i * 0.035);
  }
  tl.to(target, { x: 0, y: 0, duration: 0.05 }, at + times * 0.035);
}

window.mountTimeline = (tl) => {
  window.__tl = tl;
  window.seek = (t) => {
    tl.seek(t, false);
  };
  window.sceneReady = document.fonts.ready.then(() => true);
};
