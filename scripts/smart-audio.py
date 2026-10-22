# Tense news-style music bed and SFX for the Smart Sampa video.
# usage: python3 scripts/smart-audio.py <out_dir>  (then bed.wav -> bed.mp3)
import sys, wave, os
import numpy as np

SR = 44100
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)


def write(name, x):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = x / max(1e-9, np.abs(x).max()) * 0.89
    with wave.open(os.path.join(out, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a, d):
    e = np.ones(n)
    ai = max(1, int(a * SR))
    e[:ai] = np.linspace(0, 1, ai)
    e[ai:] = np.exp(-np.arange(n - ai) / (d * SR))
    return e


def lp(x, cutoff):
    # one-pole low-pass, applied twice
    a = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        y = np.empty_like(x)
        acc = 0.0
        for i in range(len(x)):
            acc = (1 - a) * x[i] + a * acc
            y[i] = acc
        x = y
    return x


def hp(x, cutoff):
    return x - lp(x, cutoff)


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


# ---------- music bed: 124 bpm, A minor, Am F C E ----------
BPM = 124
beat = 60 / BPM
bars = 24
length = bars * 4 * beat + 2
N = int(length * SR)
L = np.zeros(N)
R = np.zeros(N)


def add(buf, start, x):
    i = int(start * SR)
    j = min(N, i + len(x))
    if i < N:
        buf[i:j] += x[: j - i]


kick_t = t(0.45)
kick = np.sin(2 * np.pi * (45 + 110 * np.exp(-kick_t * 28)) * kick_t) * env(len(kick_t), 0.002, 0.16)
kick += 0.3 * rng.standard_normal(len(kick_t)) * env(len(kick_t), 0.0005, 0.004)

hat_n = rng.standard_normal(int(0.06 * SR))
hat = hp(hat_n, 7000) * env(len(hat_n), 0.0005, 0.018)

snare_t = t(0.3)
snare = hp(rng.standard_normal(len(snare_t)), 1500) * env(len(snare_t), 0.001, 0.08)
snare += 0.5 * np.sin(2 * np.pi * 190 * snare_t) * env(len(snare_t), 0.001, 0.05)

chords = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [52, 56, 59]]  # Am F C E
roots = [33, 29, 36, 28]

sidechain = np.ones(N)
for bar in range(bars):
    # drums drop out for the first two bars (intro) and come in fully after
    for b in range(4):
        tb = (bar * 4 + b) * beat
        if bar >= 1:
            add(L, tb, kick * 0.9)
            add(R, tb, kick * 0.9)
            i = int(tb * SR)
            k = int(0.22 * SR)
            if i < N:
                sc = 1 - 0.6 * np.exp(-np.arange(min(k, N - i)) / (0.06 * SR))
                sidechain[i : i + len(sc)] = np.minimum(sidechain[i : i + len(sc)], sc)
        if bar >= 2 and b in (1, 3):
            add(L, tb, snare * 0.35)
            add(R, tb, snare * 0.3)
        for s in range(4):
            ts = tb + s * beat / 4
            g = 0.16 if s % 2 else 0.09
            pan = 0.7 if s % 2 else 1.0
            add(L, ts, hat * g * pan)
            add(R, ts, hat * g * (1.7 - pan))

    chord = chords[bar % 4]
    root = roots[bar % 4]
    # pulsing 8th-note bass
    for e in range(8):
        te = bar * 4 * beat + e * beat / 2
        bt = t(beat / 2 * 0.9)
        f = midi(root + (12 if e % 4 == 3 else 0))
        saw = 2 * ((f * bt) % 1) - 1
        b_ = lp(saw, 420) * env(len(bt), 0.004, 0.12)
        b_ += 0.6 * np.sin(2 * np.pi * f * bt) * env(len(bt), 0.004, 0.2)
        add(L, te, b_ * 0.5)
        add(R, te, b_ * 0.5)
    # dark pad
    pt = t(4 * beat)
    pad = np.zeros(len(pt))
    for n in chord:
        for det in (-0.08, 0.08):
            f = midi(n + det)
            pad += 2 * ((f * pt + rng.random()) % 1) - 1
    pad = lp(pad, 900)
    fade = np.minimum(1, np.minimum(pt / 0.08, (4 * beat - pt) / 0.08))
    add(L, bar * 4 * beat, pad * fade * 0.07)
    add(R, bar * 4 * beat, pad * fade * 0.07)
    # ticking arpeggio (sixteenths) from bar 4 on, the "clock" of a news bed
    if bar >= 4:
        for s in range(16):
            ts = bar * 4 * beat + s * beat / 4
            n = chord[[0, 1, 2, 1][s % 4]] + 12
            at = t(0.12)
            f = midi(n)
            pl = (2 * ((f * at) % 1) - 1) * env(len(at), 0.001, 0.035)
            g = 0.08 if s % 4 == 0 else 0.05
            add(L, ts, pl * g * (1.2 if s % 2 else 0.6))
            add(R, ts, pl * g * (0.6 if s % 2 else 1.2))

mix = np.stack([L, R], 1) * (0.5 + 0.5 * sidechain)[:, None]
fade_out = np.ones(N)
fo = int(1.5 * SR)
fade_out[-fo:] = np.linspace(1, 0, fo)
mix *= fade_out[:, None]
mix = np.tanh(mix * 1.6 / np.abs(mix).max())
write("bed.wav", mix)

# ---------- SFX ----------
# impact: sub drop + noise burst
it = t(1.2)
impact = np.sin(2 * np.pi * (38 + 90 * np.exp(-it * 9)) * it) * env(len(it), 0.002, 0.45)
impact += lp(rng.standard_normal(len(it)), 1800) * env(len(it), 0.001, 0.12) * 0.8
write("impact.wav", np.tanh(impact * 1.5))

# glitch: stuttered, bit-crushed noise/tones
g = np.zeros(int(0.42 * SR))
pos = 0
while pos < len(g):
    seg = int(rng.uniform(0.012, 0.045) * SR)
    kind = rng.integers(3)
    st = np.arange(seg) / SR
    if kind == 0:
        x = np.sign(np.sin(2 * np.pi * rng.uniform(200, 1800) * st))
    elif kind == 1:
        x = rng.standard_normal(seg)
    else:
        x = np.zeros(seg)
    x = np.round(x * 4) / 4
    g[pos : pos + seg] = x[: len(g) - pos] * rng.uniform(0.4, 1)
    pos += seg
g *= np.linspace(1, 0.3, len(g))
write("glitch.wav", g)

# scan beep: two short sine blips
bt = t(0.09)
blip = np.sin(2 * np.pi * 1760 * bt) * env(len(bt), 0.002, 0.03)
beep = np.concatenate([blip, np.zeros(int(0.05 * SR)), blip * 0.8, np.zeros(int(0.1 * SR))])
write("beep.wav", beep * 0.6)

# typing: a burst of key clicks
ty = np.zeros(int(0.6 * SR))
for k in range(9):
    i = int((k * 0.062 + rng.uniform(0, 0.015)) * SR)
    ct = t(0.025)
    c = hp(rng.standard_normal(len(ct)), 2500) * env(len(ct), 0.0005, 0.006)
    c += 0.4 * np.sin(2 * np.pi * rng.uniform(2500, 3800) * ct) * env(len(ct), 0.0005, 0.004)
    ty[i : i + len(c)] += c * rng.uniform(0.6, 1)
write("typing.wav", ty)

# riser: filtered noise sweeping up
rt = t(1.0)
noise = rng.standard_normal(len(rt))
riser = np.zeros(len(rt))
chunk = 2205
for i in range(0, len(rt), chunk):
    fc = 300 + 7000 * (i / len(rt)) ** 2
    seg = noise[i : i + chunk]
    riser[i : i + chunk] = hp(seg, fc * 0.5)[: len(seg)]
riser *= np.linspace(0, 1, len(rt)) ** 2
write("riser.wav", riser)
