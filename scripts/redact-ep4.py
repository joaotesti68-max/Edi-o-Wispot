"""Desfoca os dados pessoais do cliente no screencast do Sending.

A pagina rola enquanto a Mari navega, entao as regioes nao podem ser fixas:
cada uma e ancorada num rotulo da propria interface ("Razao Social/Nome:",
"E-mail:") ou no proprio texto, localizado quadro a quadro por correlacao
cruzada normalizada numa faixa vertical. O desfoque cai num retangulo
definido em relacao a ancora, entao acompanha a rolagem.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

SRC = "frames"
DST = "frames_red"
N = 2466

def gray(im):
    return np.asarray(im.convert("L"), dtype=np.float32)

ref_razao = gray(Image.open(f"{SRC}/f01338.jpg"))
ref_email = gray(Image.open(f"{SRC}/f01660.jpg"))

class Anchor:
    def __init__(self, name, ref, x0, y0, w, h, rect, ylo, yhi, thr):
        self.name = name
        self.x0, self.y0, self.w, self.h = x0, y0, w, h
        self.tpl = ref[y0:y0 + h, x0:x0 + w]
        t = self.tpl - self.tpl.mean()
        self.t = t / (np.linalg.norm(t) + 1e-6)
        self.rect = rect          # (dx0, dy0, dx1, dy1) relativo a (x0, y_encontrado)
        self.ylo, self.yhi = ylo, yhi
        self.thr = thr

    def score(self, img, ys, dx):
        x = self.x0 + dx
        out = np.empty(len(ys), dtype=np.float32)
        for i, y in enumerate(ys):
            w = img[y:y + self.h, x:x + self.w]
            wc = w - w.mean()
            n = np.linalg.norm(wc)
            out[i] = 0.0 if n < 1e-3 else float((wc * self.t).sum() / n)
        return out

    def find(self, img):
        ys = np.arange(self.ylo, self.yhi, 3)
        s = self.score(img, ys, 0)
        best = int(ys[int(s.argmax())])
        bs, bdx, by = -1.0, 0, best
        for dx in (-2, 0, 2):
            ys2 = np.arange(max(0, best - 4), best + 5)
            s2 = self.score(img, ys2, dx)
            k = int(s2.argmax())
            if s2[k] > bs:
                bs, bdx, by = float(s2[k]), dx, int(ys2[k])
        return (bs, self.x0 + bdx, by)

ANCHORS = [
    # bloco Razao Social + Apelido + CNPJ da pagina "Informacoes da Empresa"
    Anchor("empresa", ref_razao, 192, 260, 128, 18,
           (-4, 22, 656, 123), 100, 545, 0.72),
    # Nome Completo + E-mail de "Minha Conta"
    Anchor("conta", ref_email, 377, 189, 50, 19,
           (-3, -46, 361, 58), 100, 545, 0.72),
    # nome do titular na barra lateral
    Anchor("lateral", ref_razao, 18, 203, 146, 21,
           (-4, -3, 150, 24), 90, 545, 0.72),
]

import os
os.makedirs(DST, exist_ok=True)
log = []
for i in range(1, N + 1):
    im = Image.open(f"{SRC}/f{i:05d}.jpg").convert("RGB")
    g = gray(im)
    hits = []
    for a in ANCHORS:
        s, x, y = a.find(g)
        if s >= a.thr:
            dx0, dy0, dx1, dy1 = a.rect
            box = (max(0, x + dx0), max(0, y + dy0),
                   min(im.width, x + dx1), min(im.height, y + dy1))
            if box[2] > box[0] and box[3] > box[1]:
                reg = im.crop(box).filter(ImageFilter.GaussianBlur(9))
                im.paste(reg, box)
                hits.append(a.name)
    log.append((i, ",".join(hits) or "-"))
    im.save(f"{DST}/f{i:05d}.jpg", quality=93)
    if i % 300 == 0:
        print(i, hits, flush=True)

with open("redact_log.txt", "w") as f:
    for i, h in log:
        f.write(f"{i}\t{i/30:.2f}\t{h}\n")
print("fim")
