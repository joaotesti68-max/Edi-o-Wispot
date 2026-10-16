// Shared helpers for the scenes. Every scene builds one paused GSAP timeline
// and exposes window.seek(t) so render.mjs can step through it frame by frame.

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

window.mountTimeline = (tl) => {
  window.__tl = tl;
  window.seek = (t) => {
    tl.seek(t, false);
  };
  window.sceneReady = document.fonts.ready.then(() => true);
};
