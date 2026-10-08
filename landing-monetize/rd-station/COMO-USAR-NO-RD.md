# Landing page "Monetize seu Wi-Fi" no RD Station

## Arquivos
- `tudo-em-um-bloco-html.html`: a página inteira (estilo, conteúdo e animações) em um arquivo só. **Comece por este.**
- `1-bloco-html.html`, `2-css.css` e `3-javascript-body.html`: a mesma página separada em três partes, para usar se o RD não aceitar tudo num bloco só.

## Opção A: um bloco só (mais simples)
1. RD Station Marketing → Landing Pages → **Criar** → escolha um modelo **em branco**.
2. Apague as seções que vierem no modelo e deixe uma seção só, com **largura total** e **margens internas zeradas**.
3. Arraste um bloco **HTML** para essa seção.
4. Abra `tudo-em-um-bloco-html.html`, copie tudo e cole no bloco.
5. Salve e clique em **Pré-visualizar**.

## Opção B: três partes (se a A não funcionar)
1. Siga os passos 1 a 3 da opção A.
2. Cole `1-bloco-html.html` no bloco HTML.
3. No topo do editor, clique em **Edição Avançada**:
   - aba **CSS**: cole `2-css.css`;
   - aba **JavaScript Body**: cole `3-javascript-body.html`.
4. Salve e pré-visualize.

## Formulário
O formulário da página envia o lead direto para o RD pela API de conversões, usando:
- o token público e o identificador de conversão `monetize-seu-wi-fi`, os mesmos da página atual;
- os campos `email`, empresa, `cf_numero_de_funcionarios` e `cf_segmento_da_empresa`;
- as UTMs da URL e o rastreamento de visitante do RD.

Depois do envio, a pessoa vai para `https://material.wispot.com.br/obrigado?event=leadMonetizeSeuWifi`.

O envio só acontece quando a página está publicada em `wispot.com.br` ou num domínio do RD. Na prévia do Claude, o formulário só valida os campos.

**Antes de divulgar:**
1. Publique e faça **uma conversão de teste** com um e-mail seu.
2. No RD, confira se o lead apareceu com a conversão "monetize-seu-wi-fi" e com os campos preenchidos.
3. Se o lead não chegar, confira se o token público (`publicToken`, no começo do script) é o da conta, em Configurações → Integrações → Tokens de API.

Se preferir usar o formulário nativo do RD, apague o `<form ...>...</form>` do HTML e coloque um bloco de formulário do RD logo abaixo. O visual do resto da página não muda.

## Imagens
- **Logo:** usa uma imagem que já está no gerenciador de arquivos do RD (a mesma da página atual). Se aparecer outra imagem, suba o logo e troque o endereço nas duas tags `<img src=...>` que usam o logo.
- **Logos de clientes:** usam as 8 imagens da seção "Conheça nossos clientes" da página atual. Confira se são os logos certos.
