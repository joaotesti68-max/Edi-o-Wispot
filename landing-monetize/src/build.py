import sys,os
d=os.path.dirname(os.path.abspath(__file__))  # src/ holds style.css, body.html, script.js; outputs go to ../rd-station
css=open(d+'/style.css').read(); body=open(d+'/body.html').read(); js=open(d+'/script.js').read()
CDN='https://d335luupugsy2.cloudfront.net/cms/files/870990/'
clients=['1739895020/$9hrs3y4cjzv','1739895020/$fo2muk8twn','1739895020/$n0va1pm137i','1739895020/$sbtcp1w2v6j','1739895020/$q1fbqxtbjoh','1739895020/$bz5quhd71ae','1739895020/$0blkp3ho81e','1739895020/$38ggppeu98a']
imgs=''.join(f'<img src="{CDN}{c}" alt="Logo de cliente Wispot" loading="lazy">' for c in clients)
logos=imgs+imgs.replace('alt="Logo de cliente Wispot"','alt="" aria-hidden="true"')
libs='''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>'''
def page(logo):
    return body.replace('{{LOGO}}',logo).replace('{{CLIENT_LOGOS}}',logos)
# preview artifact
prev=f'<title>Monetize seu Wi-Fi</title>\n<style>\nbody{{margin:0;background:#fff}}\n{css}</style>\n{page("assets/logo-blue.png")}\n{libs}\n<script>\n{js}</script>\n'
open(d+'/index.html','w').write(prev)
# RD kit
rdlogo=CDN+'1726599561/$f3z0q825xnf'
open(d+'/rd/1-bloco-html.html','w').write(page(rdlogo))
open(d+'/rd/2-css.css','w').write(css)
open(d+'/rd/3-javascript-body.html','w').write(libs+'\n<script>\n'+js+'</script>\n')
open(d+'/rd/tudo-em-um-bloco-html.html','w').write('<style>\n'+css+'</style>\n'+page(rdlogo)+'\n'+libs+'\n<script>\n'+js+'</script>\n')
print('built')
