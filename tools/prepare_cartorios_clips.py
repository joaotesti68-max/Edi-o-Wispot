"""Corta e prepara os planos do vídeo de cartórios a partir das gravações originais.

Uso: python3 tools/prepare_cartorios_clips.py <pasta-com-os-mov>

Cada plano é descrito por uma lista de trechos a manter, em segundos do arquivo
original. Os trechos foram escolhidos sobre o envelope de energia da narração:
tiram o ar morto na entrada e na saída e encurtam as pausas mais longas, sem
mexer nas respiradas curtas, que são o ritmo natural da fala.

Dentro de cada pausa, o ponto exato de corte não é o começo nem o fim dela: é o
par de quadros mais parecido entre os dois lados. Como ele se mexe enquanto
respira, emendar em quadros parecidos é o que faz a emenda sumir — juntar duas
poses diferentes deixa um salto, e um dissolve por cima disso vira fantasma.

Feita essa escolha, os dois lados são unidos por um dissolve de quatro quadros,
que acaba de apagar o que sobrou.

Imagem: leve ajuste de contraste e saturação. Áudio: corte de graves abaixo de
85 Hz, compressão leve e normalização do plano inteiro em -18 LUFS, para os
quatro ficarem no mesmo nível.

As contagens de quadros resultantes vão para `frames` em src/cartorios/content.ts,
e as legendas precisam ser geradas de novo com tools/align_captions.py.
"""

import json
import subprocess
import sys

DEST = "public/videos/cartorios"
FPS = 30
DISSOLVE = 4 / FPS  # quatro quadros

VIDEO_FILTER = "eq=contrast=1.06:saturation=1.04:gamma=0.99,scale=1080:1920:flags=lanczos,setsar=1"
VOICE_FILTER = "highpass=f=85,acompressor=threshold=-22dB:ratio=2.6:attack=8:release=200"
TARGET_LUFS = -18

# (arquivo, saída, [(início, fim), ...]) — tempos em segundos do arquivo original.
CLIPS = [
    (
        "IMG_7856.mov",
        "01-abertura.mp4",
        [
            (1.300, 3.405),
            (3.621, 7.486),
            (7.802, 10.427),
            # Termina antes de ele desviar o olhar para fora de quadro.
            (10.643, 13.800),
        ],
    ),
    ("IMG_7858.mov", "02-etapas.mp4", [(0.100, 6.527), (6.810, 9.427), (9.677, 18.180)]),
    ("IMG_7860.mov", "03-documentacao.mp4", [(1.040, 4.207), (4.423, 11.760)]),
    ("IMG_7867.mov", "04-fechamento.mp4", [(0.630, 9.000)]),
]


def build_filter(segments, audio_tail):
    """Monta o filtergraph: recorta os trechos e emenda com dissolve.

    `audio_tail` entra no fim da cadeia de áudio — é onde vai a normalização,
    que só pode ser medida depois de os trechos estarem juntos.
    """
    parts = []
    for i, (start, end) in enumerate(segments):
        parts.append(
            f"[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,{VIDEO_FILTER}[v{i}];"
        )
        parts.append(
            f"[0:a]atrim=start={start}:end={end},asetpts=PTS-STARTPTS,{VOICE_FILTER}[a{i}];"
        )

    video, audio = "v0", "a0"
    # O dissolve consome tempo dos dois lados, então o comprimento acumulado
    # encurta DISSOLVE a cada emenda — daí o desconto no offset.
    length = segments[0][1] - segments[0][0]
    for i in range(1, len(segments)):
        offset = length - DISSOLVE
        parts.append(
            f"[{video}][v{i}]xfade=transition=fade:duration={DISSOLVE}:offset={offset}[vx{i}];"
        )
        parts.append(f"[{audio}][a{i}]acrossfade=d={DISSOLVE}:c1=tri:c2=tri[ax{i}];")
        video, audio = f"vx{i}", f"ax{i}"
        length += (segments[i][1] - segments[i][0]) - DISSOLVE

    parts.append(f"[{audio}]{audio_tail}[aout];")
    return "".join(parts).rstrip(";"), video, length


def run(args):
    return subprocess.run(args, capture_output=True, text=True)


def prepare(src_dir, source, output, segments):
    path = f"{src_dir}/{source}"
    out = f"{DEST}/{output}"

    # Primeira passagem: mede o áudio já cortado e filtrado.
    measure_tail = (
        f"loudnorm=I={TARGET_LUFS}:TP=-1.5:LRA=9:print_format=json"
    )
    graph, video_label, length = build_filter(segments, measure_tail)
    probe = run(
        ["ffmpeg", "-hide_banner", "-nostats", "-v", "info", "-i", path,
         "-filter_complex", graph, "-map", f"[{video_label}]", "-map", "[aout]",
         "-f", "null", "-"]
    )
    blob = probe.stderr[probe.stderr.rfind("{"): probe.stderr.rfind("}") + 1]
    measured = json.loads(blob)

    normalize_tail = (
        f"loudnorm=I={TARGET_LUFS}:TP=-1.5:LRA=9"
        f":measured_I={measured['input_i']}:measured_TP={measured['input_tp']}"
        f":measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}"
        f":offset={measured['target_offset']}:linear=true"
        ",aresample=48000"
        f",afade=t=in:st=0:d=0.06,afade=t=out:st={length - 0.10:.3f}:d=0.10"
    )
    graph, video_label, _ = build_filter(segments, normalize_tail)

    encode = run(
        ["ffmpeg", "-y", "-v", "error", "-i", path,
         "-filter_complex", graph, "-map", f"[{video_label}]", "-map", "[aout]",
         "-r", str(FPS), "-fps_mode", "cfr",
         "-c:v", "libx264", "-crf", "18", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-profile:v", "high",
         "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
         "-movflags", "+faststart", out]
    )
    if encode.returncode != 0:
        sys.exit(f"falhou em {output}:\n{encode.stderr[-2000:]}")

    frames = run(
        ["ffprobe", "-v", "error", "-select_streams", "v", "-count_frames",
         "-show_entries", "stream=nb_read_frames", "-of", "default=nk=1:nw=1", out]
    ).stdout.strip()
    cuts = len(segments) - 1
    print(f"{output:24} {frames:>4} quadros   ({cuts} emenda{'s' if cuts != 1 else ''})")


def main():
    src_dir = sys.argv[1]
    for source, output, segments in CLIPS:
        prepare(src_dir, source, output, segments)


if __name__ == "__main__":
    main()
