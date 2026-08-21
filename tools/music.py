"""Background bed for the Q&A video.

Synthesised here rather than sourced, so the track is ours to ship. Warm
electric-piano arpeggio over a pad, with the rhythm section dropping in on the
first question card and stepping back out again before the end card.
"""
import numpy as np, wave
from scipy.signal import butter, fftconvolve, lfilter, sosfilt

SR = 44100
BPM = 96.0
BEAT = 60.0 / BPM
BAR = 4 * BEAT
BARS = 28
DUR = BARS * BAR + 3.0

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)

buf = np.zeros((int(DUR * SR), 2), dtype=np.float64)

def place(sig, t, pan=0.5, gain=1.0):
    i = int(t * SR)
    n = min(len(sig), len(buf) - i)
    if n <= 0:
        return
    buf[i:i + n, 0] += sig[:n] * gain * np.sqrt(1 - pan)
    buf[i:i + n, 1] += sig[:n] * gain * np.sqrt(pan)

def env(n, a, d, s, r, sus=0.7):
    """Plain ADSR in seconds; anything left over rides the sustain level."""
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    s = max(0, n - a - d - r)
    return np.concatenate([
        np.linspace(0, 1, a, endpoint=False),
        np.linspace(1, sus, d, endpoint=False),
        np.full(s, sus),
        np.linspace(sus, 0, n - a - d - s),
    ])[:n]

def lowpass(x, cutoff):
    """One-pole, enough to take the edge off the saw stack."""
    a = float(np.exp(-2 * np.pi * cutoff / SR))
    return lfilter([1 - a], [1, -a], x)


def band(x, lo, hi, order=4):
    """Steep band-pass. One-pole roll-off is far too gentle for percussion."""
    sos = butter(order, [lo / (SR / 2), min(hi, SR / 2 - 200) / (SR / 2)], btype="band", output="sos")
    return sosfilt(sos, x)


def shelf(x, cutoff, order=4):
    sos = butter(order, cutoff / (SR / 2), btype="low", output="sos")
    return sosfilt(sos, x)


def sweep(x, lo, hi, rate):
    """Time-varying cutoff, faked by crossfading two fixed filter passes."""
    t = np.arange(len(x)) / SR
    m = 0.5 + 0.5 * np.sin(2 * np.pi * rate * t)
    return lowpass(x, lo) * (1 - m) + lowpass(x, hi) * m

def pad(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.09, 0.0, 0.075):
        f = freq * 2 ** (det / 12)
        for h, amp in ((1, 1.0), (2, 0.34), (3, 0.16), (4, 0.09), (5, 0.05)):
            out += amp / h * np.sin(2 * np.pi * f * h * t + np.random.rand() * 6.28)
    out /= 9
    # Slow filter sweep keeps the sustained chord from sitting still.
    out = sweep(out, 460, 980, 0.09)
    vib = 1 + 0.02 * np.sin(2 * np.pi * 0.7 * t)
    return out * env(n, 0.9, 0.5, 0, 1.2, sus=0.82) * vib

def pluck(freq, dur):
    """FM bell: a touch of inharmonic attack over a sine body."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 9) * 2.4
    body = np.sin(2 * np.pi * freq * t + mod)
    body += 0.3 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 6)
    return body * env(n, 0.004, 0.10, 0, dur - 0.11, sus=0.34)

def bass(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.24 * np.sin(2 * np.pi * freq * 2 * t)
    return x * env(n, 0.012, 0.14, 0, dur - 0.16, sus=0.62)

def kick():
    n = int(0.30 * SR)
    t = np.arange(n) / SR
    f = 108 * np.exp(-t * 26) + 44
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    x *= np.exp(-t * 12)
    # Without a short attack ramp the instant onset reads as a broadband click.
    x *= np.clip(np.arange(n) / (0.004 * SR), 0, 1)
    return lowpass(x, 260)

def shaker(level=1.0):
    """Band-limited so it reads as a shaker instead of a hiss on phone speakers."""
    n = int(0.075 * SR)
    x = np.random.randn(n)
    x = band(x, 3600, 8200)
    return x * np.exp(-np.arange(n) / SR * 55) * 0.5 * level

def clap():
    n = int(0.22 * SR)
    x = np.random.randn(n)
    x = band(x, 1000, 5200)
    e = np.exp(-np.arange(n) / SR * 16)
    for off in (0.004, 0.011, 0.019):   # a few slaps read as a clap, not a snare
        i = int(off * SR)
        e[i:] += np.exp(-np.arange(n - i) / SR * 20) * 0.7
    e *= np.clip(np.arange(n) / (0.002 * SR), 0, 1)
    return x * e * 0.35

# Cm7 - Abmaj7 - Eb - Bb, the loop that carries the whole bed.
CHORDS = [
    {"pad": [60, 63, 67, 70], "bass": 36, "arp": [72, 75, 79, 82]},
    {"pad": [56, 60, 63, 67], "bass": 32, "arp": [68, 72, 75, 79]},
    {"pad": [55, 58, 62, 67], "bass": 27, "arp": [67, 70, 74, 79]},
    {"pad": [58, 62, 65, 70], "bass": 34, "arp": [70, 74, 77, 82]},
]

ARP_STEPS = [0, 1, 2, 3, 2, 1, 2, 3]

for bar in range(BARS):
    t0 = bar * BAR
    ch = CHORDS[bar % 4]

    pad_gain = 0.34 if bar < 2 else 0.30
    for k, note in enumerate(ch["pad"]):
        place(pad(midi(note), BAR + 0.6), t0, pan=0.22 + 0.16 * k, gain=pad_gain / len(ch["pad"]))

    if bar >= 1:
        for step in range(8):
            note = ch["arp"][ARP_STEPS[step]]
            if bar < 2 and step % 2:
                continue                      # sparser while the intro settles
            g = 0.26 if bar >= 2 else 0.22
            place(pluck(midi(note), BEAT * 0.9), t0 + step * BEAT / 2,
                  pan=0.34 + 0.32 * (step % 2), gain=g)

    if bar >= 2:
        place(bass(midi(ch["bass"]), BEAT * 1.9), t0, pan=0.5, gain=0.30)
        place(bass(midi(ch["bass"]), BEAT * 1.4), t0 + BEAT * 2.5, pan=0.5, gain=0.22)

    # The beat lands on the first question card (bar 2) and clears out again
    # before the end card (bar 24), so both play over pad and arpeggio alone.
    if 2 <= bar < 24:
        for beat in range(4):
            place(kick(), t0 + beat * BEAT, gain=0.26 if beat % 2 == 0 else 0.10)
        for step in range(8):
            place(shaker(1.0 if step % 2 == 0 else 0.6), t0 + step * BEAT / 2,
                  pan=0.62, gain=0.085)
        place(clap(), t0 + 2 * BEAT, pan=0.42, gain=0.30)

# Plate-ish reverb: decaying noise convolved in, kept well behind the dry signal.
ir_n = int(1.5 * SR)
ir = np.random.randn(ir_n) * np.exp(-np.arange(ir_n) / SR * 4.2)
ir[: int(0.02 * SR)] = 0
ir /= np.abs(ir).sum() / 8
wet = np.stack([fftconvolve(buf[:, c], ir)[: len(buf)] for c in range(2)], axis=1)
mix = buf * 0.86 + wet * 0.14

# Shelve the top off a little; on a phone speaker the percussion otherwise
# sits in front of Mari's voice instead of under it.
mix = mix * 0.55 + np.stack([shelf(mix[:, c], 6500) for c in range(2)], axis=1) * 0.45
mix /= np.max(np.abs(mix)) / 0.92
mix = np.tanh(mix * 1.12) / np.tanh(1.12)

fade_in = np.clip(np.arange(len(mix)) / (1.2 * SR), 0, 1)[:, None]
tail = np.clip((len(mix) - np.arange(len(mix))) / (2.6 * SR), 0, 1)[:, None]
mix *= fade_in * tail

pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
out = "theme.wav"
with wave.open(out, "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{out}  {len(pcm)/SR:.2f}s")
