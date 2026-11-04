"""Gera a trilha e os efeitos do vídeo Black November (síntese própria, sem licença de terceiros)."""
import numpy as np, wave, sys, os

SR = 48000
out = sys.argv[1] if len(sys.argv) > 1 else "public/audio/black-november"
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x):
    x = np.clip(x / (np.max(np.abs(x)) + 1e-9) * 0.89, -1, 1)
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(d * SR)) / SR

def lp(x, a):  # one-pole low-pass
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

def kick():
    tt = t(0.45); f = 48 + 110 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 7) + 0.3 * np.tanh(4 * np.sin(ph)) * np.exp(-tt * 18)

def hat(d=0.05):
    tt = t(d); n = rng.standard_normal(len(tt))
    return (n - lp(n, 0.5)) * np.exp(-tt * 70)

def clap():
    tt = t(0.25); n = rng.standard_normal(len(tt))
    env = np.exp(-tt * 22) + 0.6 * np.exp(-np.maximum(tt - 0.012, 0) * 30) * (tt > 0.012)
    return (n - lp(n, 0.15)) * env * 0.6

def saw(f, tt): return 2 * ((tt * f) % 1) - 1

# ---- trilha: 125 BPM, Fá menor, 32 s ----
BPM = 125; beat = 60 / BPM; dur = 32.0
N = int(dur * SR); mix = np.zeros(N)
def place(x, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(x))
    if i < N: mix[i:j] += g * x[: j - i]

nb = int(dur / beat)
for b in range(nb):
    at = b * beat
    place(kick(), at, 0.95)
    place(hat(), at + beat / 2, 0.22)
    place(hat(0.03), at + beat / 4 * 3, 0.10)
    if b % 4 in (1, 3): place(clap(), at, 0.35)

# sub-grave pulsante em colcheias: Fm - Db - Ab - Eb
roots = [43.65, 34.65, 51.91, 38.89]
bar = beat * 4
for b in range(int(dur / bar) + 1):
    f = roots[b % 4]
    for k in range(8):
        tt = t(beat / 2 * 0.9)
        note = np.tanh(2.2 * np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 5)
        # sidechain-ish: notas fora do kick mais fortes
        place(note, b * bar + k * beat / 2, 0.30 if k % 2 else 0.18)

# pad escuro (serra filtrada) em acordes menores
chords = [[349.2, 415.3, 523.3], [277.2, 349.2, 415.3], [415.3, 523.3, 622.3], [311.1, 392.0, 466.2]]
pad = np.zeros(N)
for b in range(int(dur / bar) + 1):
    tt = t(bar); seg = sum(saw(f / 2, tt) + saw(f / 2 * 1.006, tt) for f in chords[b % 4])
    env = np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.3)
    i = int(b * bar * SR); j = min(N, i + len(tt))
    if i < N: pad[i:j] += (seg * env)[: j - i]
pad = lp(pad, 0.035)
# "bombeamento" do pad no tempo do kick
pump = 0.35 + 0.65 * np.minimum(1, ((np.arange(N) / SR) % beat) / (beat * 0.6))
mix += 0.10 * pad * pump

fade = np.minimum(1, np.arange(N) / (0.02 * SR)) * np.minimum(1, (N - np.arange(N)) / (1.5 * SR))
mix = np.tanh(mix * 1.2) * fade
save("trilha", mix)

# ---- impacto (boom grave + estalo) ----
tt = t(2.2)
f = 30 + 90 * np.exp(-tt * 9)
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.8)
n = rng.standard_normal(len(tt)); crack = (n - lp(n, 0.2)) * np.exp(-tt * 40)
save("impacto", np.tanh(1.6 * boom) + 0.5 * crack)

# ---- riser (ruído com filtro abrindo) ----
tt = t(1.6); n = rng.standard_normal(len(tt))
a = 0.01 + 0.5 * (tt / tt[-1]) ** 2
y = np.empty_like(n); acc = 0.0
for i, v in enumerate(n):
    acc += a[i] * (v - acc); y[i] = acc
tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / tt[-1]) ** 2) / SR)
save("riser", (y * 3 + 0.25 * tone) * (tt / tt[-1]) ** 1.5)

# ---- glitch (bitcrush curto) ----
tt = t(0.22)
g = np.sign(np.sin(2 * np.pi * 180 * tt)) * 0.5 + rng.standard_normal(len(tt)) * 0.5
g = np.repeat(g[::40], 40)[: len(tt)]
g *= (np.sin(2 * np.pi * 28 * tt) > -0.3) * np.exp(-tt * 9)
save("glitch", g)
print("ok")
