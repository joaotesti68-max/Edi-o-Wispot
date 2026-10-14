import re,sys,os
d=os.path.dirname(os.path.abspath(__file__))
s=open(d+'/../../site/src/body.html').read()
# nav: logo + CTA only
s=re.sub(r'\s*<ul id="px-menu">.*?</ul>','',s,flags=re.S)
s=re.sub(r'\s*<button class="burger".*?</button>','',s,flags=re.S)
s=s.replace('<a class="btn solid" href="#contato">Fale com um especialista</a>','<a class="btn solid" href="#contato"><span class="l">Fale com um especialista</span><span class="s">Fale conosco</span></a>',1)
# drop blog
s=re.sub(r'\s*<!-- 07 BLOG -->.*?</section>','',s,count=1,flags=re.S)
s=s.replace('<span data-n="07">07</span>','<span data-n="06">06</span>')
# minimal footer: keep brand + contact column
s=re.sub(r'\s*<div><h4>Institucional</h4>.*?</div>','',s,count=1,flags=re.S)
s=re.sub(r'\s*<div><h4>Soluções</h4>.*?</div>','',s,count=1,flags=re.S)
s=re.sub(r'\s*<div><h4>Segmentos</h4>.*?</div>','',s,count=1,flags=re.S)
s=s.replace('<li><a href="https://proadvanced.com.br/contato/">Trabalhe conosco</a></li>','<li><a href="https://proadvanced.com.br/" target="_blank" rel="noopener">Visite o site</a></li>')
s=s.replace('sessionStorage.getItem(\'px-intro\')','sessionStorage.getItem(\'px-lp-intro\')')
assert '{{BLOG_' not in s and 'px-menu' not in s and 'Institucional' not in s
open(d+'/body.html','w').write(s)
