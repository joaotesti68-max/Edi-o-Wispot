# Landing page "Black Friday Wispot" no RD Station

## Antes de tudo: confira a oferta
Os textos da oferta, as datas e o fim do contador ficam no topo de `src/build.py` (bloco `OFERTA`).
Depois de mudar, rode `python3 src/build.py` para gerar de novo os arquivos desta pasta.
Hoje estão assim (confirme com o comercial antes de publicar):
- Implantação grátis + 50% OFF nos 3 primeiros meses
- Válido para contratos fechados até 30/11/2026
- O contador termina em 30/11/2026, às 23:59 (horário de Brasília)

## Arquivos
- `tudo-em-um-bloco-html.html`: a página inteira em um arquivo só. **Comece por este.**
- `1-bloco-html.html`, `2-css.css` e `3-javascript-body.html`: a mesma página separada em três partes, para usar se o RD não aceitar tudo num bloco só.

## Opção A: um bloco só (mais simples)
1. RD Station Marketing → Landing Pages → **Criar** → escolha um modelo **em branco**.
2. Apague as seções do modelo e deixe uma seção só, com **largura total** e **margens internas zeradas**.
3. Arraste um bloco **HTML** para essa seção.
4. Abra `tudo-em-um-bloco-html.html`, copie tudo e cole no bloco.
5. Salve e clique em **Pré-visualizar**.

## Opção B: três partes (se a A não funcionar)
1. Siga os passos 1 a 3 da opção A.
2. Cole `1-bloco-html.html` no bloco HTML.
3. Em **Edição Avançada**: cole `2-css.css` na aba **CSS** e `3-javascript-body.html` na aba **JavaScript Body**.
4. Salve e pré-visualize.

## Formulário
O formulário envia o lead direto para o RD pela API de conversões, com:
- o mesmo token público da LP "Monetize seu Wi-Fi";
- o identificador de conversão `black-friday-wispot-2026` (separa estes leads dos outros);
- os campos `email`, empresa, `cf_numero_de_funcionarios` e `cf_segmento_da_empresa`, mais as UTMs da URL.

Depois do envio, a pessoa vai para `https://material.wispot.com.br/obrigado?event=leadBlackFriday`.
Para mudar o identificador ou a página de obrigado, edite o bloco `RD` no começo de `src/script.js` e rode o build de novo.

O envio só acontece com a página publicada em `wispot.com.br` ou num domínio do RD. Na prévia, o formulário só valida os campos.

**Antes de divulgar:** publique, faça uma conversão de teste com um e-mail seu e confira no RD se o lead chegou com a conversão `black-friday-wispot-2026`.

## Imagens
O logo, o ícone e os logos de clientes vão embutidos no código, então não precisa subir nada. Por isso o arquivo único tem uns 340 KB; se o RD reclamar do tamanho, use a opção B.
