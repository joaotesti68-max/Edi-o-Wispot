# Landing page "Black Friday Wispot" no RD Station

## Antes de tudo: confira a oferta
Os textos da oferta ficam no topo de `src/build.py`, no bloco `OFERTA` (título, data, selo e regra).
Depois de mudar, rode `python3 src/build.py` para gerar de novo os arquivos desta pasta.
Oferta atual: 18 meses de contrato + 3 meses grátis (21 meses de solução pagando 18). O prazo de 30/11/2026 às 23:59 ainda é provisório: confirme a data real.

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
- os campos `email`, `mobile_phone` (telefone/WhatsApp, enviado como +55 com DDD), empresa, `cf_numero_de_funcionarios` e `cf_segmento_da_empresa`, mais as UTMs da URL.

Depois do envio, a pessoa vai para `https://material.wispot.com.br/obrigado?event=leadBlackFriday`.
Para mudar o identificador ou a página de obrigado, edite o bloco `RD` no começo de `src/script.js` e rode o build de novo.

O envio só acontece com a página publicada em `wispot.com.br` ou num domínio do RD. Na prévia, o formulário só valida os campos.

**Antes de divulgar:** publique, faça uma conversão de teste com um e-mail seu e confira no RD se o lead chegou com a conversão `black-friday-wispot-2026`.

## Visual
Fundo preto com o azul da Wispot (#25A8E0) e branco; logo branco sobre preto, como na aplicação da camiseta do manual.
Títulos em Outfit (versão para web no lugar da Adineue Pro, que não tem licença gratuita para sites) e textos em Montserrat.

## Imagens
O logo e os logos de clientes vão embutidos no código, então não precisa subir nada. Por isso o arquivo único tem uns 310 KB; se o RD reclamar do tamanho, use a opção B.

## Conteúdo para buscadores e IAs (GEO)
A página é organizada em blocos de pergunta e resposta para ser encontrada e citada por buscadores e assistentes de IA:
- abre com um **Resumo** da oferta;
- cada bloco tem: pergunta como título, resumo de uma ou duas frases, "Principais pontos" e o texto completo;
- dados com fonte numerada (seção Fontes no fim);
- autor e datas de publicação e atualização visíveis;
- dados estruturados (schema.org Article + FAQPage) gerados automaticamente a partir dos blocos.

**Antes de publicar:** preencha o bloco `AUTOR` no topo de `src/build.py` (nome do jornalista, cargo, uma frase de bio e, se houver, o link do perfil) e rode `python3 src/build.py`. Enquanto isso não for feito, a página mostra "TODO" no lugar do autor.

**Manutenção:** a cada 60 a 90 dias, revise os dados e atualize `DATA_ATU` no mesmo bloco. Conteúdo sem atualização perde espaço nas respostas das IAs.
