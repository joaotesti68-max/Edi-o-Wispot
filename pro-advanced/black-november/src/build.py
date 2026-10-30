# Builds the Black November LP: preview.html (opens in a browser) and the RD Station kit.
import os,base64
d=os.path.dirname(os.path.abspath(__file__))
css=open(d+'/style.css').read(); body=open(d+'/body.html').read(); js=open(d+'/script.js').read()
uri=lambda p:'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
FIM='2026-11-30T23:59:59-03:00'   # fim do prazo para solicitar (horário de Brasília)
body=body.replace('{{LOGO}}',uri(d+'/assets/logo-dark-sm.png')).replace('{{FIM}}',FIM)
assert '{{' not in body and '{{' not in js, 'token left'
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
out=d+'/..'
open(out+'/preview.html','w').write(f'<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Black November Pro Advanced</title>\n<style>\n{css}\nbody{{margin:0;background:#000c19}}\n</style>\n</head>\n<body>\n{body}\n{libs}\n<script>\n{js}</script>\n</body>\n</html>\n')
rd=out+'/rd-station'
open(rd+'/1-bloco-html.html','w').write(body)
open(rd+'/2-css.css','w').write(css)
open(rd+'/3-javascript-body.html','w').write(libs+'\n<script>\n'+js+'</script>\n')
open(rd+'/tudo-em-um-bloco-html.html','w').write('<style>\n'+css+'</style>\n'+body+'\n'+libs+'\n<script>\n'+js+'</script>\n')
print('built',os.path.getsize(rd+'/tudo-em-um-bloco-html.html'))
