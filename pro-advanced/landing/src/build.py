import os,base64
src=os.path.dirname(os.path.abspath(__file__))
d=src
out=os.path.dirname(src)
css=open(src+'/style.css').read();body=open(src+'/body.html').read();js=open(src+'/script.js').read()
b64=lambda f,m='image/png':'data:'+m+';base64,'+base64.b64encode(open(f,'rb').read()).decode()
ORDER=['microsoft','fortinet','sophos','sentinelone','huawei','acronis','vmware','cisco-meraki','thales','zyxel','outpost24','senhasegura','portnox','vicarius','cybero','phishx','privally','dahua','cambium','apptalk','wiplay','wispot']
NAMES={'cisco-meraki':'Cisco Meraki','sentinelone':'SentinelOne','senhasegura':'senhasegura','vmware':'VMware','phishx':'PhishX','apptalk':'Apptalk','outpost24':'Outpost24','zyxel':'Zyxel'}
parts=[p for p in ORDER if os.path.exists(f'{d}/assets/partners/{p}.png')]
nm=lambda p:NAMES.get(p,p.replace('-',' ').title())
cells=''.join(f'<div><img src="{b64(f"{d}/assets/partners/{p}.png")}" alt="{nm(p)}" loading="lazy"></div>' for p in parts)
def fill(s):
    return s.replace('{{LOGO_COLOR}}',b64(d+'/assets/logo-color-sm.png')).replace('{{LOGO_WHITE}}',b64(d+'/assets/logo-white-sm.png')).replace('{{ICON_MASK}}',b64(d+'/assets/icon-mask.png')).replace('{{PARTNER_CELLS}}',cells)
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
RDFIX='''/* RD Station wraps blocks in a 960px flex column: keep the page full width */
html,body{overflow-x:clip}
.px{width:100vw;max-width:100vw;min-width:0!important;flex:none!important;align-self:flex-start!important}
'''
page=fill(body);script=fill(js)
assert '{{' not in page and '{{' not in script
open(out+'/preview.html','w').write(f'<title>Pro Advanced · Landing Page</title>\n<style>\n{css}\nbody{{margin:0;background:#000}}\n</style>\n{page}\n{libs}\n<script>\n{script}</script>\n')
os.makedirs(out+'/rd-station',exist_ok=True)
open(out+'/rd-station/tudo-em-um-bloco-html.html','w').write(f'<style>\n{RDFIX}{css}\n</style>\n{page}\n{libs}\n<script>\n{script}</script>\n')
open(out+'/rd-station/1-bloco-html.html','w').write(page)
open(out+'/rd-station/2-css.css','w').write(RDFIX+css)
open(out+'/rd-station/3-javascript-body.html','w').write(libs+'\n<script>\n'+script+'</script>\n')
print('built',os.path.getsize(out+'/rd-station/tudo-em-um-bloco-html.html'))
