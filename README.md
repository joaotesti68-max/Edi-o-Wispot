# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Vídeo ProAdvanced · Cartórios

Composição `ProAdvancedCartorios` (`src/cartorios/`), vertical 1080x1920 a 30 fps.
A narração gravada é a base do roteiro: os tempos de cada lower third e de cada
painel gráfico em `src/cartorios/content.ts` estão alinhados à fala, e as
contagens em `frames` correspondem exatamente aos mp4 em
`public/videos/cartorios/`.

**Preparar os planos a partir das gravações originais**

```console
python3 tools/prepare_cartorios_clips.py <pasta-com-os-mov>
```

Corta cada plano nos trechos listados no próprio script, emenda os cortes
internos com um dissolve curto, aplica um leve tratamento de imagem e nivela o
áudio em -18 LUFS. Mudar um ponto de corte exige atualizar o `frames` do bloco
correspondente em `src/cartorios/content.ts` e gerar as legendas de novo.

**Trilha**

A trilha em `public/audio/cartorios-trilha.mp3` é um trecho de 50 s de uma
música licenciada, normalizado em -14 LUFS. Para trocar, corte no comprimento do
vídeo, normalize no mesmo alvo e ajuste o leito em `musicVolume`
(`src/cartorios/Chrome.tsx`) se a nova referência for outra.

`tools/make_cartorios_theme.py` gera uma trilha sintética em ré menor, como
alternativa quando não houver música licenciada à mão.

O painel da Etapa 01 usa uma imagem de apoio em `b-roll-diagnostico.mp4`, com a
duração exata do painel — trocá-la exige recortar o novo material no mesmo
tamanho.

**Gerar as legendas**

```console
python3 tools/align_captions.py <pasta-do-modelo> <pasta-com-os-wav>
```

Alinha a narração com o Parakeet TDT via sherpa-onnx e escreve
`src/cartorios/captions.ts`. O texto que vai para a tela sai de `SCRIPT`, dentro
do script — mudar uma frase ali e gerar de novo mantém texto e tempo juntos.

**Renderizar**

```console
tools/render-cartorios.sh out/proadvanced-cartorios.mp4
```

Renderiza e normaliza o áudio final em -14 LUFS / -1,5 dBTP, que é o alvo das
redes sociais. O render roda num processo só, de propósito — o motivo está
comentado no script —, então leva uns dez minutos. Em ambientes sem o Chromium próprio do Remotion, defina
`CHROMIUM` com o caminho de um binário local antes de rodar.
