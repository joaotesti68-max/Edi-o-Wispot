# Builds the Black Friday LP: preview.html (opens in a browser) and the RD Station kit.
# ▼ A OFERTA FICA AQUI: troque os textos e a data de fim, depois rode: python3 build.py
OFERTA={
  'OFERTA_TITULO':'18 meses de contrato + 3 meses grátis',
  'OFERTA_SUB':'Você garante 21 meses de solução pagando apenas 18.',
  'OFERTA_CURTA':'18 meses de contrato + 3 grátis',
  'OFERTA_ATE':'30/11',
  'OFERTA_FIM':'2026-11-30T23:59:59-03:00',   # fim do contador (horário de Brasília)
  'STICKER':'Meses grátis · 21 pagando 18 · ',  # texto que gira no selo
  'STICKER_MEIO':'+3',
  'REGRA':'Condição válida para novos contratos de 18 meses fechados até 30/11/2026: você ganha 3 meses grátis e garante 21 meses de solução pagando apenas 18. Consulte as regras com um especialista.',
  'OFERTA_ATE_LONGA':'30 de novembro de 2026',
}
# ▼ AUTOR E DATAS (o Google e as IAs valorizam autoria real e conteúdo atualizado; revise a cada 60 a 90 dias)
AUTOR={
  'AUTOR_NOME':'TODO: nome do(a) jornalista',
  'AUTOR_CARGO':'jornalista',
  'AUTOR_BIO':'TODO: uma frase sobre a experiência do autor com varejo e tecnologia.',
  'AUTOR_URL':'',            # link do perfil do autor (LinkedIn ou página de autor), opcional
  'DATA_PUB':'2026-10-29',
  'DATA_ATU':'2026-10-29',
}
PAGINA_URL=''                 # URL publicada da LP (preencha depois de publicar no RD)
import os,base64,html
d=os.path.dirname(os.path.abspath(__file__))
css=open(d+'/style.css').read(); body=open(d+'/body.html').read(); js=open(d+'/script.js').read()
uri=lambda p:'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
CL=d+'/../../landing-monetize/src/clients/'
ORDER=['carrefour','heineken','applebees','japan-house','johnny-rockets','bendito-cacao','ofner']
logos=''.join(f'<div class="logo-card"><img src="{uri(CL+n+".png")}" alt="{n.replace("-"," ").title()}"></div>' for n in ORDER if os.path.exists(CL+n+'.png'))
import re,json,datetime
br=lambda d:datetime.date.fromisoformat(d).strftime('%d/%m/%Y')
AUTOR['DATA_PUB_BR']=br(AUTOR['DATA_PUB']);AUTOR['DATA_ATU_BR']=br(AUTOR['DATA_ATU'])
for k,v in {**OFERTA,**AUTOR}.items():body=body.replace('{{'+k+'}}',v)
if 'TODO' in AUTOR['AUTOR_NOME']:print('ATENÇÃO: preencha o nome do autor (AUTOR_NOME) antes de publicar')
# structured data: Article + FAQPage built from the question blocks, so they always match the page
txt=lambda h:re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',h))).strip()
qas=[(txt(q),txt(a)) for q,a in re.findall(r'<section class="qa"[^>]*>\s*<h2>(.*?)</h2>\s*<p class="qa-sum"><span>Resumo</span>(.*?)</p>',body,re.S)]
qas+=[(txt(q),txt(a)) for q,a in re.findall(r'<details><summary>(.*?)</summary><p>(.*?)</p></details>',body,re.S)]
summary=txt(re.search(r'<section class="summary"[^>]*>.*?<p>(.*?)</p>',body,re.S).group(1))
author={'@type':'Person','name':AUTOR['AUTOR_NOME'],'jobTitle':AUTOR['AUTOR_CARGO']}
if AUTOR['AUTOR_URL']:author['url']=AUTOR['AUTOR_URL']
ld={'@context':'https://schema.org','@graph':[
  {'@type':'Article','headline':txt(re.search(r'<h1 class="h1">(.*?)</h1>',body,re.S).group(1)),'description':summary,'inLanguage':'pt-BR',
   'author':author,'datePublished':AUTOR['DATA_PUB'],'dateModified':AUTOR['DATA_ATU'],
   'publisher':{'@type':'Organization','name':'Wispot','url':'https://wispot.com.br'},**({'url':PAGINA_URL} if PAGINA_URL else {})},
  {'@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in qas]}]}
body=body.replace('{{JSONLD}}',json.dumps(ld,ensure_ascii=False).replace('</','<\\/'))
A=d+'/assets/'
body=body.replace('{{LOGO_WHITE}}',uri(A+'logo-white.png')).replace('{{LOGOS}}',logos)
assert '{{' not in body and '{{' not in js and '{{' not in css, 'token left'
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
out=d+'/..'
open(out+'/preview.html','w').write(f'<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Black Friday Wispot</title>\n<style>\n{css}\nbody{{margin:0;background:#050608}}\n</style>\n</head>\n<body>\n{body}\n{libs}\n<script>\n{js}</script>\n</body>\n</html>\n')
rd=out+'/rd-station'
open(rd+'/1-bloco-html.html','w').write(body)
open(rd+'/2-css.css','w').write(css)
open(rd+'/3-javascript-body.html','w').write(libs+'\n<script>\n'+js+'</script>\n')
open(rd+'/tudo-em-um-bloco-html.html','w').write('<style>\n'+css+'</style>\n'+body+'\n'+libs+'\n<script>\n'+js+'</script>\n')
print('built',os.path.getsize(rd+'/tudo-em-um-bloco-html.html'))
