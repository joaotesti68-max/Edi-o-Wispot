#!/usr/bin/env node
/**
 * Prepara o material bruto do Drive para a composição.
 *
 *   node scripts/prepare-footage.mjs
 *
 * Para cada arquivo em footage/raw/:
 *   1. transcodifica para MP4 vertical 1080x1920 em public/videos/
 *   2. mede a duração real com ffprobe
 *   3. detecta silêncios e monta os trechos de fala, cortando só as pausas
 *      longas (as curtas são respiração e ritmo — cortar tudo soa robótico)
 *
 * O resultado é escrito em src/footage.ts, que a composição consome.
 */
import { execFile, execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ffmpeg = execFileSync("node", ["-p", "require('@ffmpeg-installer/ffmpeg').path"], {
  cwd: root,
}).toString().trim();
const ffprobe = execFileSync("node", ["-p", "require('@ffprobe-installer/ffprobe').path"], {
  cwd: root,
}).toString().trim();

// Acelera a fala do João. 8% aperta o ritmo sem soar corrido: leva o
// discurso de 2,63 para 2,84 palavras por segundo, ainda dentro do natural.
// O atempo corrige o pitch, então a voz não fica fina, e o setpts acelera a
// imagem junto para o sincronismo labial não quebrar nos blocos em que ele
// aparece em cena.
const SPEED = 1.08;

const RAW_DIR = path.join(root, "footage", "raw");
const OUT_DIR = path.join(root, "public", "videos");
const FPS = 30;

// Pausas acima disso são removidas de fato. Em 0,62 a sobra depois de
// "documentação final" media exatamente 0,62s e escapava por um triz; 0,45
// pega essa e continua deixando passar as respiradas entre frases, que aqui
// ficam entre 0,21s e 0,39s.
const MIN_SILENCE = 0.45;
// Janelas de corte manuais. A detecção de silêncio não serve aqui porque a
// voz indesejada é humana e tem o mesmo nível da fala do João: são as
// deixas da direção fora de quadro ("pode ir", "boa") e um "hm" solto.
// Medido com silencedetect a -38dB, ilha por ilha.
const KEEP = {
  "IMG_7949.MOV": [1.1, 12.0], // corta "pode ir" na entrada e a voz no fim
  "IMG_7959.MOV": [0.95, 3.65], // corta um blip de 0,17s na entrada
  "IMG_7963.MOV": [1.05, 5.5], // corta o "hm" na entrada e o "boa" no fim
};
// Sobra mantida nas bordas do corte, pra não decepar o ataque das palavras.
const PAD = 0.14;
// Nível considerado silêncio. Grave de celular tem ruído de fundo, então
// -32dB pega melhor que o padrão -60dB.
const NOISE_FLOOR = "-32dB";
// Trecho de fala menor que isso é sobra de edição, não conteúdo.
const MIN_SPEECH = 0.4;

const slug = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function probeDuration(file) {
  const { stdout } = await execFileAsync(ffprobe, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ]);
  return Number.parseFloat(stdout.trim());
}

async function detectSilences(file) {
  // silencedetect escreve no stderr; um exit != 0 aqui é falha real.
  const { stderr } = await execFileAsync(
    ffmpeg,
    ["-hide_banner", "-i", file, "-af", `silencedetect=noise=${NOISE_FLOOR}:d=${MIN_SILENCE}`, "-f", "null", "-"],
    { maxBuffer: 32 * 1024 * 1024 },
  );

  const silences = [];
  let pending = null;
  for (const line of stderr.split("\n")) {
    const start = line.match(/silence_start:\s*(-?[\d.]+)/);
    if (start) {
      pending = Number.parseFloat(start[1]);
      continue;
    }
    const end = line.match(/silence_end:\s*(-?[\d.]+)/);
    if (end && pending !== null) {
      silences.push({ start: Math.max(0, pending), end: Number.parseFloat(end[1]) });
      pending = null;
    }
  }
  // Silêncio que vai até o fim do arquivo não fecha com silence_end.
  if (pending !== null) silences.push({ start: Math.max(0, pending), end: Number.POSITIVE_INFINITY });
  return silences;
}

function speechSegments(duration, silences) {
  const segments = [];
  let cursor = 0;

  for (const silence of silences) {
    const speechEnd = Math.min(silence.start + PAD, duration);
    if (speechEnd - cursor >= MIN_SPEECH) segments.push({ from: cursor, to: speechEnd });
    cursor = Math.max(cursor, Math.min(silence.end - PAD, duration));
  }
  if (duration - cursor >= MIN_SPEECH) segments.push({ from: cursor, to: duration });

  // Sem fala detectada, devolve o clipe inteiro em vez de nada.
  return segments.length > 0 ? segments : [{ from: 0, to: duration }];
}

async function transcode(input, output, keep) {
  // Recorte no lado da entrada: entrega ao filtro um fluxo já começando em
  // zero e com a duração certa. Do lado da saída, o -to passaria a valer
  // sobre a linha de tempo já acelerada e cortaria o clipe no lugar errado.
  const window = keep ? ["-ss", String(keep[0]), "-t", String(keep[1] - keep[0])] : [];
  await execFileAsync(
    ffmpeg,
    [
      "-y", ...window, "-i", input,
      // Enquadra em 1080x1920 cobrindo a tela, sem distorcer, e acelera.
      // A taxa final vai no encoder (-r) e não num filtro fps depois do
      // setpts: o filtro fps re-cronometra os quadros e desfaz a aceleração.
      "-vf",
      "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920," +
        `setpts=PTS/${SPEED}`,
      "-r", String(FPS),
      "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
      // Normaliza cada take para o padrão de streaming: são gravações
      // separadas, e sem isso um clipe entra mais alto que o outro.
      "-af", `atempo=${SPEED},loudnorm=I=-16:TP=-1.5:LRA=11`,
      "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
      "-movflags", "+faststart",
      output,
    ],
    { maxBuffer: 32 * 1024 * 1024 },
  );
}

const main = async () => {
  const entries = (await fs.readdir(RAW_DIR).catch(() => []))
    .filter((f) => /\.(mov|mp4|m4v)$/i.test(f))
    .sort();

  if (entries.length === 0) {
    console.error(`Nenhum vídeo em ${path.relative(root, RAW_DIR)}/ — coloque os arquivos lá e rode de novo.`);
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const clips = [];

  for (const entry of entries) {
    const input = path.join(RAW_DIR, entry);
    const id = slug(entry);
    const output = path.join(OUT_DIR, `${id}.mp4`);

    process.stdout.write(`• ${entry} … `);
    await transcode(input, output, KEEP[entry]);
    const duration = await probeDuration(output);
    const silences = await detectSilences(output);
    const segments = speechSegments(duration, silences);

    const kept = segments.reduce((sum, s) => sum + (s.to - s.from), 0);
    const trimmed = KEEP[entry] ? " [janela manual]" : "";
    console.log(
      `${duration.toFixed(1)}s → ${kept.toFixed(1)}s ` +
        `(-${(duration - kept).toFixed(1)}s de silêncio)${trimmed}`,
    );

    const durationInFrames = Math.floor(duration * FPS);
    clips.push({
      id,
      source: entry,
      file: `videos/${id}.mp4`,
      durationInFrames,
      segments: segments.map((s) => ({
        trimBefore: Math.round(s.from * FPS),
        // Sem o teto, o arredondamento passa um quadro além do clipe e o
        // último frame fica congelado.
        trimAfter: Math.min(Math.round(s.to * FPS), durationInFrames),
      })),
    });
  }

  const body = `// GERADO por scripts/prepare-footage.mjs — não editar à mão.
// Rode \`npm run footage\` depois de trocar os arquivos em footage/raw/.
export type FootageSegment = { trimBefore: number; trimAfter: number };

export type FootageClip = {
  id: string;
  source: string;
  file: string;
  durationInFrames: number;
  segments: FootageSegment[];
};

export const footage: Record<string, FootageClip> = ${JSON.stringify(
    Object.fromEntries(clips.map((c) => [c.id, c])),
    null,
    2,
  )};
`;

  await fs.writeFile(path.join(root, "src", "footage.ts"), body);
  console.log(`\n${clips.length} clipe(s) prontos. src/footage.ts atualizado.`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
