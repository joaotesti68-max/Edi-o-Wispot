import os,glob,base64
d=os.path.dirname(os.path.abspath(__file__))
css=open(d+'/style.css').read();body=open(d+'/body.html').read();js=open(d+'/script.js').read()
b64=lambda f,m='image/png':'data:'+m+';base64,'+base64.b64encode(open(f,'rb').read()).decode()
ORDER=['microsoft','fortinet','sophos','sentinelone','huawei','acronis','vmware','cisco-meraki','thales','zyxel','outpost24','senhasegura','portnox','vicarius','cybero','phishx','privally','dahua','cambium','apptalk','wiplay','wispot']
NAMES={'cisco-meraki':'Cisco Meraki','sentinelone':'SentinelOne','senhasegura':'senhasegura','vmware':'VMware','phishx':'PhishX','apptalk':'Apptalk','outpost24':'Outpost24','zyxel':'Zyxel'}
parts=[p for p in ORDER if os.path.exists(f'{d}/assets/partners/{p}.png')]
nm=lambda p:NAMES.get(p,p.replace('-',' ').title())
A=''.join(f'<img src="{b64(f"{d}/assets/partners/{p}.png")}" alt="{nm(p)}" loading="lazy">' for p in parts)
LOGO=b64(d+'/assets/logo-white-sm.png');ICON=b64(d+'/assets/icon-mask.png')
def fill(s):
    return s.replace('{{LOGO_WHITE}}',LOGO).replace('{{ICON_WHITE}}',ICON).replace('{{PARTNERS_A}}',A).replace('{{PARTNERS_B}}','').replace('{{PARTNER_NAMES}}',', '.join(nm(p) for p in parts))
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
RDFIX='''/* RD Station wraps blocks in a 960px flex column: keep the page full width */
html,body{overflow-x:clip}
.pa{width:100vw;max-width:100vw;min-width:0!important;flex:none!important;align-self:flex-start!important}
'''
page=fill(body);script=fill(js)
open(d+'/../preview.html','w').write(f'<title>Pro Advanced · Landing Page</title>\n<style>\n{css}\nbody{{margin:0;background:#07131d}}\n</style>\n{page}\n{libs}\n<script>\n{script}</script>\n')
os.makedirs(d+'/../rd-station',exist_ok=True)
open(d+'/../rd-station/tudo-em-um-bloco-html.html','w').write(f'<style>\n{RDFIX}{css}\n</style>\n{page}\n{libs}\n<script>\n{script}</script>\n')
open(d+'/../rd-station/1-bloco-html.html','w').write(page)
open(d+'/../rd-station/2-css.css','w').write(RDFIX+css)
open(d+'/../rd-station/3-javascript-body.html','w').write(libs+'\n<script>\n'+script+'</script>\n')
print('built',os.path.getsize(d+'/../rd-station/tudo-em-um-bloco-html.html'))
