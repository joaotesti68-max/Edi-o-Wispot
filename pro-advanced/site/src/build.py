import os,glob,base64,sys
src=os.path.dirname(os.path.abspath(__file__))
d=os.path.dirname(src)  # site/ (assets live here)
css=open(src+'/style.css').read();body=open(src+'/body.html').read();js=open(src+'/script.js').read()
b64=lambda f,m='image/png':'data:'+m+';base64,'+base64.b64encode(open(f,'rb').read()).decode()
ORDER=['microsoft','fortinet','sophos','sentinelone','huawei','acronis','vmware','cisco-meraki','thales','zyxel','outpost24','senhasegura','portnox','vicarius','cybero','phishx','privally','dahua','cambium','apptalk','wiplay','wispot']
NAMES={'cisco-meraki':'Cisco Meraki','sentinelone':'SentinelOne','senhasegura':'senhasegura','vmware':'VMware','phishx':'PhishX','apptalk':'Apptalk','outpost24':'Outpost24','zyxel':'Zyxel'}
parts=[p for p in ORDER if os.path.exists(f'{d}/assets/partners/{p}.png')]
nm=lambda p:NAMES.get(p,p.replace('-',' ').title())
def render(embed):
    src=(lambda rel,m='image/png':b64(d+'/'+rel,m)) if embed else (lambda rel,m=None:rel)
    cells=''.join(f'<div><img src="{src(f"assets/partners/{p}.png")}" alt="{nm(p)}" loading="lazy"></div>' for p in parts)
    def fill(s):
        s=s.replace('{{LOGO_COLOR}}',src('assets/logo-color-sm.png')).replace('{{LOGO_WHITE}}',src('assets/logo-white-sm.png')).replace('{{ICON_MASK}}',b64(d+'/assets/icon-mask.png')).replace('{{PARTNER_CELLS}}',cells)
        for f in glob.glob(d+'/assets/blog/*.jpg'):
            k=os.path.basename(f)[:-4];s=s.replace('{{BLOG_'+k+'}}',src('assets/blog/'+k+'.jpg','image/jpeg'))
        return s
    return fill(body),fill(js)
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
page,script=render(False)
open(d+'/index.html','w').write(f'<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>Pro Advanced | Gestão de TI e Cibersegurança</title>\n<meta name="description" content="Gestão completa de TI e Cibersegurança para empresas que não podem parar.">\n<style>\n{css}\nbody{{margin:0;background:#fff}}\n</style>\n</head>\n<body>\n{page}\n{libs}\n<script>\n{script}</script>\n</body>\n</html>\n')
print('built')
