"""Gera a trilha institucional do vídeo de cartórios.

Trilha sóbria em Ré menor, 72 BPM, em 16 compassos que acompanham a narração:
abertura contida, desenvolvimento com pulso, fechamento resolvido. A dinâmica de
cada seção vem de MIX, e a harmonia de PLAN.

Uso: python3 tools/make_cartorios_theme.py public/audio/cartorios-theme.wav
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 72.0
BEAT = 60.0 / BPM
BAR = 4 * BEAT
TAIL = 3.2

NOTES = {
    "Bb1": 58.27, "C2": 65.41, "D2": 73.42, "F2": 87.31,
    "Bb2": 116.54, "C3": 130.81, "D3": 146.83, "E3": 164.81,
    "F3": 174.61, "G3": 196.00, "A3": 220.00, "Bb3": 233.08,
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "A4": 440.00,
}

CHORDS = {
    "Dm": {"bass": "D2", "pad": ["D3", "F3", "A3", "D4"], "arp": ["D3", "A3", "D4", "F4"]},
    "Bb": {"bass": "Bb1", "pad": ["Bb2", "D3", "F3", "Bb3"], "arp": ["Bb2", "F3", "Bb3", "D4"]},
    "F": {"bass": "F2", "pad": ["F3", "A3", "C4", "F4"], "arp": ["F3", "C4", "F4", "A4"]},
    "C": {"bass": "C2", "pad": ["C3", "E3", "G3", "C4"], "arp": ["C3", "G3", "C4", "E4"]},
}

# Um par (acorde, seção) por compasso. As seções seguem os blocos do vídeo.
PLAN = [
    ("Dm", "abertura"), ("Dm", "abertura"), ("Bb", "abertura"), ("Bb", "abertura"),
    ("Dm", "etapas"), ("Bb", "etapas"), ("F", "etapas"), ("C", "etapas"), ("Dm", "etapas"),
    ("Bb", "doc"), ("F", "doc"), ("C", "doc"),
    ("Dm", "fecho"), ("Bb", "fecho"), ("C", "fecho"),
    ("Dm", "resolve"),
]

# Ganho por seção: cordas, baixo, arpejo, golpe grave.
MIX = {
    "abertura": (0.30, 0.34, 0.00, 0.30),
    "etapas": (0.36, 0.34, 0.20, 0.32),
    "doc": (0.40, 0.34, 0.14, 0.30),
    "fecho": (0.46, 0.38, 0.22, 0.38),
    "resolve": (0.50, 0.40, 0.00, 0.32),
}

TOTAL = len(PLAN) * BAR + TAIL
N_SAMPLES = int(TOTAL * SR)


def adsr(n, attack, decay, sustain, release):
    e = np.full(n, sustain, dtype=np.float64)
    a = max(1, int(attack * SR))
    d = max(1, int(decay * SR))
    r = max(1, int(release * SR))
    a = min(a, n)
    e[:a] = np.linspace(0.0, 1.0, a)
    d = min(d, max(0, n - a))
    if d:
        e[a:a + d] = np.linspace(1.0, sustain, d)
    r = min(r, n)
    e[n - r:] *= np.linspace(1.0, 0.0, r)
    return e


def lowpass(sig, cutoff):
    """Passa-baixa de um polo — tira o brilho áspero das serras."""
    alpha = 1.0 - np.exp(-2 * np.pi * cutoff / SR)
    out = np.empty_like(sig)
    y = 0.0
    for i, x in enumerate(sig):
        y += alpha * (x - y)
        out[i] = y
    return out


def saw(freq, n, detune=0.0):
    """Serra de banda limitada: harmônicos somados só até 8 kHz."""
    f = freq * (1 + detune)
    t = np.arange(n) / SR
    harmonics = max(1, min(24, int(8000 / f)))
    out = np.zeros(n)
    for h in range(1, harmonics + 1):
        out += np.sin(2 * np.pi * f * h * t) / h
    return out * 0.5


def strings(freq, dur, cutoff):
    """Camada de cordas: três serras levemente desafinadas, ataque lento."""
    n = int(dur * SR)
    mix = sum(saw(freq, n, d) for d in (-0.0035, 0.0, 0.0042)) / 3.0
    return lowpass(mix, cutoff) * adsr(n, 0.6, 0.4, 0.8, min(1.0, dur * 0.35))


def bass(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * freq * t) + 0.22 * np.sin(4 * np.pi * freq * t)
    return tone * adsr(n, 0.1, 0.5, 0.62, min(0.7, dur * 0.35))


def pluck(freq, dur):
    """Nota curta tipo harpa para o arpejo do desenvolvimento."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.30 * np.sin(4 * np.pi * freq * t)
            + 0.12 * np.sin(6 * np.pi * freq * t))
    out = tone * np.exp(-3.4 * t / max(dur, 1e-6))
    a = int(0.006 * SR)
    out[:a] *= np.linspace(0.0, 1.0, a)
    return out


def low_hit(dur=1.2):
    """Golpe grave tipo tímpano no início do compasso."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    freq = 66.0 * np.exp(-2.2 * t) + 38.0
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * np.exp(-3.0 * t)


def reverb(sig, decay=1.9, wet=0.26):
    """Cauda de reverberação por convolução com ruído em decaimento."""
    n = int(decay * SR)
    rng = np.random.default_rng(7)
    ir = rng.normal(0, 1, n) * np.exp(-4.2 * np.arange(n) / n)
    ir[: int(0.012 * SR)] = 0.0
    ir /= np.abs(ir).sum()
    tail = np.convolve(sig, ir)[: len(sig)]
    return sig * (1 - wet) + tail * wet * 3.0


left = np.zeros(N_SAMPLES)
right = np.zeros(N_SAMPLES)


def add(voice, start, gain, pan=0.5):
    """Soma uma voz com panorâmica de potência constante."""
    i0 = int(start * SR)
    seg = voice[: max(0, N_SAMPLES - i0)]
    if seg.size == 0:
        return
    left[i0:i0 + seg.size] += seg * gain * np.cos(pan * np.pi / 2) * 1.414
    right[i0:i0 + seg.size] += seg * gain * np.sin(pan * np.pi / 2) * 1.414


for index, (chord, section) in enumerate(PLAN):
    t0 = index * BAR
    voicing = CHORDS[chord]
    g_pad, g_bass, g_arp, g_hit = MIX[section]
    hold = BAR + (TAIL if section == "resolve" else 0.6)

    for slot, name in enumerate(voicing["pad"]):
        pan = 0.5 + (slot - 1.5) * 0.10
        add(strings(NOTES[name], hold, 1700 + 260 * slot), t0, g_pad / 2.2, pan)

    add(bass(NOTES[voicing["bass"]], hold), t0, g_bass)
    add(low_hit(), t0, g_hit)

    if g_arp > 0:
        # Arpejo em colcheias: sobe e desce dentro do acorde do compasso.
        pattern = [0, 1, 2, 3, 2, 1, 2, 3]
        for step, slot in enumerate(pattern):
            add(
                pluck(NOTES[voicing["arp"][slot]], BEAT),
                t0 + step * BEAT / 2,
                g_arp * (0.85 if step % 2 else 1.0),
                0.44 + 0.12 * (step % 3) / 2,
            )

left = reverb(left)
right = reverb(right)

# Abre e fecha em fade para casar com o começo e o fim do vídeo.
fade_in = int(1.6 * SR)
fade_out = int(2.8 * SR)
for buf in (left, right):
    buf[:fade_in] *= np.linspace(0.0, 1.0, fade_in) ** 1.5
    buf[-fade_out:] *= np.linspace(1.0, 0.0, fade_out) ** 1.5

peak = max(np.abs(left).max(), np.abs(right).max())
scale = 0.89 / peak if peak > 0 else 1.0
stereo = np.stack([left * scale, right * scale], axis=1)
pcm = (np.clip(stereo, -1.0, 1.0) * 32767).astype("<i2")

out_path = sys.argv[1] if len(sys.argv) > 1 else "public/audio/cartorios-theme.wav"
with wave.open(out_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f"{out_path}  {TOTAL:.2f}s  {len(PLAN)} compassos @ {BPM:.0f} BPM")
