# Landing page Pro Advanced no RD Station

Mesmo passo a passo da landing page da Wispot. Versão 2: segue só as cores e a fonte do Manual de Marca 2026 (#3696CD, degradê #20A3D6→#3696CD, #676868, branco e Montserrat).

1. Crie uma landing page no RD, apague as seções do modelo e deixe só uma, com largura total e margens internas em 0.
2. Arraste um bloco **HTML** e cole o conteúdo de `tudo-em-um-bloco-html.html`.
3. Salve e abra a **pré-visualização**. No editor a página aparece parada; as animações só rodam na pré-visualização e na página publicada.

Se o RD não aceitar tudo num bloco só: cole `1-bloco-html.html` no bloco HTML e, na **Edição Avançada**, `2-css.css` na aba CSS e `3-javascript-body.html` na aba JavaScript Body.

## Formulário
A página usa o mesmo formulário do RD que está no site atual (`gmk-forms-home-f6a9607991fe0a26527a`), então os leads caem no RD como hoje. Antes de divulgar, faça uma conversão de teste e confira o lead no RD.

## Editar
O código-fonte está em `../src`. Depois de mudar `style.css`, `body.html` ou `script.js`, rode `python3 src/build.py` para gerar de novo estes arquivos e o `preview.html`.

## Imagens
Logo, ícone e logos dos parceiros vão embutidos no código; não precisa subir nada.
