/* Pro Advanced · motion. Needs gsap, ScrollTrigger and lenis loaded first; degrades to a static, complete page without them. */
(function(){
  const page=document.getElementById('pa');if(!page)return;
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $=s=>page.querySelector(s),$$=s=>[...page.querySelectorAll(s)];
  const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));

  /* full width when embedded in a narrower column (RD Station blocks) */
  function bleed(){
    const st=page.style;st.setProperty('margin-left','0px','important');st.setProperty('width','auto','important');
    const left=page.getBoundingClientRect().left,w=document.documentElement.clientWidth;
    if(Math.abs(left)<1&&Math.abs(page.offsetWidth-w)<2){st.removeProperty('width');st.removeProperty('margin-left');return}
    st.setProperty('width',w+'px','important');st.setProperty('max-width',w+'px','important');st.setProperty('margin-left',(-left)+'px','important');
  }
  bleed();addEventListener('resize',()=>{bleed();window.ScrollTrigger&&ScrollTrigger.refresh()});

  /* header + mobile menu */
  const hdr=$('#pa-hdr'),mb=$('#pa-menubtn');
  mb.addEventListener('click',()=>{const o=hdr.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Fechar':'Menu'});
  $$('#pa-menu a').forEach(a=>a.addEventListener('click',()=>{hdr.classList.remove('open');mb.setAttribute('aria-expanded',false);mb.textContent='Menu'}));
  let lastY=0;addEventListener('scroll',()=>{const y=scrollY;hdr.classList.toggle('solid',y>40);hdr.classList.toggle('hide',y>320&&y>lastY&&!hdr.classList.contains('open'));lastY=y},{passive:true});

  /* live clock */
  const clk=$('#pa-clock');
  function tick(){try{clk.textContent='São Paulo · '+new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour12:false})}catch(e){}}
  tick();setInterval(tick,1000);

  /* RD Station form (same embed as proadvanced.com.br); static fallback when it can't load */
  (function(){
    const host=document.getElementById('gmk-forms-home-f6a9607991fe0a26527a'),fb=document.getElementById('pa-fallback');if(!host||!fb)return;
    const showFb=()=>{if(!host.children.length){host.hidden=true;fb.hidden=false}};
    try{
      const s=document.createElement('script');s.src='https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';s.async=true;
      s.onload=()=>{try{new RDStationForms('gmk-forms-home-f6a9607991fe0a26527a','null').createForm()}catch(e){}setTimeout(showFb,2500)};
      s.onerror=showFb;document.head.appendChild(s);
    }catch(e){showFb()}
    setTimeout(showFb,6000);
    fb.addEventListener('submit',e=>{e.preventDefault();const msg=fb.querySelector('.msg');
      const miss=[...fb.querySelectorAll('[required]')].find(i=>!i.value.trim());
      if(miss){msg.textContent='Preencha os campos marcados com *.';miss.focus();return}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fb.querySelector('#pa-e').value)){msg.textContent='Confira o e-mail: falta o @ ou o domínio.';return}
      msg.textContent='Prévia: o formulário oficial do RD Station aparece aqui quando a página está publicada. Enquanto isso, escreva para contato@proadvanced.com.br.';
    });
  })();

  /* ---------- dot-matrix signal field (hero) ---------- */
  function Field(cv,opt){
    const ctx=cv.getContext('2d');let W,H,cell,cols,rows,mask,trail,seed,delay,img=null,run=true,t0=performance.now(),mx=-1e3,my=-1e3,lmx=null,lmy=null;
    const iconSrc=(page.querySelector('.hdr img')||{}).src;
    function rnd(i){const x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x)}
    function build(){
      const r=cv.getBoundingClientRect(),d=Math.min(1.5,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);
      cell=W<760?8:10;cols=Math.ceil(W/cell);rows=Math.ceil(H/cell);
      mask=new Float32Array(cols*rows);trail=new Float32Array(cols*rows);seed=new Float32Array(cols*rows);delay=new Float32Array(cols*rows);
      for(let k=0;k<cols*rows;k++)seed[k]=rnd(k+1);
      if(img){
        const oc=document.createElement('canvas');oc.width=cols;oc.height=rows;const o=oc.getContext('2d');
        const mob=W<760,size=mob?rows*.42:Math.min(rows*.86,cols*.42),cx=mob?cols*.5:cols*.73,cy=mob?rows*.24:rows*.5;
        o.drawImage(img,cx-size/2,cy-size/2,size,size);
        const a=o.getImageData(0,0,cols,rows).data;
        for(let k=0;k<cols*rows;k++){mask[k]=a[k*4+3]/255*(mob?.55:1);const i=k%cols,j=(k/cols)|0;delay[k]=.15+Math.hypot(i-cx,j-cy)/size*.9+seed[k]*.5}
      }
    }
    const pal=[];for(let b=0;b<12;b++){const v=b/11;const r=Math.round(40+v*(32-40)+Math.max(0,v-.75)*4*(230-32)),g=Math.round(70+v*(163-70)+Math.max(0,v-.75)*4*(245-163)),bl=Math.round(95+v*(214-95)+Math.max(0,v-.75)*4*(255-214));pal.push(`rgba(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,bl)},${(.18+v*.82).toFixed(2)})`)}
    function stamp(x,y,s){const R=4,x0=Math.max(0,Math.floor(x-R)),x1=Math.min(cols-1,Math.ceil(x+R)),y0=Math.max(0,Math.floor(y-R)),y1=Math.min(rows-1,Math.ceil(y+R));
      for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++){const d2=(i-x)**2+(j-y)**2;if(d2>R*R)continue;const k=j*cols+i;trail[k]=Math.min(1.3,trail[k]+s*Math.exp(-d2/6)*.5)}}
    const host=opt.host||cv.parentElement;
    host.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/cell;my=(e.clientY-r.top)/cell});
    host.addEventListener('pointerleave',()=>{mx=my=-1e3;lmx=lmy=null});
    const buckets=Array.from({length:12},()=>[]);
    function frame(now){
      if(!run)return;requestAnimationFrame(frame);
      const t=(now-t0)/1000;ctx.clearRect(0,0,W,H);
      if(mx>-100){if(lmx!=null){const n=Math.ceil(Math.hypot(mx-lmx,my-lmy));for(let s=0;s<=n;s++)stamp(lmx+(mx-lmx)*s/Math.max(1,n),lmy+(my-lmy)*s/Math.max(1,n),.6)}else stamp(mx,my,.8);lmx=mx;lmy=my}
      const beam=((t*.18)%1.7-.35)*(cols+rows*.5);
      for(let b=0;b<12;b++)buckets[b].length=0;
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const k=j*cols+i;let v=.04+.05*(.5+.5*Math.sin(t*1.3+seed[k]*40));
        const m=mask[k];
        if(m>0){const intro=clamp(0,1,(t-delay[k])/.6);const d=(i+j*.5)-beam;v+=m*intro*(.42+.4*Math.exp(-d*d/60)+.14*Math.sin(t*2+seed[k]*9))}
        trail[k]*=.94;v+=trail[k];
        const bi=Math.min(11,(v*11)|0);if(bi>0)buckets[bi].push(k);
      }
      for(let b=1;b<12;b++){const L=buckets[b];if(!L.length)continue;ctx.fillStyle=pal[b];const s=cell*(.22+b/11*.34),o=(cell-s)/2;
        for(let q=0;q<L.length;q++){const k=L[q];ctx.fillRect((k%cols)*cell+o,((k/cols)|0)*cell+o,s,s)}}
    }
    function start(){if(run)return;run=true;requestAnimationFrame(frame)}
    const im=new Image();im.onload=()=>{img=im;build()};im.src=opt.icon;
    build();requestAnimationFrame(frame);addEventListener('resize',build);
    if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)start();else run=false})).observe(cv);
    return{restart(){t0=performance.now()}};
  }
  const ICON='{{ICON_WHITE}}';
  let field=null;
  if(!reduce){const cv=document.getElementById('pa-field');if(cv)field=Field(cv,{icon:ICON,host:cv.parentElement})}

  /* ---------- static fallback ---------- */
  const HAS=!!(window.gsap&&window.ScrollTrigger);
  const loader=document.querySelector('.pa-loader');
  function revealAll(){root.classList.remove('pa-preload');loader&&loader.remove()}
  if(!HAS||reduce){revealAll();page.classList.add('static');return}

  gsap.registerPlugin(ScrollTrigger);
  page.classList.add('gs');
  const EO='expo.out';

  /* smooth scroll */
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.25,wheelMultiplier:.9});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const tg=id==='#top'?0:document.querySelector(id);if(tg===null||!lenis)return;e.preventDefault();lenis.scrollTo(tg,{offset:id==='#top'?0:-70,duration:1.5})}));

  /* progress bar */
  const prog=document.createElement('div');prog.className='pa-progress';document.body.append(prog);
  gsap.to(prog,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

  /* helpers */
  function splitWords(el){if(!el||el._w)return el?el._w:[];const out=[];
    (function walk(n){[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.append(t);return}const m=document.createElement('span');m.className='wm';const i=document.createElement('span');i.textContent=t;m.append(i);f.append(m);out.push(i)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})})(el);
    return el._w=out}
  const GL='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/*';
  function scramble(el){const node=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(!node)return;const final=node.textContent;const o={p:0};
    gsap.to(o,{p:1,duration:1.1,ease:'power2.out',onUpdate(){const n=Math.floor(o.p*final.length);node.textContent=final.slice(0,n)+final.slice(n).replace(/\S/g,()=>GL[(Math.random()*GL.length)|0])},onComplete(){node.textContent=final}})}

  /* loader (once per session) */
  const intro=gsap.timeline({paused:true});
  const h1w=splitWords($('.hero h1'));
  intro.from(h1w,{yPercent:118,rotate:4,duration:1.3,ease:EO,stagger:.06},0)
    .add(()=>scramble($('.hero .tag')),0)
    .from('.pa .hero .lead, .pa .hero .acts',{y:30,opacity:0,duration:1,ease:EO,stagger:.1},.35)
    .from('.pa .hdr .wrap > *',{y:-20,opacity:0,duration:.8,ease:EO,stagger:.06},.1)
    .from('.pa .ticker',{yPercent:100,duration:1,ease:EO},.5);
  if(root.classList.contains('pa-preload')&&loader){
    try{sessionStorage.setItem('pa-intro','1')}catch(e){}
    lenis&&lenis.stop();
    const lc=document.getElementById('pa-lcv'),lx=lc.getContext('2d'),pct=document.getElementById('pa-lpct'),ln=document.getElementById('pa-lln');
    const lines=['Inicializando proteção','Verificando firewall','Sincronizando backup','Monitorando endpoints','Ambiente protegido'];
    const im=new Image();im.src=ICON;const N=30;let mk=null;
    im.onload=()=>{const oc=document.createElement('canvas');oc.width=oc.height=N;const o=oc.getContext('2d');o.drawImage(im,0,0,N,N);mk=o.getImageData(0,0,N,N).data};
    const st={p:0};
    function draw(){lx.clearRect(0,0,300,300);if(!mk)return;const c=10;for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=mk[(j*N+i)*4+3]/255;if(a<.2)continue;const on=((j*N+i)*7919%997)/997<st.p;lx.fillStyle=on?`rgba(32,163,214,${.4+a*.6})`:'rgba(60,90,115,.35)';const s=on?6:3.5;lx.fillRect(i*c+(c-s)/2,j*c+(c-s)/2,s,s)}}
    gsap.timeline({onComplete:()=>{revealAll();lenis&&lenis.start();ScrollTrigger.refresh()}})
      .to(st,{p:1,duration:2,ease:'power2.inOut',onUpdate(){draw();pct.textContent=String(Math.round(st.p*100)).padStart(3,'0');ln.textContent=lines[Math.min(lines.length-1,Math.floor(st.p*lines.length))]}})
      .to('.pa-loader .in, .pa-loader .pct, .pa-loader .brand',{y:-30,opacity:0,duration:.6,ease:'power3.in'},'+=.15')
      .to(loader,{clipPath:'inset(0% 0% 100% 0%)',duration:1,ease:'power4.inOut'},'-=.2')
      .add(()=>{field&&field.restart();intro.play()},'-=.6');
  }else{revealAll();intro.play()}

  /* headings, tags, leads */
  $$('.split').forEach(h=>{if(h.closest('.hero'))return;gsap.from(splitWords(h),{yPercent:118,rotate:4,duration:1.2,ease:EO,stagger:.045,scrollTrigger:{trigger:h,start:'top 86%'}})});
  $$('.scramble').forEach(e=>{if(e.closest('.hero'))return;ScrollTrigger.create({trigger:e,start:'top 90%',once:true,onEnter:()=>scramble(e)})});
  $$('.head .lead, .years .lead, .contact .lead, .info, .green').forEach(p=>gsap.from(p,{y:30,opacity:0,duration:1.1,ease:EO,scrollTrigger:{trigger:p,start:'top 90%'}}));
  gsap.to('.pa .hero .wrap',{y:120,opacity:.2,ease:'none',scrollTrigger:{trigger:'.pa .hero',start:'top top',end:'bottom top',scrub:true}});

  /* ---------- solutions: 3D ring ---------- */
  const mm=gsap.matchMedia();
  (function(){
    const ring=$('#pa-ring'),cards=$$('.card3'),N=cards.length,step=360/N,wrap=$('#pa-ringwrap');
    const cn=$('#pa-ringn'),ct=$('#pa-ringt');let R=420,scrollRot=0,dragRot=0,cur=0,active=-1,enabled=false;
    const st={rot:0};
    function layout(){const w=cards[0].offsetWidth;R=Math.round(w/(2*Math.tan(Math.PI/N))*1.3)}
    function render(){
      ring.style.transform=`translateZ(${-R}px) rotateX(-8deg) rotateY(${st.rot}deg)`;
      cards.forEach((c,i)=>{const a=((i*step+st.rot)%360+360)%360,cos=Math.cos(a*Math.PI/180);c.style.transform=`rotateY(${i*step}deg) translateZ(${R}px)`;c.style.opacity=(.18+.82*Math.max(0,cos)).toFixed(3);c.style.pointerEvents=cos>.8?'auto':'none'});
      const idx=((Math.round(-st.rot/step)%N)+N)%N;if(idx!==active){active=idx;cn.textContent=String(idx+1).padStart(2,'0');ct.textContent=cards[idx].querySelector('h3').textContent}
    }
    const go=()=>gsap.to(st,{rot:scrollRot+dragRot,duration:.9,ease:'power3.out',overwrite:true,onUpdate:render});
    mm.add('(min-width: 901px)',()=>{
      enabled=true;layout();render();
      const trig=ScrollTrigger.create({trigger:'#solucoes',start:'top top',end:()=>'+='+innerHeight*1.8,pin:true,scrub:true,
        snap:{snapTo:1/(N-1),duration:{min:.2,max:.6},ease:'power2.inOut'},
        onUpdate:s=>{scrollRot=-s.progress*(N-1)*step;go()}});
      let down=false,sx=0,base=0,moved=0;
      const pd=e=>{down=true;moved=0;sx=e.clientX;base=dragRot;ring.classList.add('drag')};
      const pm=e=>{if(!down)return;moved=Math.abs(e.clientX-sx);dragRot=base+(e.clientX-sx)*.28;go()};
      const pu=()=>{if(!down)return;down=false;ring.classList.remove('drag');dragRot=Math.round(dragRot/step)*step;go()};
      wrap.addEventListener('pointerdown',pd);addEventListener('pointermove',pm);addEventListener('pointerup',pu);
      wrap.addEventListener('click',e=>{if(moved>6){e.preventDefault();e.stopPropagation()}},true);
      const nx=()=>{dragRot-=step;go()},pv=()=>{dragRot+=step;go()};
      $('#pa-next').addEventListener('click',nx);$('#pa-prev').addEventListener('click',pv);
      addEventListener('resize',()=>{layout();render()});
      gsap.from(cards,{y:120,opacity:0,duration:1.2,ease:EO,stagger:.06,scrollTrigger:{trigger:'#solucoes',start:'top 70%'}});
      return()=>{enabled=false;trig.kill();ring.style.transform='';cards.forEach(c=>{c.style.transform='';c.style.opacity='';c.style.pointerEvents=''})};
    });
    mm.add('(max-width: 900px)',()=>{gsap.from(cards,{x:60,opacity:0,duration:1,ease:EO,stagger:.08,scrollTrigger:{trigger:ring,start:'top 85%'}})});
  })();

  /* ---------- why: active item + console ---------- */
  (function(){
    const sec=$('#sobre'),items=$$('#pa-wlist li'),pre=$('#pa-con'),bars=$$('.console .meter b');
    const LOG=[
      ['> varredura de vulnerabilidades --ambiente produção','  ativos analisados ............ 142','  ameaças bloqueadas hoje ...... 37','  vulnerabilidades críticas .... 0 ✓'],
      ['> status --infraestrutura --seguranca','  servidores .......... online ✓','  firewall ............ ativo ✓','  endpoints ........... protegidos ✓','  backup 03:00 ........ concluído ✓'],
      ['> novo-projeto --perfil sua-empresa','  levantamento do ambiente ..... ok ✓','  riscos mapeados .............. ok ✓','  arquitetura sob medida ....... pronta ✓'],
      ['> chamado #4821 aberto 09:12','  especialista atribuído ....... 09:13','  diagnóstico .................. 09:20','  resolvido .................... 09:41 ✓'],
      ['> auditoria --lgpd --controles','  políticas revisadas .......... ok ✓','  controle de acessos .......... ok ✓','  evidências documentadas ...... ok ✓'],
      ['> relatório mensal --enviar','  ambiente estável ............. ✓','  incidentes evitados .......... ✓','  sua equipe: focada no que importa ✓']
    ];
    let typing=null,cur=-1;
    function show(i){if(i===cur)return;cur=i;items.forEach((li,k)=>li.classList.toggle('on',k===i));
      bars.forEach((b,k)=>gsap.to(b,{scaleX:k<=i?1:0,duration:.6,ease:'power2.out'}));
      if(typing)typing.kill();pre.innerHTML='';const lines=LOG[i];const o={c:0};const total=lines.join('\n').length;
      typing=gsap.to(o,{c:total,duration:Math.min(2.2,total*.016),ease:'none',onUpdate(){let n=Math.floor(o.c),html='';
        lines.forEach((l,li)=>{if(n<=0)return;const part=l.slice(0,n);n-=l.length+1;const esc=part.replace(/&/g,'&amp;').replace(/</g,'&lt;');html+=(li===0?'<span class="cmd">'+esc+'</span>':esc.replace('✓','<span class="ok">✓</span>'))+'\n'});
        pre.innerHTML=html+'<span class="caret"></span>'}});
    }
    items.forEach((li,i)=>li.addEventListener('click',()=>show(i)));
    show(0);
    mm.add('(min-width: 901px)',()=>{
      const fits=sec.offsetHeight<=innerHeight*1.02;
      if(fits){sec.classList.add('pin');const t=ScrollTrigger.create({trigger:sec,start:'top top',end:()=>'+='+innerHeight*2.2,pin:true,scrub:true,onUpdate:s=>show(Math.min(items.length-1,Math.floor(s.progress*items.length)))});return()=>{sec.classList.remove('pin');t.kill()}}
      const ts=items.map((li,i)=>ScrollTrigger.create({trigger:li,start:'top 60%',end:'bottom 60%',onToggle:s=>s.isActive&&show(i)}));
      return()=>ts.forEach(t=>t.kill());
    });
    gsap.from(items,{x:-30,opacity:0,duration:1,ease:EO,stagger:.07,scrollTrigger:{trigger:'#pa-wlist',start:'top 85%'}});
    gsap.from('.pa .console',{y:60,rotate:2,opacity:0,duration:1.3,ease:EO,scrollTrigger:{trigger:'.pa .console',start:'top 85%'}});
  })();

  /* ---------- years ---------- */
  (function(){const n=$('#pa-yr'),o={v:0};
    ScrollTrigger.create({trigger:'.pa .years',start:'top 75%',once:true,onEnter:()=>gsap.to(o,{v:27,duration:2.2,ease:'power3.out',onUpdate(){n.textContent=Math.round(o.v)}})});
    gsap.to('.pa .tl .ln b',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.pa .tl',start:'top 90%',end:'top 45%',scrub:true}});
    gsap.from('.pa .tl .pt',{scale:0,duration:.6,ease:'back.out(2)',stagger:.25,scrollTrigger:{trigger:'.pa .tl',start:'top 85%'}});
    gsap.from('.pa .yr',{yPercent:30,opacity:0,duration:1.4,ease:EO,scrollTrigger:{trigger:'.pa .years',start:'top 80%'}});
  })();

  /* ---------- segments ---------- */
  const segs=$$('.seg');gsap.set(segs,{y:50,opacity:0});
  ScrollTrigger.batch(segs,{start:'top 92%',once:true,onEnter:b=>gsap.to(b,{y:0,opacity:1,duration:1,ease:EO,stagger:.06,overwrite:true})});
  segs.forEach(s=>s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();s.style.setProperty('--mx',(e.clientX-r.left)+'px');s.style.setProperty('--my',(e.clientY-r.top)+'px')}));

  /* ---------- cases: horizontal pin ---------- */
  (function(){
    const track=$('#pa-ctrack'),cs=$$('.case'),bar=$('#pa-cbar'),cn=$('#pa-cn');
    mm.add('(min-width: 901px)',()=>{
      const dist=()=>Math.max(0,track.scrollWidth-track.parentElement.clientWidth+parseFloat(getComputedStyle(track.parentElement).paddingRight));
      const tw=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#cases',start:'top top',end:()=>'+='+(dist()+innerHeight*.5),pin:true,scrub:1,invalidateOnRefresh:true,
        onUpdate:s=>{gsap.set(bar,{scaleX:.2+.8*s.progress});cn.textContent=String(Math.min(cs.length,1+Math.floor(s.progress*cs.length*.999))).padStart(2,'0')+' / '+String(cs.length).padStart(2,'0')}}});
      cs.forEach(c=>gsap.from(c.querySelector('.num'),{yPercent:60,opacity:0,duration:1,ease:EO,scrollTrigger:{trigger:c,containerAnimation:tw,start:'left 90%'}}));
      return()=>{tw.scrollTrigger&&tw.scrollTrigger.kill();tw.kill();gsap.set(track,{x:0})};
    });
    gsap.from(cs,{y:70,opacity:0,duration:1.1,ease:EO,stagger:.08,scrollTrigger:{trigger:track,start:'top 85%'}});
  })();

  /* ---------- partners marquee (speeds up with scroll) ---------- */
  (function(){
    const rows=$$('.ptrack');if(!rows.length)return;const base=[...rows[0].children];
    rows.forEach((t,ri)=>{const src=ri?base.slice().reverse():base;t.innerHTML='';for(let h=0;h<2;h++)src.forEach(n=>{const c=n.cloneNode(true);if(ri||h){c.alt='';c.setAttribute('aria-hidden','true')}t.append(c)})});
    const loops=rows.map((t,ri)=>gsap.fromTo(t,{xPercent:ri?-50:0},{xPercent:ri?0:-50,duration:55,ease:'none',repeat:-1}));
    let boost=null;ScrollTrigger.create({trigger:'.pa .parts',start:'top bottom',end:'bottom top',onUpdate:s=>{const v=clamp(1,6,1+Math.abs(s.getVelocity())/260);loops.forEach(l=>l.timeScale(v));boost&&boost.kill();boost=gsap.to(loops,{timeScale:1,duration:1.2,ease:'power2.out',delay:.1})}});
  })();

  /* ---------- blog + contact ---------- */
  gsap.from('.pa .post',{y:60,opacity:0,duration:1.1,ease:EO,stagger:.08,scrollTrigger:{trigger:'.pa .posts',start:'top 85%'}});
  gsap.from('.pa .fbox',{y:70,rotate:-2,opacity:0,duration:1.3,ease:EO,scrollTrigger:{trigger:'.pa .contact',start:'top 70%'}});
  gsap.fromTo('.pa .contact .rings',{scale:.6,rotate:0},{scale:1.3,rotate:40,ease:'none',scrollTrigger:{trigger:'.pa .contact',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.pa .fgrid > div',{y:30,opacity:0,duration:1,ease:EO,stagger:.08,scrollTrigger:{trigger:'.pa .ftr',start:'top 92%'}});

  /* ---------- cursor + magnetic buttons ---------- */
  if(fine){
    const c=document.createElement('div');c.className='pa-cursor';c.setAttribute('aria-hidden','true');c.innerHTML='<span></span>';document.body.append(c);
    const lab=c.firstChild,xs=gsap.quickTo(c,'x',{duration:.3,ease:'power3'}),ys=gsap.quickTo(c,'y',{duration:.3,ease:'power3'});
    addEventListener('mousemove',e=>{xs(e.clientX);ys(e.clientY)});
    document.addEventListener('mouseover',e=>{const t=e.target.closest('.pa [data-cursor]');if(t&&!e.target.closest('a.btn,button,input,textarea,select,.fbox')){lab.textContent=t.dataset.cursor;c.classList.add('big')}else c.classList.remove('big');c.classList.toggle('hide',!!e.target.closest('.pa .btn,.pa input,.pa textarea,.pa select,.pa .hdr nav'))});
    document.addEventListener('mouseleave',()=>c.classList.add('hide'));
    $$('.btn').forEach(b=>{const xT=gsap.quickTo(b,'x',{duration:.6,ease:'power3'}),yT=gsap.quickTo(b,'y',{duration:.6,ease:'power3'});
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();xT((e.clientX-r.left-r.width/2)*.25);yT((e.clientY-r.top-r.height/2)*.4)});b.addEventListener('mouseleave',()=>{xT(0);yT(0)})});
  }

  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ScrollTrigger.refresh());
  addEventListener('load',()=>ScrollTrigger.refresh());
})();
