# Builds the Black Friday LP: preview.html (opens in a browser) and the RD Station kit.
# ▼ A OFERTA FICA AQUI: troque os textos e a data de fim, depois rode: python3 build.py
OFERTA={
  'OFERTA_TITULO':'Implantação grátis + 50% OFF nos 3 primeiros meses',
  'OFERTA_SUB':'Para contratos fechados até 30/11. Vagas de implantação limitadas.',
  'OFERTA_CURTA':'Implantação grátis + 50% OFF por 3 meses',
  'OFERTA_ATE':'30/11',
  'OFERTA_FIM':'2026-11-30T23:59:59-03:00',   # fim do contador (horário de Brasília)
  'BENEFICIO_1':'Implantação grátis',
  'BENEFICIO_1_TXT':'A equipe Wispot configura o portal com a sua marca e deixa tudo funcionando, sem custo de setup.',
  'BENEFICIO_2':'50% OFF nos 3 primeiros meses',
  'BENEFICIO_2_TXT':'Metade do valor da mensalidade no começo, enquanto sua base de contatos cresce.',
  'BENEFICIO_3':'Pronto para as vendas de fim de ano',
  'BENEFICIO_3_TXT':'Comece a capturar contatos no período de maior movimento e chame esses clientes de volta em janeiro.',
  'REGRA':'Condição válida para novos contratos fechados até 30/11/2026. Consulte as regras com um especialista.',
}
import os,glob,base64
d=os.path.dirname(os.path.abspath(__file__))
css=open(d+'/style.css').read(); body=open(d+'/body.html').read(); js=open(d+'/script.js').read()
uri=lambda p:'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
CL=d+'/../../landing-monetize/src/clients/'
ORDER=['carrefour','heineken','applebees','japan-house','johnny-rockets','bendito-cacao','ofner']
logos=''.join(f'<div class="logo-card"><img src="{uri(CL+n+".png")}" alt="{n.replace("-"," ").title()}"></div>' for n in ORDER if os.path.exists(CL+n+'.png'))
for k,v in OFERTA.items():body=body.replace('{{'+k+'}}',v)
A=d+'/assets/'
body=body.replace('{{LOGO_WHITE}}',uri(A+'logo-white.png')).replace('{{LOGO_COLOR}}',uri(A+'logo-color.png')).replace('{{WIFI_BLUE}}',uri(A+'wifi-blue.png')).replace('{{LOGOS}}',logos)
css=css.replace('{{WIFI_BLUE}}',uri(A+'wifi-blue.png'))
js=js.replace('{{WIFI_DATA}}',uri(A+'wifi-white.png')).replace('{{LOGO_DATA}}',uri(A+'logo-white.png'))
assert '{{' not in body and '{{' not in js and '{{' not in css, 'token left'
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
out=d+'/..'
open(out+'/preview.html','w').write(f'<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Black Friday Wispot</title>\n<style>\n{css}\nbody{{margin:0;background:#fff}}\n</style>\n</head>\n<body>\n{body}\n{libs}\n<script>\n{js}</script>\n</body>\n</html>\n')
rd=out+'/rd-station'
open(rd+'/1-bloco-html.html','w').write(body)
open(rd+'/2-css.css','w').write(css)
open(rd+'/3-javascript-body.html','w').write(libs+'\n<script>\n'+js+'</script>\n')
open(rd+'/tudo-em-um-bloco-html.html','w').write('<style>\n'+css+'</style>\n'+body+'\n'+libs+'\n<script>\n'+js+'</script>\n')
print('built',os.path.getsize(rd+'/tudo-em-um-bloco-html.html'))
