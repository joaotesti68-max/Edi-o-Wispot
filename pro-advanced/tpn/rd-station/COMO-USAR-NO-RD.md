# Landing page "Certificação TPN" no RD Station

Mesmo conteúdo da LP atual (lps.proadvanced.com.br/lp-tpn), com um novo visual no estilo do site da Pro Advanced.

## Arquivos
- `tudo-em-um-bloco-html.html`: a página inteira em um arquivo só. **Comece por este.**
- `1-bloco-html.html`, `2-css.css` e `3-javascript-body.html`: a mesma página em três partes, se o RD não aceitar tudo num bloco só.

## Opção A: um bloco só
1. RD Station Marketing → Landing Pages → **Criar** → modelo **em branco**.
2. Deixe uma seção só, com **largura total** e **margens internas zeradas**.
3. Arraste um bloco **HTML**, cole o conteúdo de `tudo-em-um-bloco-html.html` e salve.

## Opção B: três partes
1. Cole `1-bloco-html.html` no bloco HTML.
2. Em **Edição Avançada**: `2-css.css` na aba **CSS** e `3-javascript-body.html` na aba **JavaScript Body**.

## Formulário
Os leads vão para a mesma conversão da LP atual:
- token público da conta Pro Advanced (o mesmo da página atual);
- conversão `lp-tpn`;
- campos `name`, `email`, empresa e `cf_cargoselecao` (mesmas opções de cargo), mais as UTMs da URL.

Depois do envio, aparece uma mensagem de confirmação no próprio formulário. Para mandar a pessoa para uma página de obrigado, preencha `thanks` no bloco `RD` no começo de `src/script.js` e rode `python3 src/build.py`.

O envio só acontece com a página publicada em `proadvanced.com.br` ou num domínio do RD. Na prévia, o formulário só valida os campos.
**Antes de divulgar:** faça uma conversão de teste e confira no RD se o lead chegou em `lp-tpn`.

## Vídeo
É o mesmo vídeo do YouTube da página atual. Ele só carrega quando a pessoa clica no play, para a página abrir mais rápido.
