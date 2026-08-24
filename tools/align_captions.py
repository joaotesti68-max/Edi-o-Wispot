"""Gera as legendas do vídeo de cartórios alinhadas à narração.

O reconhecimento roda com o Parakeet TDT multilíngue via sherpa-onnx, que
devolve um instante por token. Os tokens viram palavras, as palavras são
casadas com o texto revisado (que corrige nomes próprios e a pontuação) e o
resultado é quebrado em legendas de no máximo duas linhas.

Uso:
    python3 tools/align_captions.py <pasta-do-modelo> <pasta-com-os-wav>

Os wav devem ser mono 16 kHz, um por bloco, extraídos dos mp4 de
public/videos/cartorios/ e nomeados como eles. A saída é escrita em
src/cartorios/captions.ts.
"""

import difflib
import glob
import os
import re
import sys
import unicodedata
import wave

import numpy as np
import sherpa_onnx

# Texto revisado por bloco: é ele que vai para a tela. O reconhecimento serve
# só para dizer QUANDO cada palavra é dita.
SCRIPT = {
    "01-abertura": (
        "Uma nova lei já está em vigor e pode multar cartórios que não estejam "
        "adequados e seguros digitalmente. Se você ainda não está adequado, esse "
        "vídeo aqui é pra você. Fica aqui comigo que eu vou te mostrar um "
        "pouquinho de como a ProAdvanced pode te ajudar."
    ),
    "02-etapas": (
        "Primeiro, analisamos e identificamos onde estão os dados sensíveis "
        "dentro do seu ambiente e qual é a exposição atual do risco. Depois "
        "disso, a gente entra com a parte técnica, onde vamos fazer controle de "
        "acesso, backup, gestão de usuários, monitoramento ativo desse ambiente, "
        "tudo dentro do que a lei está exigindo."
    ),
    "03-documentacao": (
        "Por fim, nós documentamos e entregamos a você todos os registros e "
        "evidências, comprovando a partir de agora que o seu cartório está "
        "dentro dos parâmetros exigidos por essa nova lei."
    ),
    "04-fechamento": (
        "Ainda dá tempo de se enquadrar à nova lei. Contate agora um de nossos "
        "especialistas e inicie um diagnóstico para adequação do seu cartório "
        "antes que o prazo feche."
    ),
}

# Nome do arquivo de áudio -> id do bloco em content.ts.
BLOCK_IDS = {
    "01-abertura": "abertura",
    "02-etapas": "etapas",
    "03-documentacao": "documentacao",
    "04-fechamento": "fechamento",
}

MAX_CHARS = 60  # por legenda, distribuída em até duas linhas
MAX_LINE = 32
MAX_DUR = 2.6
MIN_DUR = 0.75
TAIL = 0.34  # sobra depois da última palavra, para a leitura fechar

# Palavras que puxam a seguinte: terminar uma legenda nelas deixa a frase pendurada.
WEAK_ENDINGS = {
    "de", "do", "da", "dos", "das", "o", "a", "os", "as", "e", "em", "no", "na",
    "nos", "nas", "um", "uma", "que", "com", "para", "pra", "por", "ao", "aos",
    "se", "seu", "sua", "meu", "minha", "é", "nao", "pode", "vou", "vamos",
    "esta", "estao", "todos", "toda", "todo", "nossos", "nossa", "nosso",
    "essa", "esse", "este", "dentro", "sem", "sobre", "entre",
}


def normalize(word):
    """Forma comparável: sem acento, sem pontuação, em minúsculas."""
    stripped = unicodedata.normalize("NFD", word)
    stripped = "".join(c for c in stripped if unicodedata.category(c) != "Mn")
    return re.sub(r"[^\w]", "", stripped).lower()


def recognize(model_dir, wav_path):
    """Devolve as palavras reconhecidas com o instante em que começam."""
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=f"{model_dir}/encoder.int8.onnx",
        decoder=f"{model_dir}/decoder.int8.onnx",
        joiner=f"{model_dir}/joiner.int8.onnx",
        tokens=f"{model_dir}/tokens.txt",
        num_threads=4,
        model_type="nemo_transducer",
    )
    with wave.open(wav_path) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
        samples = audio.astype(np.float32) / 32768.0
        rate = w.getframerate()

    stream = rec.create_stream()
    stream.accept_waveform(rate, samples)
    rec.decode_stream(stream)

    words = []
    for token, start in zip(stream.result.tokens, stream.result.timestamps):
        # Um espaço à frente do token marca começo de palavra.
        if token.startswith(" ") or not words:
            words.append({"text": token.strip(), "start": start})
        else:
            words[-1]["text"] += token
    return [w for w in words if normalize(w["text"])]


def transfer_timing(heard, written):
    """Passa os tempos das palavras ouvidas para as palavras revisadas.

    Onde os dois textos coincidem o tempo vem direto. Nos trechos em que
    divergem — um nome próprio que o reconhecimento errou, por exemplo — os
    tempos são distribuídos por igual dentro do intervalo do trecho.
    """
    heard_keys = [normalize(w["text"]) for w in heard]
    written_keys = [normalize(w) for w in written]
    matcher = difflib.SequenceMatcher(None, heard_keys, written_keys, autojunk=False)

    timed = [None] * len(written)
    for tag, h0, h1, w0, w1 in matcher.get_opcodes():
        if tag == "equal":
            for offset in range(w1 - w0):
                timed[w0 + offset] = heard[h0 + offset]["start"]
        else:
            span_start = heard[h0]["start"] if h0 < len(heard) else heard[-1]["start"]
            span_end = heard[h1]["start"] if h1 < len(heard) else heard[-1]["start"] + 0.4
            count = max(1, w1 - w0)
            for offset in range(w1 - w0):
                timed[w0 + offset] = span_start + (span_end - span_start) * offset / count

    # Garante que os tempos nunca andem para trás.
    running = 0.0
    for i, value in enumerate(timed):
        running = max(running, value if value is not None else running)
        timed[i] = running
    return [{"text": written[i], "start": timed[i]} for i in range(len(written))]


def wrap(text):
    """Quebra a legenda em até duas linhas de tamanho parecido."""
    words = text.split()
    if len(text) <= MAX_LINE:
        return [text]
    best, best_cost = None, None
    for split in range(1, len(words)):
        first = " ".join(words[:split])
        second = " ".join(words[split:])
        if len(first) > MAX_LINE or len(second) > MAX_LINE:
            continue
        cost = abs(len(first) - len(second))
        # Também aqui, evita terminar a linha numa palavra que puxa a seguinte.
        if normalize(words[split - 1]) in WEAK_ENDINGS:
            cost += 14
        if best_cost is None or cost < best_cost:
            best, best_cost = [first, second], cost
    return best or [text]


def split_sentences(words):
    """Separa a fala em frases, pelo ponto final."""
    sentences, current = [], []
    for word in words:
        current.append(word)
        if word["text"].endswith((".", "!", "?")):
            sentences.append(current)
            current = []
    if current:
        sentences.append(current)
    return sentences


def split_sentence(words):
    """Divide uma frase em legendas equilibradas.

    Percorre todas as divisões possíveis e fica com a de menor custo. O custo
    pune legenda fora do tamanho alvo, legenda longa demais para ler, e corte
    logo depois de uma palavra que puxa a seguinte; e dá desconto a corte que
    cai numa vírgula, que é onde a fala mesmo respira.
    """
    text_len = len(" ".join(w["text"] for w in words))
    duration = words[-1]["start"] + TAIL - words[0]["start"]
    pieces = max(1, -(-text_len // MAX_CHARS), -(-int(duration * 100) // int(MAX_DUR * 100)))
    target = text_len / pieces

    n = len(words)
    best = {}

    def chunk_cost(i, j):
        text = " ".join(w["text"] for w in words[i:j])
        if len(text) > MAX_CHARS:
            return None
        cost = (len(text) - target) ** 2
        last = normalize(words[j - 1]["text"])
        if j < n and last in WEAK_ENDINGS:
            cost += 900
        if words[j - 1]["text"].endswith(","):
            cost -= 260
        return cost

    def solve(i, remaining):
        if remaining == 0:
            return (0.0, []) if i == n else None
        key = (i, remaining)
        if key in best:
            return best[key]
        found = None
        for j in range(i + 1, n + 1):
            cost = chunk_cost(i, j)
            if cost is None:
                break
            rest = solve(j, remaining - 1)
            if rest is None:
                continue
            total = cost + rest[0]
            if found is None or total < found[0]:
                found = (total, [(i, j)] + rest[1])
        best[key] = found
        return found

    # Se a frase não couber no número previsto de legendas, abre mais uma.
    for count in range(pieces, pieces + 4):
        solved = solve(0, count)
        if solved:
            return [words[i:j] for i, j in solved[1]]
    return [words]


def segment(words):
    """Agrupa as palavras em legendas, frase a frase."""
    chunks = []
    for sentence in split_sentences(words):
        chunks.extend(split_sentence(sentence))

    out = []
    for i, chunk in enumerate(chunks):
        start = chunk[0]["start"]
        end = chunks[i + 1][0]["start"] if i + 1 < len(chunks) else chunk[-1]["start"] + TAIL
        out.append({"from": start, "to": end, "text": " ".join(w["text"] for w in chunk)})

    # Absorve legenda curta demais para dar tempo de ler.
    merged = []
    for cap in out:
        if (
            merged
            and cap["to"] - cap["from"] < MIN_DUR
            and len(merged[-1]["text"]) + 1 + len(cap["text"]) <= MAX_CHARS
        ):
            merged[-1]["text"] += " " + cap["text"]
            merged[-1]["to"] = cap["to"]
        else:
            merged.append(cap)
    return merged


def main():
    model_dir, wav_dir = sys.argv[1], sys.argv[2]
    blocks = {}
    for path in sorted(glob.glob(os.path.join(wav_dir, "*.wav"))):
        name = os.path.basename(path)[:-4]
        if name not in SCRIPT:
            continue
        heard = recognize(model_dir, path)
        timed = transfer_timing(heard, SCRIPT[name].split())
        blocks[BLOCK_IDS[name]] = segment(timed)
        print(f"{name}: {len(blocks[BLOCK_IDS[name]])} legendas")

    lines = [
        "/**",
        " * Legendas do vídeo de cartórios, uma lista por bloco.",
        " *",
        " * Arquivo gerado por tools/align_captions.py: os tempos vêm do",
        " * alinhamento da narração e o texto, do roteiro revisado. Para mudar uma",
        " * frase, mude o texto em SCRIPT dentro do script e gere de novo, para o",
        " * texto e o tempo não saírem de sincronia.",
        " */",
        "",
        "export type SpeechCaption = {",
        "  from: number;",
        "  to: number;",
        "  lines: string[];",
        "};",
        "",
        "export const speechCaptions: Record<string, SpeechCaption[]> = {",
    ]
    for name, caps in blocks.items():
        lines.append(f'  "{name}": [')
        for cap in caps:
            rendered = ", ".join(f'"{part}"' for part in wrap(cap["text"]))
            lines.append(
                f'    {{ from: {cap["from"]:.2f}, to: {cap["to"]:.2f}, lines: [{rendered}] }},'
            )
        lines.append("  ],")
    lines.append("};")

    with open("src/cartorios/captions.ts", "w") as handle:
        handle.write("\n".join(lines) + "\n")
    print("src/cartorios/captions.ts")


if __name__ == "__main__":
    main()
