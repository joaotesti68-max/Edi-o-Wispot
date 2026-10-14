import os,glob
d=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # site/ (assets live here)
src=os.path.dirname(os.path.abspath(__file__))
css=open(src+'/style.css').read();body=open(src+'/body.html').read();js=open(src+'/script.js').read()
ORDER=['microsoft','fortinet','sophos','sentinelone','huawei','acronis','vmware','cisco-meraki','thales','zyxel','outpost24','senhasegura','portnox','vicarius','cybero','phishx','privally','dahua','cambium','apptalk','wiplay','wispot']
NAMES={'cisco-meraki':'Cisco Meraki','sentinelone':'SentinelOne','senhasegura':'senhasegura','vmware':'VMware','phishx':'PhishX','apptalk':'Apptalk','outpost24':'Outpost24','zyxel':'Zyxel'}
parts=[p for p in ORDER if os.path.exists(f'{d}/assets/partners/{p}.png')]
nm=lambda p:NAMES.get(p,p.replace('-',' ').title())
A=''.join(f'<img src="assets/partners/{p}.png" alt="{nm(p)}" loading="lazy">' for p in parts)
def fill(s):
    import base64
    s=s.replace('{{LOGO_WHITE}}','assets/logo-white.png').replace('{{ICON_WHITE}}','data:image/png;base64,'+base64.b64encode(open(d+'/assets/icon-mask.png','rb').read()).decode())
    s=s.replace('{{PARTNERS_A}}',A).replace('{{PARTNERS_B}}','').replace('{{PARTNER_NAMES}}',', '.join(nm(p) for p in parts))
    for f in glob.glob(d+'/assets/blog/*.jpg'):
        k=os.path.basename(f)[:-4];s=s.replace('{{BLOG_'+k+'}}','assets/blog/'+k+'.jpg')
    return s
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
page=fill(body);script=fill(js)
art=f'<title>Pro Advanced</title>\n<style>\n{css}\nbody{{margin:0;background:#07131d}}\n</style>\n{page}\n{libs}\n<script>\n{script}</script>\n'
# artifact preview not needed in the repo
full=f'<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>Pro Advanced | Gestão de TI e Cibersegurança</title>\n<meta name="description" content="Gestão completa de TI e Cibersegurança para empresas que não podem parar.">\n<style>\n{css}\nbody{{margin:0;background:#07131d}}\n</style>\n</head>\n<body>\n{page}\n{libs}\n<script>\n{script}</script>\n</body>\n</html>\n'
open(d+'/index.html','w').write(full)
print('built',len(art))
