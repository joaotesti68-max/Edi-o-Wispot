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

## Importante: mantenha o formulário do próprio RD na página
As estatísticas da LP no RD só contam conversões feitas pelo bloco de formulário do RD. Por isso:
1. Deixe um bloco **Formulário** do RD na página (qualquer lugar), com os campos Nome, E-mail, Empresa e Cargo (ou os que a conta usar).
2. O nosso código esconde esse formulário e, quando a pessoa envia o nosso, preenche e envia o do RD por trás (inclusive a conta de soma do captcha). Assim o lead entra e aparece nas estatísticas da LP.
3. A página de obrigado é a que estiver configurada no formulário do RD.
4. Se a página não tiver o formulário do RD, o lead é enviado pela API: entra na base de leads com a conversão, mas não aparece nas estatísticas da LP.
