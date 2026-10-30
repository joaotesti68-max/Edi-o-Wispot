# Instruções do projeto

Este repositório guarda as landing pages (LPs) da Wispot e da Pro Advanced, publicadas no RD Station. Responda sempre em português.

## Como montar toda LP (padrão para buscadores e IAs)

A chance de compra por indicação de IA é maior do que por pesquisa, então todo conteúdo abaixo do topo (hero + formulário) segue esta estrutura:

- **Perguntas como subtítulos.** Cada bloco responde uma dúvida individual, com a pergunta como H2. Pensar nas subconsultas que a IA faz (fan-outs) e cobrir cada uma em um bloco ou nas perguntas rápidas.
- **Estrutura de cada bloco:**
  1. Título (a pergunta)
  2. "Principais pontos": os itens que a pessoa deve memorizar
  3. Conteúdo descritivo completo
- **Coerência entre blocos:** cada bloco termina puxando o próximo, para o texto ter continuidade (as IAs associam o texto às dúvidas).
- **Dados atualizados e factuais:** estatísticas e estudos com fonte, citados com número entre colchetes e uma seção "Fontes" no fim da página. Conferir se cada link abre antes de publicar. Nunca inventar números.
- **Perguntas rápidas:** um FAQ curto (accordion) com as dúvidas paralelas.
- **Dados estruturados:** JSON-LD com Article (autor = a própria empresa, `dateModified`) + FAQPage, gerado pelo build a partir dos próprios blocos.
- **Atualização:** conteúdo sem atualização por cerca de 90 dias perde espaço nas IAs. Manter `DATA_ATU` no build e revisar os dados a cada 60 a 90 dias.
- **O KPI é estar presente ao longo da jornada do cliente**, não quantas vezes a página foi citada.

O que o cliente pediu para NÃO usar nas LPs:
- Resumo no início da página ou dentro de cada bloco.
- Assinatura de jornalista (byline e caixa "Sobre o autor"). Isso é para blog, não para LP.

## Outras convenções
- Formulário no topo, junto do hero. Campos com telefone/WhatsApp (máscara, validação, enviado ao RD como `mobile_phone` com +55).
- Cada LP tem `src/` (body.html, style.css, script.js, build.py), `rd-station/` (4 arquivos + COMO-USAR-NO-RD.md) e `preview.html`. Rodar `python3 src/build.py` depois de qualquer mudança.
- Wispot: manual de marca (azul #25A8E0 / #0B91C1, branco, cinza #514D4B, Montserrat). Pro Advanced: cores e layout do site proadvanced.com.br (navy #000c19, azul #2BA3DB → #68C5DB, Montserrat).
- Usar a skill `antiwebslop` ao montar ou revisar páginas.
