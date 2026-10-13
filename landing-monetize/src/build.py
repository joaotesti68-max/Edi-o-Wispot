import sys,os
d=os.path.dirname(os.path.abspath(__file__))
css=open(d+'/style.css').read(); body=open(d+'/body.html').read(); js=open(d+'/script.js').read()
CDN='https://d335luupugsy2.cloudfront.net/cms/files/870990/'
import base64,glob
# client logos live in clients/*.png (transparent, trimmed); listed in this order, the rest alphabetically
ORDER=['carrefour','heineken','applebees','japan-house','johnny-rockets','bendito-cacao','ofner']
files=sorted(glob.glob(d+'/clients/*.png'),key=lambda f:(ORDER.index(os.path.basename(f)[:-4]) if os.path.basename(f)[:-4] in ORDER else 99,f))
def name(f):return os.path.basename(f)[:-4].replace('-',' ').title()
one=[(name(f),'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()) for f in files]
reps=max(1,-(-10//max(1,len(one))))  # each half of the loop holds at least 10 logos
half=one*reps
def cards(items,hide_all=False):
    return ''.join(f'<div class="logo-card"><img src="{u}" alt="{"" if hide_all or i>=len(one) else n}"{" aria-hidden=\"true\"" if hide_all or i>=len(one) else ""}></div>' for i,(n,u) in enumerate(items))
row=half+half
row2=list(reversed(half))+list(reversed(half))
logos=None
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
screens=''.join(f'<img class="scr s{i}" src="data:image/jpeg;base64,'+base64.b64encode(open(f'{d}/screens/s{i}.jpg','rb').read()).decode()+'" alt="">' for i in range(7))
def page(logo):
    return body.replace('{{SCREENS}}',screens).replace('{{LOGO}}',logo).replace('{{ROW1}}',cards(one)).replace('{{ROW2}}','')
# preview artifact
prev=f'<title>Monetize seu Wi-Fi</title>\n<style>\n{css}\nbody{{margin:0;background:#fff}}\n</style>\n{page("../site/assets/logo-blue.png")}\n{libs}\n<script>\n{js}</script>\n'
open(d+'/../preview.html','w').write(prev)
# RD kit
rdlogo=CDN+'1726599561/$f3z0q825xnf'
open(d+'/../rd-station/1-bloco-html.html','w').write(page(rdlogo))
open(d+'/../rd-station/2-css.css','w').write(css)
open(d+'/../rd-station/3-javascript-body.html','w').write(libs+'\n<script>\n'+js+'</script>\n')
open(d+'/../rd-station/tudo-em-um-bloco-html.html','w').write('<style>\n'+css+'</style>\n'+page(rdlogo)+'\n'+libs+'\n<script>\n'+js+'</script>\n')
print('built')
