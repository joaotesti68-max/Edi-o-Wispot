// Captures an HTML/GSAP scene frame by frame and encodes it to MP4.
// usage: node render.mjs <scene.html> <seconds> <out.mp4> [--frames=0,30,60 --stills=dir]
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const [scene, seconds, out, ...rest] = process.argv.slice(2);
const opts = Object.fromEntries(rest.map((a) => a.replace(/^--/, "").split("=")));
const FPS = 30;
const total = Math.round(Number(seconds) * FPS);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.resolve(scene));
await page.evaluate(() => window.sceneReady);

if (opts.stills) {
  fs.mkdirSync(opts.stills, { recursive: true });
  for (const f of opts.frames.split(",").map(Number)) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    await page.screenshot({ path: path.join(opts.stills, `${path.basename(scene, ".html")}-${String(f).padStart(4, "0")}.jpg`), type: "jpeg", quality: 80 });
  }
} else {
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
    { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = 0; f < total; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(`wrote ${out} (${total} frames)`);
}
await browser.close();
