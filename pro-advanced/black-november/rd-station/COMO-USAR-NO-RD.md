# Landing page "Black November 2026" (Pro Advanced) no RD Station

Conteúdo tirado da régua "Black November 2026 | Pro Advanced": diagnóstico gratuito de Segurança da Informação e Cibersegurança, solicitações de 1º a 30/11/2026, sem custo e sem obrigação de contratar. Execução agendada conforme escopo (a página não promete execução dentro de novembro).

## Arquivos
- `tudo-em-um-bloco-html.html`: a página inteira em um bloco. **Comece por este.**
- `1-bloco-html.html`, `2-css.css`, `3-javascript-body.html`: a mesma página em três partes.

## Opção A: um bloco só
1. RD Station Marketing → Landing Pages → **Criar** → modelo **em branco**.
2. Deixe uma seção só, com **largura total** e **margens internas zeradas**.
3. Arraste um bloco **HTML**, cole `tudo-em-um-bloco-html.html` e salve.

## Opção B: três partes
1. Cole `1-bloco-html.html` no bloco HTML.
2. Em **Edição Avançada**: `2-css.css` na aba **CSS** e `3-javascript-body.html` na aba **JavaScript Body**.

## Formulário
- Token público da conta Pro Advanced (o mesmo da LP da TPN).
- Conversão **`black-november-2026`** (separa estes leads dos outros).
- Campos: `name`, `email`, `mobile_phone` (+55 com DDD), empresa, `cf_cargoselecao`, mais UTMs.
- Depois do envio aparece uma confirmação no próprio formulário. Para usar uma página de obrigado, preencha `thanks` no bloco `RD` de `src/script.js` e rode `python3 src/build.py`.
- O envio só acontece com a página publicada em `proadvanced.com.br` ou num domínio do RD. Faça uma conversão de teste antes de divulgar.

## Prazo
O contador (dias, horas, minutos e segundos) vai até 30/11/2026 às 23:59 (`FIM` em `src/build.py`). Depois disso mostra "Campanha encerrada".
Os e-mails e posts da régua devem apontar para a URL publicada desta página.
