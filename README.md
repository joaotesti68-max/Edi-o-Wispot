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

## Vídeos deste projeto

| Composition | O que é |
| --- | --- |
| `ProAdvanced` | O vídeo da Isabella |
| `JoaoPSI` | O vídeo do João sobre a PSI — é o de entrega |
| `Joao-00-completo` | Os cortes do João sem arte nenhuma, pra aprovar as takes |
| `Joao-01-abertura` … `Joao-05-fechamento` | Um bloco do roteiro por composition |

Os pontos de corte do vídeo do João ficam em `src/joao/takes.ts`: cada take
aponta um trecho de um arquivo bruto em `public/videos/joao/`, em frames a
24 fps. Mudar uma emenda é mudar um número. O campo `missing` de um bloco
registra frase de roteiro que não existe em nenhum bruto.

### Entrega

```console
npx remotion render JoaoPSI out/JoaoPSI.mp4
npm run master
```

O render sai com o nível de áudio dos brutos, uns 9 dB abaixo do que as redes
sociais esperam. O `npm run master` normaliza pra -14 LUFS; é o arquivo que
vai pro ar.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
